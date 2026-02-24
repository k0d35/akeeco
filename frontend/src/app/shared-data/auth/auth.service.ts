import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

const MOCK_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'admin@company.com',
    password: 'admin123',
    user: { id: 'u-admin', tenantId: 't-demo', name: 'Operations Admin', email: 'admin@company.com', role: 'ADMIN' },
  },
  {
    email: 'dispatch@company.com',
    password: 'dispatch123',
    user: { id: 'u-dispatch', tenantId: 't-demo', name: 'Dispatch Lead', email: 'dispatch@company.com', role: 'DISPATCH' },
  },
  {
    email: 'driver@company.com',
    password: 'driver123',
    user: { id: 'u-driver', tenantId: 't-demo', name: 'Driver One', email: 'driver@company.com', role: 'DRIVER' },
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadSession()?.user ?? null);
  currentUser$ = this.currentUserSubject.asObservable();

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

  login(email: string, password: string): { ok: true } | { ok: false; message: string } {
    const hit = MOCK_USERS.find((m) => m.email.toLowerCase() === email.trim().toLowerCase() && m.password === password);
    if (!hit) return { ok: false, message: 'Invalid credentials.' };

    const payload: SessionPayload = {
      token: `mock-token-${hit.user.id}-${Date.now()}`,
      user: hit.user,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    this.currentUserSubject.next(hit.user);

    // TODO: Replace with real POST /api/auth/login + JWT storage + refresh token rotation.
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
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
