import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared-data/auth/auth.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.token();
    if (!token) {
      return next.handle(req);
    }
    if (req.url.includes('/api/auth/login')) {
      return next.handle(req);
    }
    return next.handle(req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    }));
  }
}

