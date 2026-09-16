export default {
  components: {
    button: {
      name: 'Button',
      from: '@acme/ui',
      props: {
        variant: { allowed: ['primary', 'secondary', 'danger'] },
        size: { allowed: ['sm', 'md', 'lg'] },
        tone: { forbidden: true, replacement: 'variant' }
      }
    },
    input: { name: 'Input', from: '@acme/ui' }
  },
  tokenSources: [
    './packages/ui/src/styles/tokens.css',
    './packages/ui/src/tokens/semantic.json'
  ],
  rules: {
    'component-prop-policy': 'error',
    'no-hardcoded-colors': 'error',
    'no-unknown-tokens': 'error',
    'prefer-design-system-components': 'error'
  }
};
