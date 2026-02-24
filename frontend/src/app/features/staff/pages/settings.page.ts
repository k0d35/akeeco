import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared-data/auth/auth.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card p" *ngIf="isAdmin; else denied">
      <h3>Settings</h3>
      <label>Company Name <input class="in" [(ngModel)]="companyName" /></label>
      <label>Support Phone <input class="in" [(ngModel)]="phone" /></label>
      <label>Support Email <input class="in" [(ngModel)]="email" /></label>
      <label>Template: Driver Assigned <textarea class="in" [(ngModel)]="template"></textarea></label>
      <button class="btn" (click)="save()">Save</button>
    </div>
    <ng-template #denied><div class="card p">Admin access required.</div></ng-template>
  `,
  styles: [`.p{ padding:12px; display:grid; gap:8px; }`]
})
export class StaffSettingsPageComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  isAdmin = this.auth.user().role === 'ADMIN';
  companyName = 'Sun Island Premium Chauffeur';
  phone = '(876) 555-0132';
  email = 'ops@company.com';
  template = 'Your driver is assigned and arriving shortly.';
  save() { this.toast.show('Settings saved (mock).', 'success'); }
}

