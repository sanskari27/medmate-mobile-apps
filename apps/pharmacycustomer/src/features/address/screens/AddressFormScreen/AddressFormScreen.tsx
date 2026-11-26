import { Button, FilterChip, Icon, Text, TextField } from '@medmate/base-components';
import { brand, neutral, semantic, spacing } from '@medmate/theme';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../../../../hooks/use-store';
import { readCurrentPin, type CurrentPin } from '../../../../services/location';
import { selectAddressError } from '../../../../store/selectors/address.selectors';
import { selectAccountPhone } from '../../../../store/selectors/auth.selectors';
import { nationalDigits, storedNationalDigits } from '../../../../utils/phone';
import { BENGALURU_PIN, PinMap } from '../../components/PinMap';
import { saveAddress } from '../../store/address.slice';
import type { Address, AddressLabel, AddressPin } from '../../types/address';
import {
  deliversHere,
  emptyDraft,
  toAddressInput,
  validateAddress,
} from '../../utils/address-form';
import {
  addAddressTitle,
  addressBack,
  addressDetails,
  callOnArrivalLabel,
  detectLocationLabel,
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
  NOTE_MAX,
  noteLabel,
  notePlaceholder,
  pinDenied,
  placeUnread,
  receiverHeading,
  receiverNameLabel,
  receiverPhoneHint,
  receiverPhoneLabel,
  saveAndDeliver,
  saveAs,
  serviceNote,
  useMyNumber,
} from '../../utils/copy';
import { readPlace } from '../../utils/place';
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
  const [pinNote, setPinNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const lookup = useRef(0);

  const fillFromPin = useCallback((next: AddressPin) => {
    const ticket = ++lookup.current;
    void readPlace(next.latitude, next.longitude).then((found) => {
      if (ticket !== lookup.current) return;
      if (!found) {
        setDraft((current) => ({ ...current, city: '', pincode: '' }));
        setPinNote(placeUnread);
        return;
      }
      setDraft((current) => ({ ...current, city: found.city, pincode: found.pincode }));
      setPinNote('');
    });
  }, []);

  useEffect(() => {
    if (address || !pin) return;
    fillFromPin(pin);
  }, [address, fillFromPin, pin]);

  function patch(partial: Partial<typeof draft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function place(next: AddressPin) {
    setDraft((current) => ({ ...current, pin: next, city: '', pincode: '' }));
    setPinNote('');
    setErrors((current) => {
      if (!current.pin && !current.pincode) return current;
      const nextErrors = { ...current };
      delete nextErrors.pin;
      delete nextErrors.pincode;
      return nextErrors;
    });
    fillFromPin(next);
  }

  function lockScroll() {
    setScrollEnabled(false);
  }

  function unlockScroll() {
    setScrollEnabled(true);
  }

  async function detect() {
    const next = await readCurrentPin();
    if (!next) {
      setPinNote(pinDenied);
      return;
    }
    place(next);
  }

  async function submit() {
    const next = validateAddress(draft);
    setErrors(next);
    setShowErrors(true);
    if (Object.keys(next).length > 0) return;
    const selected = address ? address.selected : true;
    const body = toAddressInput(draft, selected);
    setSaving(true);
    const result = await dispatch(saveAddress(address ? { id: address.id, body } : { body }));
    setSaving(false);
    if (saveAddress.fulfilled.match(result) && !selected) onBack();
  }

  const fieldError = (key: keyof typeof errors) => (showErrors ? errors[key] : undefined);
  const liveNote = pinNote === pinDenied || pinNote === placeUnread ? pinNote : null;
  const pinError = fieldError('pin');
  const placeError = pinError || deliversHere(draft.pincode) ? undefined : fieldError('pincode');
  const unserviceable = draft.pincode.trim() !== '' && !deliversHere(draft.pincode);
  const status = liveNote ?? (unserviceable ? serviceNote : null) ?? placeError;

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <StatusBar style="light" />
      <ScrollView
        style={styles.form}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.nav}>
            <Pressable accessibilityRole="button" accessibilityLabel={addressBack} onPress={onBack}>
              <Icon name="arrow-left" size={24} color={semantic.textOnBrand} />
            </Pressable>
            <Text variant="headline" color={semantic.textOnBrand}>
              {address ? editAddressTitle : addAddressTitle}
            </Text>
          </View>
        </View>
        <View style={styles.sheet}>
          <PinMap
            center={draft.pin ?? BENGALURU_PIN}
            onMove={place}
            onGestureStart={lockScroll}
            onGestureEnd={unlockScroll}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={detectLocationLabel}
              onPress={() => void detect()}
              style={styles.detect}
            >
              <Icon name="pin" size={16} color={brand.green} />
              <Text variant="button" color={brand.green}>
                {detectLocationLabel}
              </Text>
            </Pressable>
          </PinMap>
          <View style={styles.content}>
            {status ? (
              <Text variant="caption1" color={semantic.danger}>
                {status}
              </Text>
            ) : null}
            {pinError ? (
              <Text variant="caption1" color={semantic.danger}>
                {pinError}
              </Text>
            ) : null}
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
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
