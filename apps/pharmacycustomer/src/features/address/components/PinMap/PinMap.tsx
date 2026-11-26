import { useEffect, useRef, type ReactNode } from 'react';
import { View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { Icon } from '@medmate/base-components';
import { brand } from '@medmate/theme';

import { mapLabel } from '../../utils/copy';
import type { AddressPin } from '../../types/address';
import { pinMapHtml, pinMapTestId, readPinMessage, recenterMap } from './pin-map';
import { pinMapStyles as styles } from './PinMap.styles';

export type PinMapProps = {
  center: AddressPin;
  onMove: (pin: AddressPin) => void;
  onGestureStart: () => void;
  onGestureEnd: () => void;
  children?: ReactNode;
};

export function PinMap({ center, onMove, onGestureStart, onGestureEnd, children }: PinMapProps) {
  const mapRef = useRef<WebView>(null);
  const placed = useRef(center);
  const page = useRef(pinMapHtml(center.latitude, center.longitude));

  useEffect(() => {
    if (
      placed.current.latitude === center.latitude &&
      placed.current.longitude === center.longitude
    ) {
      return;
    }
    placed.current = center;
    recenterMap(mapRef.current, center.latitude, center.longitude);
  }, [center]);

  function onMessage(event: WebViewMessageEvent) {
    const pin = readPinMessage(event.nativeEvent.data);
    if (!pin) return;
    placed.current = pin;
    onMove(pin);
  }

  return (
    <View
      style={styles.frame}
      accessibilityLabel={mapLabel}
      onTouchStart={onGestureStart}
      onTouchEnd={onGestureEnd}
      onTouchCancel={onGestureEnd}
    >
      <WebView
        ref={mapRef}
        testID={pinMapTestId}
        style={styles.map}
        source={{ html: page.current }}
        applicationNameForUserAgent="Medmate pharmacycustomer"
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        nestedScrollEnabled
        bounces={false}
        setSupportMultipleWindows={false}
        onMessage={onMessage}
      />
      <View pointerEvents="none" style={styles.pin}>
        <Icon name="pin" size={24} color={brand.green} />
      </View>
      {children}
    </View>
  );
}
