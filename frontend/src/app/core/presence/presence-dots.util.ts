import { TenantPresenceEvent } from './tenant-presence-hub.service';

const INACTIVE_AFTER_MS = 60_000;

function initials(name: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? '?';
  const b = parts[1]?.[0] ?? '';
  return (a + b).toUpperCase();
}
function isActive(at?: string) {
  if (!at) return false;
  const t = Date.parse(at);
  if (Number.isNaN(t)) return false;
  return (Date.now() - t) <= INACTIVE_AFTER_MS;
}

const STEP_LABEL: Record<string, string> = {
  customer: 'Customer',
  pickup: 'Pickup',
  dropoff: 'Drop-off',
  schedule: 'Schedule',
  pricing: 'Pricing',
  assignment: 'Assignment',
  billing: 'Billing',
  review: 'Review',
  details: 'Details',
  dispatch: 'Dispatch',
};
function stepLabel(stepKey?: string | null) {
  if (!stepKey) return '—';
  return STEP_LABEL[stepKey] ?? stepKey;
}

export function presenceForEntity(viewers: TenantPresenceEvent[], maxDots = 4, maxLines = 2) {
  const sorted = [...(viewers || [])].sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));

  const dotsAll = sorted.map(v => {
    const name = v.userName || v.userId || 'User';
    return { name, initials: initials(name), active: isActive(v.at) };
  });

  const byUser = new Map<string, TenantPresenceEvent>();
  for (const v of sorted) {
    if (!v.userId) continue;
    if (!byUser.has(v.userId)) byUser.set(v.userId, v);
  }

  const linesAll = Array.from(byUser.values()).map(v => {
    const name = v.userName || v.userId || 'User';
    return { text: `${name}: ${stepLabel(v.stepKey)}`, active: isActive(v.at) };
  });

  const tooltip = linesAll.map(l => `${l.text} (${l.active ? 'active' : 'inactive'})`).join('\n');

  return {
    dots: dotsAll.slice(0, maxDots),
    moreDots: Math.max(0, dotsAll.length - maxDots),
    lines: linesAll.slice(0, maxLines),
    moreLines: Math.max(0, linesAll.length - maxLines),
    tooltip,
  };
}
