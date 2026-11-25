import {
  iosType,
  m3Type,
  typeRoles,
  type IosTypeToken,
  type M3TypeToken,
  type PlatformKey,
  type TypeRole,
  type TypeStyle,
} from '@medmate/theme';

export type TextVariant = IosTypeToken | M3TypeToken | TypeRole;

/**
 * Resolve a variant to the metrics for one platform.
 * A token that exists on only one scale falls back to that scale on the other.
 */
export function resolveType(variant: TextVariant, platform: PlatformKey): TypeStyle {
  const isIos = platform === 'ios';

  if (variant in typeRoles) {
    const role = typeRoles[variant as TypeRole];
    return isIos ? iosType[role.ios] : m3Type[role.m3];
  }

  if (isIos && variant in iosType) {
    return iosType[variant as IosTypeToken];
  }

  if (!isIos && variant in m3Type) {
    return m3Type[variant as M3TypeToken];
  }

  if (variant in iosType) {
    return iosType[variant as IosTypeToken];
  }

  if (variant in m3Type) {
    return m3Type[variant as M3TypeToken];
  }

  return iosType.body;
}
