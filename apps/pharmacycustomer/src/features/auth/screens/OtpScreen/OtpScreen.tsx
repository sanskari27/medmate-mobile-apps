import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Gradient, Icon, Text } from '@medmate/base-components';
import { brand, gold, semantic, spacing } from '@medmate/theme';

import { OTP_LENGTH, OTP_RESEND_SECONDS, OTP_TTL_SECONDS } from '../../../../constants/auth';
import { useVerifyOtp } from '../../hooks/useVerifyOtp';
import {
  otpHeadingAccent,
  otpHeadingLead,
  otpSafety,
  otpSubheading,
} from '../../utils/copy';
import { otpScreenStyles as styles } from './OtpScreen.styles';

export type OtpScreenProps = {
  onChangeNumber: () => void;
};

export function OtpScreen({ onChangeNumber }: OtpScreenProps) {
  const insets = useSafeAreaInsets();
  const otp = useVerifyOtp();
  const [attempt, setAttempt] = useState(0);
  const elapsed = useOtpElapsed(attempt);
  const expiresIn = Math.max(0, OTP_TTL_SECONDS - elapsed);
  const resendIn = Math.max(0, OTP_RESEND_SECONDS - elapsed);
  const resendLocked = resendIn > 0 || otp.busy;

  const onResend = () => {
    if (resendLocked) return;
    otp.resend();
    setAttempt((value) => value + 1);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <StatusBar style="light" />
      <Gradient token="brand" radius={0} style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.nav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onChangeNumber}
            style={styles.back}
          >
            <Icon name="arrow-left" size={24} color={semantic.textOnBrand} />
          </Pressable>
        </View>
        <View style={styles.mark}>
          <View style={styles.bubble}>
            <Icon name="chat" size={28} color={gold[100]} />
          </View>
          <View style={styles.badge}>
            <Icon name="shield" size={14} color={semantic.textOnGold} />
          </View>
        </View>
        <Text variant="title2" style={styles.title}>
          <Text variant="title2" color={semantic.textOnBrand}>
            {otpHeadingLead}{' '}
          </Text>
          <Text variant="title2" color={gold[300]}>
            {otpHeadingAccent}
          </Text>
        </Text>
        <Text variant="subheadline" color={semantic.textOnBrand}>
          {otpSubheading(otp.phoneLabel)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Wrong number? Change it"
          onPress={onChangeNumber}
          style={styles.change}
        >
          <Icon name="edit" size={14} color={gold[300]} />
          <Text variant="footnoteEmphasized" color={gold[300]}>
            Wrong number? Change it
          </Text>
        </Pressable>
      </Gradient>
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.codeWrap}>
          <View
            style={styles.boxes}
            pointerEvents="none"
            importantForAccessibility="no-hide-descendants"
          >
            {Array.from({ length: OTP_LENGTH }, (_, index) => {
              const digit = otp.code[index] ?? '';
              const active = index === otp.code.length;
              return (
                <View
                  key={index}
                  style={[
                    styles.box,
                    digit ? styles.boxFilled : null,
                    active ? styles.boxActive : null,
                  ]}
                >
                  {digit ? (
                    <Text variant="title2" color={gold[300]}>
                      {digit}
                    </Text>
                  ) : null}
                  {active ? <View style={styles.caret} /> : null}
                </View>
              );
            })}
          </View>
          <TextInput
            value={otp.code}
            onChangeText={otp.setCode}
            keyboardType="number-pad"
            inputMode="numeric"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            importantForAutofill="yes"
            autoCorrect={false}
            spellCheck={false}
            caretHidden
            style={styles.hiddenInput}
            accessibilityLabel="Verification code"
            autoFocus
          />
        </View>
        <Text variant="footnote" color={semantic.textMuted} style={styles.meta}>
          {expiresIn > 0 ? (
            <>
              Code expires in{' '}
              <Text variant="footnoteEmphasized" color={brand.green}>
                {formatClock(expiresIn)}
              </Text>
              {' · '}
            </>
          ) : (
            'Code expired · '
          )}
          {"Didn't get it? "}
          <Text
            variant="footnoteEmphasized"
            color={resendIn > 0 ? semantic.textMuted : brand.green}
            accessibilityRole="button"
            accessibilityLabel="Resend code"
            accessibilityState={{ disabled: resendLocked }}
            onPress={onResend}
          >
            {resendIn > 0 ? `Resend in ${formatClock(resendIn)}` : 'Resend'}
          </Text>
        </Text>
        {otp.error ? (
          <Text variant="footnote" color={semantic.danger}>
            {otp.error}
          </Text>
        ) : null}
        <Button
          label="Verify and continue"
          tone={otp.ready && !otp.busy ? 'filled' : 'muted'}
          size="large"
          disabled={!otp.ready || otp.busy}
          onPress={otp.submit}
          style={styles.submit}
        />
        <View style={styles.safety}>
          <Icon name="shield" size={18} color={brand.green} style={styles.safetyIcon} />
          <Text variant="footnote" color={semantic.textSecondary} style={styles.safetyCopy}>
            {otpSafety}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function useOtpElapsed(attempt: number): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const started = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - started) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [attempt]);

  return elapsed;
}

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
