const toBool = (value: string | boolean | undefined | null): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value !== 'string') {
    return false;
  }
  const normalized = value.toLowerCase();
  return normalized === 'true' || normalized === '1';
};

export const isStubEnvironment =
  Boolean(import.meta.env.DEV) ||
  toBool(import.meta.env.VITE_STORYBOOK) ||
  toBool(import.meta.env.VITE_USE_STUB_DATA);
