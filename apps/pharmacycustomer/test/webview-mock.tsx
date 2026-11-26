import { forwardRef, useImperativeHandle, type ComponentProps, type Ref } from 'react';
import { View } from 'react-native';

export const webViewInject = jest.fn();

type MapHandle = {
  injectJavaScript: (script: string) => void;
};

type WebViewProps = {
  testID?: string;
  style?: ComponentProps<typeof View>['style'];
  onMessage?: (event: unknown) => void;
};

export const WebView = forwardRef(function WebView(props: WebViewProps, ref: Ref<MapHandle>) {
  useImperativeHandle(ref, () => ({ injectJavaScript: webViewInject }));
  const viewProps = {
    testID: props.testID,
    style: props.style,
    onMessage: props.onMessage,
  } as ComponentProps<typeof View>;
  return <View {...viewProps} />;
});
