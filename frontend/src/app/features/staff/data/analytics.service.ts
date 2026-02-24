import { Injectable } from '@angular/core';
import { BookingsService } from './bookings.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private bookings: BookingsService) {}

  computeKpis() {
    const rows = this.bookings.list();
    const today = new Date();
    const isToday = (iso?: string) => {
      if (!iso) return false;
      const d = new Date(iso);
      return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    };

    return {
      newRequests: rows.filter(b => b.status === 'REQUESTED' && isToday(b.createdAt)).length,
      upcoming24h: rows.filter(b => {
        const t = new Date(b.pickupTime).getTime();
        return t >= Date.now() && t <= Date.now() + 24 * 60 * 60 * 1000;
      }).length,
      unassigned: rows.filter(b => !b.assignedDriverId || !b.assignedVehicleId).length,
      activeTrips: rows.filter(b => ['ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)).length,
      completedToday: rows.filter(b => b.status === 'COMPLETED' && isToday(b.updatedAt)).length,
      cancelledToday: rows.filter(b => b.status === 'CANCELLED' && isToday(b.updatedAt)).length,
    };
    // TODO: Replace with GET /api/analytics/kpis
  }

  revenueSeries() {
    const rows = this.bookings.list();
    const value = rows.reduce((acc, r) => acc + (r.finalPrice ?? r.estimatedPrice ?? 0), 0);
    return [{ label: 'Today', value }, { label: 'Week', value: value * 2.5 }, { label: 'Month', value: value * 8 }];
    // TODO: Replace with GET /api/analytics/revenue-series
  }

  serviceTypeBreakdown() {
    const rows = this.bookings.list();
    const out: Record<string, number> = {};
    for (const b of rows) out[b.serviceType] = (out[b.serviceType] ?? 0) + 1;
    return Object.entries(out).map(([label, value]) => ({ label, value }));
    // TODO: Replace with GET /api/analytics/service-type-breakdown
  }
}

