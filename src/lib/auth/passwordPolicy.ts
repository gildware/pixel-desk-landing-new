export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.';

export type PasswordRequirementKey =
  | 'minLength'
  | 'uppercase'
  | 'lowercase'
  | 'digit'
  | 'special';

export const PASSWORD_REQUIREMENT_LABELS: Record<PasswordRequirementKey, string> =
  {
    minLength: 'At least 8 characters',
    uppercase: 'One uppercase letter',
    lowercase: 'One lowercase letter',
    digit: 'One number',
    special: 'One special character',
  };

export function getPasswordRequirementStatus(password: string): Record<
  PasswordRequirementKey,
  boolean
> {
  return {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function isPasswordPolicySatisfied(password: string): boolean {
  const status = getPasswordRequirementStatus(password);
  return Object.values(status).every(Boolean);
}
