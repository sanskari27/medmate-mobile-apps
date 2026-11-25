import type { IconName } from '@medmate/base-components';

/** Line under the login wordmark. */
export const tagline = 'Care · delivered in minutes';

/** Trust points on the login header. */
export const promises: { icon: IconName; title: string; body: string }[] = [
  { icon: 'bolt', title: 'Delivery', body: 'in minutes' },
  { icon: 'shield', title: 'Licensed', body: 'pharmacies' },
  { icon: 'steth', title: 'Talk to a', body: 'doctor' },
];
