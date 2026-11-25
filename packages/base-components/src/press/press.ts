export function pressHandler(disabled: boolean, onPress?: () => void): (() => void) | undefined {
  if (disabled) return undefined;
  return onPress;
}
