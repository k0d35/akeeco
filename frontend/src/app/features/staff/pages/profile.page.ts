import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared-data/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p">
      <h3>Profile</h3>
      <div><b>Name:</b> {{ u.name }}</div>
      <div><b>Email:</b> {{ u.email }}</div>
      <div><b>Role:</b> {{ u.role }}</div>
      <div><b>Tenant:</b> {{ u.tenantId }}</div>
    </div>
  `,
  styles: [`.p{ padding:12px; display:grid; gap:6px; }`]
})
export class StaffProfilePageComponent {
  u = inject(AuthService).user();
}

