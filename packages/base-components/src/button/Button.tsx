import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { brand, cn, hairline, mint, semantic } from '@medmate/theme';

import { Icon, type IconName } from '../icon/Icon';
import { pressHandler } from '../press/press';
import { Text } from '../text/Text';

export type ButtonTone = 'filled' | 'forest' | 'gold' | 'outline' | 'muted' | 'mint';
export type ButtonSize = 'small' | 'large';

const toneClass: Record<ButtonTone, string> = {
  filled: 'bg-brand-green',
  forest: 'bg-brand-forest',
  gold: 'bg-gold-300',
  outline: 'border border-brand-green bg-transparent',
  muted: 'bg-neutral-surface3',
  mint: 'bg-mint-100',
};

const toneFill: Record<ButtonTone, ViewStyle> = {
  filled: { backgroundColor: semantic.action },
  forest: { backgroundColor: semantic.anchor },
  gold: { backgroundColor: semantic.savingsFill },
  outline: {
    backgroundColor: 'transparent',
    borderColor: semantic.action,
    borderWidth: hairline,
  },
  muted: { backgroundColor: semantic.surfaceSunken },
  mint: { backgroundColor: mint[100] },
};

const disabledFill: ViewStyle = { backgroundColor: semantic.surfaceSunken };

export function buttonInk(tone: ButtonTone): string {
  if (tone === 'gold' || tone === 'outline' || tone === 'mint') return brand.green;
  if (tone === 'muted') return semantic.textMuted;
  return semantic.textOnBrand;
}

export type ButtonProps = {
  label: string;
  tone?: ButtonTone;
  size?: ButtonSize;
  icon?: IconName | null;
  chevron?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  tone = 'gold',
  size = 'small',
  icon = null,
  chevron = false,
  onPress,
  disabled = false,
  style,
}: ButtonProps) {
  const ink = disabled ? semantic.textMuted : buttonInk(tone);
  const iconSize = size === 'large' ? 20 : 16;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={pressHandler(disabled, onPress)}
      className={cn(
        'gap-xs rounded-pill px-lg flex-row items-center justify-center',
        size === 'large' ? 'h-[50px]' : 'h-[34px]',
        toneClass[tone],
      )}
      style={[disabled ? disabledFill : toneFill[tone], style]}
    >
      {icon ? <Icon name={icon} size={iconSize} color={ink} /> : null}
      <Text variant={size === 'large' ? 'button' : 'buttonSmall'} color={ink}>
        {label}
      </Text>
      {chevron ? <Icon name="chev-r" size={iconSize} color={ink} /> : null}
    </Pressable>
  );
}
