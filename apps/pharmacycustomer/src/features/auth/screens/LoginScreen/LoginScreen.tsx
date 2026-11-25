import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@medmate/base-components';
import { brand, semantic, spacing } from '@medmate/theme';

import identity from '../../../../../identity.json';
import { PromiseStrip } from '../../../../shared/components/PromiseStrip/PromiseStrip';
import { Wordmark } from '../../../../shared/components/Wordmark/Wordmark';
import { MedicineFan } from '../../components/MedicineFan/MedicineFan';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { useLogin } from '../../hooks/useLogin';
import { loginBody, loginHeading, loginHeadingAccent } from '../../utils/copy';
import { loginScreenStyles as styles } from './LoginScreen.styles';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const login = useLogin();
  const { height: windowHeight } = useWindowDimensions();
  const viewportHeight = useRef(windowHeight);
  const [minHeight, setMinHeight] = useState(windowHeight);

  const onViewportLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    if (next > viewportHeight.current) {
      viewportHeight.current = next;
      setMinHeight(next);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { minHeight }]}
        onLayout={onViewportLayout}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
          <Wordmark name={identity.displayName} size="large" />
          <MedicineFan />
          <PromiseStrip />
        </View>
        <View style={styles.sheet}>
          <LoginForm
            phone={login.phone}
            error={login.error}
            busy={login.busy}
            bottomInset={insets.bottom}
            onChangePhone={login.changePhone}
            onSubmit={login.submit}
          >
            <View style={styles.intro}>
              <View>
                <Text variant="title1" style={styles.headingLine}>
                  {loginHeading}
                </Text>
                <Text variant="title1" color={brand.green} style={styles.headingLine}>
                  {loginHeadingAccent}
                </Text>
              </View>
              <Text variant="subheadline" color={semantic.textMuted}>
                {loginBody}
              </Text>
            </View>
          </LoginForm>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
