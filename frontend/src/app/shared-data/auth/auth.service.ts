import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export type StaffRole = 'ADMIN' | 'DISPATCH' | 'DRIVER';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: StaffRole;
}

interface SessionPayload {
  token: string;
  user: User;
}

const STORAGE_KEY = 'staff_session_v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authUrl = `${environment.apiBaseUrl}/api/auth/login`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadSession()?.user ?? null);
  private currentToken = this.loadSession()?.token ?? null;
  currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient) {}

  user(): User {
    return this.currentUserSubject.value ?? {
      id: 'u-anon',
      tenantId: 't-demo',
      name: 'Anonymous',
      email: 'anonymous@company.com',
      role: 'DISPATCH',
    };
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasAnyRole(roles: StaffRole[]): boolean {
    const u = this.currentUserSubject.value;
    return !!u && roles.includes(u.role);
  }

  token(): string | null {
    return this.currentToken;
  }

  login(email: string, password: string) {
    return this.http.post<{ data: { token: string; role: StaffRole; username: string } }>(
      this.authUrl,
      { username: email.trim().toLowerCase(), password }
    ).pipe(
      map((res) => {
        const payload: SessionPayload = {
          token: res.data.token,
          user: {
            id: `u-${res.data.username}`,
            tenantId: 't-demo',
            name: res.data.username,
            email: email.trim().toLowerCase(),
            role: res.data.role,
          },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        this.currentToken = payload.token;
        this.currentUserSubject.next(payload.user);
        return { ok: true as const };
      }),
      catchError((err) => of({
        ok: false as const,
        message: err?.error?.message || 'Invalid credentials.',
      }))
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentToken = null;
    this.currentUserSubject.next(null);
    // TODO: Call POST /api/auth/logout and revoke refresh token.
  }

  private loadSession(): SessionPayload | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SessionPayload;
    } catch {
      return null;
    }
  }
}
