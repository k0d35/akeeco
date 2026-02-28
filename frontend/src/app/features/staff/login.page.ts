import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared-data/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="wrap">
      <form class="card box" [formGroup]="form" (ngSubmit)="submit()">
        <h1>Staff Portal Login</h1>
        <p class="sub">ADMIN / DISPATCH / DRIVER</p>
        <label>Email</label>
        <input class="in" formControlName="email" type="email" />
        <label>Password</label>
        <input class="in" formControlName="password" type="password" />
        <small class="err" *ngIf="error">{{ error }}</small>
        <button class="btn" type="submit" [disabled]="loading">{{ loading ? 'Signing in...' : 'Sign in' }}</button>
        <p class="hint">Demo users: admin@company.com / dispatch@company.com / driver@company.com</p>
      </form>
    </div>
  `,
  styles: [`
    .wrap{
      min-height:100vh;
      display:grid;
      place-items:center;
      padding:14px;
      background-image: linear-gradient(140deg, rgba(17,17,17,.58), rgba(31,31,31,.42)), var(--bg-staff-login);
      background-size: cover;
      background-position: center;
    }
    .box{ width:min(460px, 100%); padding:16px; display:grid; gap:8px; }
    h1{ margin:0; }
    .sub{ margin:0 0 8px; color:var(--muted); }
    label{ font-weight:800; }
    .in{ border:1px solid var(--border); border-radius:10px; padding:10px; }
    .err{ color:var(--danger); }
    .hint{ margin:4px 0 0; color:var(--muted); font-size:12px; }
  `]
})
export class StaffLoginPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  error = '';
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    if (this.form.invalid) return;
    this.error = '';
    this.loading = true;
    this.auth.login(this.form.value.email!, this.form.value.password!).subscribe((res) => {
      this.loading = false;
      if (!res.ok) { this.error = res.message; return; }
      this.router.navigateByUrl('/staff/dashboard');
    });
  }
}
