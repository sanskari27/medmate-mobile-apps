import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Checkbox, FilterChip, Icon, Text, TextField } from '@medmate/base-components';
import { brand, gold, neutral, semantic, spacing } from '@medmate/theme';

import { useAppDispatch, useAppSelector } from '../../../../hooks/use-store';
import { readCurrentPin, type CurrentPin } from '../../../../services/location';
import { selectAccountPhone } from '../../../../store/selectors/auth.selectors';
import { selectAddressError } from '../../../../store/selectors/address.selectors';
import { nationalDigits, storedNationalDigits } from '../../../../utils/phone';
import { saveAddress } from '../../store/address.slice';
import type { Address, AddressLabel } from '../../types/address';
import { deliversHere, emptyDraft, toAddressInput, validateAddress } from '../../utils/address-form';
import {
  addAddressTitle,
  addressBack,
  addressDetails,
  addressFormHint,
  addressHeadingAccent,
  addressHeadingLead,
  callOnArrivalLabel,
  cityLabel,
  deliverNowHint,
  deliverNowLabel,
  detectLabel,
  dontRingBellLabel,
  editAddressTitle,
  instructionsHeading,
  instructionsOptional,
  labelHome,
  labelOther,
  labelWork,
  landmarkLabel,
  leaveWithSecurityLabel,
  liftNotWorkingLabel,
  line1Label,
  line2Label,
  locationFormBody,
  NOTE_MAX,
  noteLabel,
  notePlaceholder,
  pincodeLabel,
  pinDenied,
  pinSaved,
  receiverHeading,
  receiverNameLabel,
  receiverPhoneHint,
  receiverPhoneLabel,
  saveAndDeliver,
  saveAs,
  useLocationTitle,
  useMyNumber,
  weDeliverHere,
} from '../../utils/copy';
import { addressFormStyles as styles } from './AddressFormScreen.styles';

const labels: { value: AddressLabel; label: string }[] = [
  { value: 'home', label: labelHome },
  { value: 'work', label: labelWork },
  { value: 'other', label: labelOther },
];

export type AddressFormScreenProps = {
  address: Address | null;
  pin: CurrentPin | null;
  onBack: () => void;
};

export function AddressFormScreen({ address, pin, onBack }: AddressFormScreenProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const accountPhone = useAppSelector(selectAccountPhone);
  const saveError = useAppSelector(selectAddressError);
  const [draft, setDraft] = useState(() => emptyDraft(address, pin));
  const [errors, setErrors] = useState(validateAddress(draft));
  const [showErrors, setShowErrors] = useState(false);
  const [pinNote, setPinNote] = useState(draft.pin ? pinSaved : '');
  const [saving, setSaving] = useState(false);

  function patch(partial: Partial<typeof draft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function detect() {
    const next = await readCurrentPin();
    if (!next) {
      patch({ pin: null });
      setPinNote(pinDenied);
      return;
    }
    patch({ pin: next });
    setPinNote(pinSaved);
  }

  async function submit() {
    const next = validateAddress(draft);
    setErrors(next);
    setShowErrors(true);
    if (Object.keys(next).length > 0) return;
    const body = toAddressInput(draft);
    setSaving(true);
    const result = await dispatch(
      saveAddress(address ? { id: address.id, body } : { body }),
    );
    setSaving(false);
    if (saveAddress.fulfilled.match(result) && !draft.deliverNow) onBack();
  }

  const fieldError = (key: keyof typeof errors) => (showErrors ? errors[key] : undefined);
  const serviceable = deliversHere(draft.pincode);

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.nav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={addressBack}
            onPress={onBack}
          >
            <Icon name="arrow-left" size={24} color={semantic.textOnBrand} />
          </Pressable>
          <Text variant="headline" color={semantic.textOnBrand}>
            {address ? editAddressTitle : addAddressTitle}
          </Text>
        </View>
        <Text variant="title2" style={styles.title}>
          <Text variant="title2" color={semantic.textOnBrand}>
            {addressHeadingLead}{' '}
          </Text>
          <Text variant="title2" color={gold[300]}>
            {addressHeadingAccent}
          </Text>
        </Text>
        <Text variant="footnote" color={semantic.textOnBrand}>
          {addressFormHint}
        </Text>
      </View>
      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.locationCard}>
            <View style={styles.pinTile}>
              <Icon name="pin" size={20} color={brand.green} />
            </View>
            <View style={styles.locationCopy}>
              <Text variant="headline">{useLocationTitle}</Text>
              <Text variant="caption1" color={semantic.textMuted}>
                {draft.pin ? pinSaved : locationFormBody}
              </Text>
              {pinNote === pinDenied ? (
                <Text variant="caption1" color={semantic.danger}>
                  {pinDenied}
                </Text>
              ) : null}
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={detectLabel} onPress={() => void detect()}>
              <Text variant="button" color={brand.green}>
                {detectLabel}
              </Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text variant="headline">{addressDetails}</Text>
            <Text variant="caption1" color={semantic.textMuted}>
              {saveAs}
            </Text>
            <View style={styles.chips}>
              {labels.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={draft.label === option.value}
                  onPress={() => patch({ label: option.value })}
                />
              ))}
            </View>
            <TextField
              label={line1Label}
              value={draft.line1}
              error={fieldError('line1')}
              onChangeText={(line1) => patch({ line1 })}
            />
            <TextField
              label={line2Label}
              value={draft.line2}
              error={fieldError('line2')}
              onChangeText={(line2) => patch({ line2 })}
            />
            <TextField
              label={landmarkLabel}
              value={draft.landmark}
              onChangeText={(landmark) => patch({ landmark })}
            />
            <View style={styles.row}>
              <View style={styles.city}>
                <TextField
                  label={cityLabel}
                  value={draft.city}
                  error={fieldError('city')}
                  onChangeText={(city) => patch({ city })}
                />
              </View>
              <View style={styles.pincode}>
                <TextField
                  label={pincodeLabel}
                  value={draft.pincode}
                  error={fieldError('pincode')}
                  onChangeText={(pincode) => patch({ pincode })}
                />
              </View>
            </View>
            {serviceable ? (
              <Text variant="caption1" color={brand.green} style={styles.hint}>
                {weDeliverHere}
              </Text>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text variant="headline">{receiverHeading}</Text>
            <TextField
              label={receiverNameLabel}
              value={draft.receiverName}
              error={fieldError('receiverName')}
              onChangeText={(receiverName) => patch({ receiverName })}
            />
            <View style={styles.phoneRow}>
              <Text variant="body" color={semantic.textSecondary} style={styles.prefix}>
                +91
              </Text>
              <View style={styles.phone}>
                <TextField
                  label={receiverPhoneLabel}
                  value={draft.receiverPhone}
                  error={fieldError('receiverPhone')}
                  onChangeText={(value) => patch({ receiverPhone: nationalDigits(value) })}
                />
              </View>
            </View>
            <Text variant="caption1" color={semantic.textMuted}>
              {receiverPhoneHint}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={useMyNumber}
              onPress={() => patch({ receiverPhone: storedNationalDigits(accountPhone) })}
            >
              <Text variant="footnoteEmphasized" color={brand.green}>
                {useMyNumber}
              </Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text variant="headline">{instructionsHeading}</Text>
            <Text variant="caption1" color={semantic.textMuted}>
              {instructionsOptional}
            </Text>
            <View style={styles.chips}>
              <FilterChip
                label={callOnArrivalLabel}
                selected={draft.callOnArrival}
                onPress={() => patch({ callOnArrival: !draft.callOnArrival })}
              />
              <FilterChip
                label={leaveWithSecurityLabel}
                selected={draft.leaveWithSecurity}
                onPress={() => patch({ leaveWithSecurity: !draft.leaveWithSecurity })}
              />
              <FilterChip
                label={dontRingBellLabel}
                selected={draft.dontRingBell}
                onPress={() => patch({ dontRingBell: !draft.dontRingBell })}
              />
              <FilterChip
                label={liftNotWorkingLabel}
                selected={draft.liftNotWorking}
                onPress={() => patch({ liftNotWorking: !draft.liftNotWorking })}
              />
            </View>
            <Text variant="caption1" color={semantic.textMuted}>
              {noteLabel}
            </Text>
            <TextInput
              accessibilityLabel={noteLabel}
              value={draft.riderNote}
              placeholder={notePlaceholder}
              placeholderTextColor={neutral.faint}
              multiline
              onChangeText={(riderNote) => patch({ riderNote: riderNote.slice(0, NOTE_MAX) })}
              style={styles.note}
            />
            <Text variant="caption2" color={semantic.textFaint} style={styles.count}>
              {draft.riderNote.length}/{NOTE_MAX}
            </Text>
          </View>

          <Checkbox
            label={deliverNowLabel}
            checked={draft.deliverNow}
            onChange={(deliverNow) => patch({ deliverNow })}
          />
          <Text variant="caption1" color={semantic.textMuted}>
            {deliverNowHint}
          </Text>
          {showErrors && saveError ? (
            <Text variant="footnote" color={semantic.danger} style={styles.error}>
              {saveError}
            </Text>
          ) : null}
          <Button
            label={saveAndDeliver}
            tone="filled"
            size="large"
            disabled={saving}
            onPress={() => void submit()}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
