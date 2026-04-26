// SECURITY: Safe logger that suppresses all output in production builds.
// Prevents tokens, passwords, and PII from appearing in device logs or crash reports.

const SENSITIVE_KEYS = [
  'access', 'refresh', 'password', 'token', 'authorization',
  'email', 'cuil', 'dni', 'phone', 'celular',
];

function sanitize(value: unknown): unknown {
  if (typeof value === 'string') return value;
  if (typeof value !== 'object' || value === null) return value;
  if (Array.isArray(value)) return value.map(sanitize);

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const lower = k.toLowerCase();
    if (SENSITIVE_KEYS.some(s => lower.includes(s))) {
      out[k] = '[REDACTED]';
    } else {
      out[k] = sanitize(v);
    }
  }
  return out;
}

// SECURITY: __DEV__ is false in production bundles — all methods become no-ops.
export const logger = {
  log: (...args: unknown[]): void => {
    if (__DEV__) console.log(...args.map(sanitize));
  },
  warn: (...args: unknown[]): void => {
    if (__DEV__) console.warn(...args.map(sanitize));
  },
  error: (...args: unknown[]): void => {
    if (__DEV__) console.error(...args.map(sanitize));
  },
};
