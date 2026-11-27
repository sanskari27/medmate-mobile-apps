import { Pressable, ScrollView, View } from 'react-native';
import { Icon, Text } from '@medmate/base-components';
import { brand, semantic } from '@medmate/theme';

import { pharmacyInitials, pharmacyTitle, type NearbyPharmacy } from '../../types/home';
import {
  deliveryTimeLabel,
  distanceLabel,
  fastestLabel,
  pharmaciesAccent,
  pharmaciesEmpty,
  pharmaciesLead,
  pharmacyFallback,
  seeAllPharmacies,
} from '../../utils/copy';
import { pharmacyRailStyles as styles } from './PharmacyRail.styles';

export type PharmacyRailProps = {
  pharmacies: NearbyPharmacy[];
};

export function PharmacyRail({ pharmacies }: PharmacyRailProps) {
  const online = pharmacies
    .filter((pharmacy) => pharmacy.acceptOnlineOrders)
    .slice()
    .sort((left, right) => left.distanceKm - right.distanceKm);
  const fastestId = online.length > 1 ? online[0].pharmacyId : undefined;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text variant="sectionTitle" style={styles.title}>
          {pharmaciesLead}{' '}
          <Text variant="sectionTitle" color={semantic.action}>
            {pharmaciesAccent}
          </Text>
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={seeAllPharmacies}
          style={styles.seeAll}
        >
          <Text variant="captionStrong" color={semantic.action}>
            {seeAllPharmacies}
          </Text>
          <Icon name="chev-r" size={14} color={semantic.action} />
        </Pressable>
      </View>
      {online.length === 0 ? (
        <Text variant="body" color={semantic.textMuted} style={styles.empty}>
          {pharmaciesEmpty}
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {online.map((pharmacy) => {
            const title = pharmacyTitle(pharmacy.name?.trim() || null, pharmacyFallback);
            return (
              <Pressable
                key={pharmacy.pharmacyId}
                accessibilityRole="button"
                accessibilityLabel={title}
                style={styles.card}
              >
                <View style={styles.identity}>
                  <View style={styles.avatar}>
                    <Text variant="captionStrong" color={brand.forest}>
                      {pharmacyInitials(title)}
                    </Text>
                  </View>
                  <View style={styles.identityText}>
                    <View style={styles.nameRow}>
                      <Text variant="cardName" numberOfLines={1} style={styles.name}>
                        {title}
                      </Text>
                      <Icon name="shield" size={14} color={semantic.action} />
                    </View>
                    <Text variant="resultSub" color={semantic.textMuted} numberOfLines={1}>
                      {placeDistance(pharmacy)}
                    </Text>
                  </View>
                </View>
                <View style={styles.meta}>
                  <View style={styles.chip}>
                    <Text variant="captionStrong" color={brand.green700}>
                      {deliveryTimeLabel(pharmacy.distanceKm)}
                    </Text>
                  </View>
                  {pharmacy.pharmacyId === fastestId ? (
                    <Text variant="resultSub" color={semantic.textMuted}>
                      {`· ${fastestLabel}`}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

function placeDistance(pharmacy: NearbyPharmacy): string {
  const place = pharmacy.address || pharmacy.city || '';
  const distance = distanceLabel(pharmacy.distanceKm);
  if (place.length === 0) return distance;
  return `${place} · ${distance}`;
}
