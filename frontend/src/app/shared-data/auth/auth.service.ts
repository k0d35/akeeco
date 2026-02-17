import { Injectable } from '@angular/core';

export interface User {
  id: string;
  tenantId: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Demo identity
  private u: User = { id: 'u-demo-1', tenantId: 't-demo', name: 'Dispatcher Demo' };
  user(){ return this.u; }
}
