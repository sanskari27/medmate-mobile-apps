import { Button, Icon, Text } from '@medmate/base-components';
import { brand, semantic, spacing } from '@medmate/theme';
import type { ReactNode } from 'react';
import { TextInput, View } from 'react-native';

import { formatNational } from '../../../../utils/phone';
import { phoneFieldError } from '../../schemas/phone.schema';
import { codeNotice } from '../../utils/copy';
import { loginFormStyles as styles } from './LoginForm.styles';

export type LoginFormProps = {
  phone: string;
  error: string | null;
  busy: boolean;
  bottomInset?: number;
  children?: ReactNode;
  onChangePhone: (value: string) => void;
  onSubmit: () => void;
};

export function LoginForm({
  phone,
  error,
  busy,
  bottomInset = 0,
  children,
  onChangePhone,
  onSubmit,
}: LoginFormProps) {
  const valid = phoneFieldError(phone) === null && phone.length === 10;
  const message = error ?? phoneFieldError(phone);
  const canSubmit = valid && !busy;

  return (
    <View style={styles.form}>
      <View style={styles.body}>
        {children}
        <View style={styles.field}>
          <Text variant="subheadlineEmphasized">Mobile number</Text>
          <View style={[styles.fieldBox, valid ? styles.fieldBoxValid : null]}>
            <Text variant="subheadline">+91</Text>
            <View style={styles.rule} />
            <TextInput
              value={formatNational(phone)}
              onChangeText={onChangePhone}
              keyboardType="phone-pad"
              placeholder="98450 12345"
              placeholderTextColor={semantic.textFaint}
              style={styles.input}
              accessibilityLabel="Mobile number"
            />
            {valid ? <Icon name="check" size={20} color={brand.green} /> : null}
          </View>
          {message ? (
            <Text variant="caption1" color={semantic.danger}>
              {message}
            </Text>
          ) : null}
        </View>

        {valid ? (
          <Text variant="caption1" color={brand.green}>
            {codeNotice(`+91 ${formatNational(phone)}`)}
          </Text>
        ) : null}
      </View>
      <View style={[styles.footer, { paddingBottom: bottomInset + spacing.lg }]}>
        <Button
          label="Get code"
          tone="filled"
          size="large"
          chevron
          disabled={!canSubmit}
          onPress={onSubmit}
          style={styles.submit}
        />
      </View>
    </View>
  );
}
