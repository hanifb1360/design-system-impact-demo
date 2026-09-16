import { Button as ActionButton } from '@acme/ui';

export function DeleteButton() {
  return (
    <ActionButton
      variant="danger"
      size="md"
      style={{ color: 'var(--color-danger)' }}
    >
      Delete account
    </ActionButton>
  );
}
