import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon, Text, type IconName } from '@medmate/base-components';
import { brand, gold, semantic, spacing } from '@medmate/theme';

import identity from '../../../../../identity.json';
import { useAppDispatch, useAppSelector } from '../../../../hooks/use-store';
import { readCurrentPin, type CurrentPin } from '../../../../services/location';
import { splitMark } from '../../../../shared/components/Wordmark/Wordmark';
import {
  selectAddressError,
  selectAddresses,
} from '../../../../store/selectors/address.selectors';
import { formatSignedInPhone } from '../../../../utils/phone';
import { chooseAddress } from '../../store/address.slice';
import type { Address, AddressLabel } from '../../types/address';
import {
  addAddressLabel,
  addressHeadingAccent,
  addressHeadingLead,
  addressLabel,
  addressPartners,
  deliverPrompt,
  deliveringHere,
  deliverTo,
  detectLabel,
  savedAddressesLabel,
  serviceNote,
  useLocationBody,
  useLocationTitle,
} from '../../utils/copy';
import { addressListStyles as styles } from './AddressListScreen.styles';

export type AddressListScreenProps = {
  onCreate: (pin: CurrentPin | null) => void;
  onEdit: (address: Address) => void;
};

export function AddressListScreen({ onCreate, onEdit }: AddressListScreenProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectAddresses);
  const error = useAppSelector(selectAddressError);
  const { lead, accent } = splitMark(identity.displayName);
  const [chosenId, setChosenId] = useState(items[0]?.id ?? '');
  const chosen = items.find((item) => item.id === chosenId) ?? items[0];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text variant="wordmark">
          <Text variant="wordmark" color={semantic.textOnBrand}>
            {lead}
          </Text>
          <Text variant="wordmark" color={brand.gold}>
            {accent}
          </Text>
        </Text>
        <Text variant="title2" style={styles.title}>
          <Text variant="title2" color={semantic.textOnBrand}>
            {addressHeadingLead}{' '}
          </Text>
          <Text variant="title2" color={gold[300]}>
            {addressHeadingAccent}
          </Text>
        </Text>
        <Text variant="footnote" color={semantic.textOnBrand}>
          {addressPartners}
        </Text>
      </View>
      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          <LocationCard onCreate={onCreate} />
          <View style={styles.section}>
            <Text variant="eyebrow" color={semantic.textMuted}>
              {savedAddressesLabel(items.length)}
            </Text>
            {items.map((item) => (
              <AddressCard
                key={item.id}
                address={item}
                chosen={item.id === chosen?.id}
                onChoose={() => setChosenId(item.id)}
                onEdit={() => onEdit(item)}
              />
            ))}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={addAddressLabel}
              onPress={() => onCreate(null)}
              style={styles.add}
            >
              <Text variant="button" color={brand.green}>
                + {addAddressLabel}
              </Text>
            </Pressable>
          </View>
          <View style={styles.note}>
            <Icon name="info" size={16} color={semantic.textMuted} />
            <Text variant="caption1" color={semantic.textMuted} style={styles.noteCopy}>
              {serviceNote}
            </Text>
          </View>
          {error ? (
            <Text variant="footnote" color={semantic.danger} style={styles.error}>
              {error}
            </Text>
          ) : null}
          <Button
            label={chosen ? deliverTo(addressLabel(chosen.label)) : deliverPrompt}
            tone="filled"
            size="large"
            chevron
            disabled={!chosen}
            onPress={
              chosen
                ? () => {
                    void dispatch(chooseAddress(chosen.id));
                  }
                : undefined
            }
          />
        </ScrollView>
      </View>
    </View>
  );
}

function LocationCard({ onCreate }: { onCreate: (pin: CurrentPin | null) => void }) {
  return (
    <View style={styles.locationCard}>
      <View style={styles.pinTile}>
        <Icon name="pin" size={20} color={brand.green} />
      </View>
      <View style={styles.locationCopy}>
        <Text variant="headline">{useLocationTitle}</Text>
        <Text variant="caption1" color={semantic.textMuted}>
          {useLocationBody}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={detectLabel}
        onPress={() => {
          void readCurrentPin().then(onCreate);
        }}
        style={styles.detect}
      >
        <Text variant="button" color={brand.green}>
          {detectLabel}
        </Text>
        <Icon name="chev-r" size={16} color={brand.green} />
      </Pressable>
    </View>
  );
}

function AddressCard({
  address,
  chosen,
  onChoose,
  onEdit,
}: {
  address: Address;
  chosen: boolean;
  onChoose: () => void;
  onEdit: () => void;
}) {
  const label = addressLabel(address.label);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: chosen }}
      onPress={onChoose}
      style={[styles.card, chosen ? styles.cardOn : null]}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardIcon}>
          <Icon name={labelIcon(address.label)} size={18} color={brand.green} />
        </View>
        <View style={styles.cardCopy}>
          <View style={styles.cardTitle}>
            <Text variant="headline">{label}</Text>
            {address.selected ? (
              <View style={styles.badge}>
                <Text variant="caption2" color={brand.green}>
                  {deliveringHere}
                </Text>
              </View>
            ) : null}
          </View>
          <Text variant="footnote" color={semantic.textSecondary}>
            {address.line1}
          </Text>
          <Text variant="footnote" color={semantic.textSecondary}>
            {address.line2}
          </Text>
          {address.landmark ? (
            <Text variant="caption1" color={semantic.textMuted}>
              {address.landmark}
            </Text>
          ) : null}
          <Text variant="caption1" color={semantic.textMuted}>
            {address.receiverName} · {formatSignedInPhone(address.receiverPhone)}
          </Text>
        </View>
        {chosen ? <Icon name="check" size={18} color={brand.green} /> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${label}`}
          onPress={onEdit}
        >
          <Icon name="edit" size={18} color={semantic.textMuted} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function labelIcon(label: AddressLabel): IconName {
  if (label === 'home') return 'home';
  if (label === 'work') return 'briefcase';
  return 'pin';
}
