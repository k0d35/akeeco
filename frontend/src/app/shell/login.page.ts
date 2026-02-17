import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrap">
      <div class="card box">
        <h1>Sun Island Tours</h1>
        <p class="muted">Staff Login (demo)</p>
        <button class="btn" (click)="go()">Enter Dispatch Console</button>
      </div>
    </div>
  `,
  styles: [`
    .wrap{ min-height:100vh; display:flex; align-items:center; justify-content:center; padding:16px; }
    .box{ padding:18px; width: min(520px, 100%); }
    .muted{ color: var(--muted); }
  `]
})
export class LoginPageComponent{
  constructor(private router: Router){}
  go(){ this.router.navigateByUrl('/app/trips'); }
}
