import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripWizardStateService } from '../trip-wizard-state.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Review</h2>
    <p class="muted">Confirm details before submitting.</p>
    <pre class="pre">{{ state.raw() | json }}</pre>
  `,
  styles: [`
    .muted{ color: var(--muted); }
    .pre{ margin-top: 10px; padding: 12px; border-radius: 12px; border:1px solid var(--border); background:#fff; overflow:auto; }
  `]
})
export class ReviewStepComponent {
  state = inject(TripWizardStateService);
}
