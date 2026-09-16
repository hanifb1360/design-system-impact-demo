import { Button as ActionButton } from '@acme/ui';

export function DeleteButton() {
  return (
    <ActionButton
      tone="critical"
      size="md"
      style={{ color: 'var(--color-critical)' }}
    >
      Delete account
    </ActionButton>
  );
}
