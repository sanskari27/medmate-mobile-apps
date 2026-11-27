import { Pressable, ScrollView, View } from 'react-native';
import { SectionHeader, Text } from '@medmate/base-components';
import { semantic } from '@medmate/theme';

import { pharmacyTitle, type NearbyPharmacy } from '../../types/home';
import {
  distanceLabel,
  onlineOrdersLabel,
  pharmaciesEmpty,
  pharmaciesTitle,
  pharmacyFallback,
} from '../../utils/copy';
import { pharmacyRailStyles as styles } from './PharmacyRail.styles';

export type PharmacyRailProps = {
  pharmacies: NearbyPharmacy[];
};

export function PharmacyRail({ pharmacies }: PharmacyRailProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SectionHeader title={pharmaciesTitle} />
      </View>
      {pharmacies.length === 0 ? (
        <Text variant="body" color={semantic.textMuted} style={styles.empty}>
          {pharmaciesEmpty}
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {pharmacies.map((pharmacy) => {
            const title = pharmacyTitle(pharmacy.name, pharmacyFallback);
            const place = placeLine(pharmacy);
            return (
              <Pressable
                key={pharmacy.pharmacyId}
                accessibilityRole="button"
                accessibilityLabel={title}
                style={styles.card}
              >
                <Text variant="cardTitle" numberOfLines={2}>
                  {title}
                </Text>
                {place ? (
                  <Text variant="caption" color={semantic.textMuted} numberOfLines={2}>
                    {place}
                  </Text>
                ) : null}
                <Text variant="caption">{distanceLabel(pharmacy.distanceKm)}</Text>
                <Text variant="caption" color={semantic.textSecondary}>
                  {onlineOrdersLabel(pharmacy.acceptOnlineOrders)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

function placeLine(pharmacy: NearbyPharmacy): string {
  const parts: string[] = [];
  if (pharmacy.address) parts.push(pharmacy.address);
  if (pharmacy.city) parts.push(pharmacy.city);
  return parts.join(', ');
}
