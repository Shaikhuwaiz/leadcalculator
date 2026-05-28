import { addBusinessDays } from '../frontend/src/data/addBusinessDays.js';

const holidays = [
  '2025-01-01', '2026-05-25', '2025-07-03', '2025-07-04',
  '2025-09-01', '2025-11-26', '2025-11-27', '2025-11-28',
  '2025-12-24', '2025-12-25', '2025-12-26', '2025-12-31',
  '2026-01-01', '2026-01-02'
];

// Simulate May 20 2026 as start (before 2 PM CDT)
const start = new Date('2026-05-20T12:00:00');
const result = addBusinessDays(start, 8, holidays);

// Format result in Chicago timezone
const parts = {};
new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Chicago',
  year: 'numeric', month: '2-digit', day: '2-digit'
}).formatToParts(result).forEach(({ type, value }) => { parts[type] = value; });
const resultStr = `${parts.year}-${parts.month}-${parts.day}`;

console.log('Start: 2026-05-20');
console.log('Business days: 8');
console.log('Holiday skipped: 2026-05-25 (Memorial Day)');
console.log('Result:', resultStr);
console.log('Expected: 2026-06-02');
console.log(resultStr === '2026-06-02' ? '✅ PASS' : '❌ FAIL');
