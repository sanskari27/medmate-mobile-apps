import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon, Text, type IconName } from '@medmate/base-components';
import { brand, gold, semantic, spacing } from '@medmate/theme';

import identity from '../../../../../identity.json';
import { useAppDispatch, useAppSelector } from '../../../../hooks/use-store';
import { selectAccountPhone } from '../../../../store/selectors/auth.selectors';
import { splitMark } from '../../../../shared/components/Wordmark/Wordmark';
import { formatSignedInPhone } from '../../../../utils/phone';
import { signOut, termsAccepted } from '../../store/auth.slice';
import {
  ageHint,
  ageLabel,
  contactShare,
  healthBody,
  healthMeaning,
  healthTitle,
  offersHint,
  offersLabel,
  orderUpdates,
  privacyLink,
  termsAgree,
  termsConsentLead,
  termsConsentMiddle,
  termsDecline,
  termsHeadingAccent,
  termsHeadingLead,
  termsIncludedLabel,
  termsIntro,
  termsLink,
  termsSignedIn,
  termsVersion,
  usageBody,
  usageMeaning,
  usageTitle,
  whatThisMeans,
  whatThisMeansLabel,
} from '../../utils/copy';
import { termsScreenStyles as styles } from './TermsScreen.styles';

export function TermsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const phone = formatSignedInPhone(useAppSelector(selectAccountPhone));
  const { lead, accent } = splitMark(identity.displayName);
  const [adult, setAdult] = useState(true);
  const [offers, setOffers] = useState(false);
  const [open, setOpen] = useState<'health' | 'usage' | null>(null);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text variant="wordmark" style={styles.mark}>
          <Text variant="wordmark" color={semantic.textOnBrand}>
            {lead}
          </Text>
          <Text variant="wordmark" color={brand.gold}>
            {accent}
          </Text>
        </Text>
        <View style={styles.seal}>
          <Icon name="shield" size={18} color={gold[300]} />
        </View>
        <Text variant="title2" style={styles.title}>
          <Text variant="title2" color={semantic.textOnBrand}>
            {termsHeadingLead}{' '}
          </Text>
          <Text variant="title2" color={gold[300]}>
            {termsHeadingAccent}
          </Text>
        </Text>
        <Text variant="footnote" color={semantic.textOnBrand} style={styles.intro}>
          {termsIntro}
        </Text>
        {phone ? (
          <Text variant="caption1" color={gold[100]} style={styles.signedIn}>
            {termsSignedIn(phone)}
          </Text>
        ) : null}
      </View>
      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={[
            styles.sheetContent,
            { paddingBottom: insets.bottom + spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.included}>
            <Text variant="eyebrow" color={semantic.textMuted}>
              {termsIncludedLabel}
            </Text>
            <TermBlock
              icon="rx-doc"
              title={healthTitle}
              body={healthBody}
              meaning={healthMeaning}
              expanded={open === 'health'}
              onToggle={() => setOpen(open === 'health' ? null : 'health')}
            />
            <TermBlock
              icon="star"
              title={usageTitle}
              body={usageBody}
              meaning={usageMeaning}
              expanded={open === 'usage'}
              onToggle={() => setOpen(open === 'usage' ? null : 'usage')}
            />
          </View>
          <PlainNote icon="bell" copy={orderUpdates} />
          <PlainNote icon="shield" copy={contactShare} />
          <View style={styles.choices}>
            <ConsentChoice
              label={ageLabel}
              hint={ageHint}
              hintColor={semantic.textMuted}
              checked={adult}
              onChange={setAdult}
            />
            <ConsentChoice
              label={offersLabel}
              hint={offersHint}
              hintColor={brand.green}
              checked={offers}
              onChange={setOffers}
            />
          </View>
          <Text variant="footnote" color={semantic.textSecondary} style={styles.consent}>
            {termsConsentLead}
            <Text variant="footnoteEmphasized" color={brand.green}>
              {termsLink}
            </Text>
            {termsConsentMiddle}
            <Text variant="footnoteEmphasized" color={brand.green}>
              {privacyLink}
            </Text>
            .
          </Text>
          <Button
            label={termsAgree}
            tone={adult ? 'filled' : 'muted'}
            size="large"
            chevron
            disabled={!adult}
            onPress={() => dispatch(termsAccepted())}
            style={styles.submit}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={termsDecline}
            onPress={() => void dispatch(signOut())}
            style={styles.decline}
          >
            <Text variant="footnote" color={semantic.textSecondary}>
              {termsDecline}
            </Text>
          </Pressable>
          <Text variant="caption2" color={semantic.textFaint} style={styles.version}>
            {termsVersion}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

function TermBlock({
  icon,
  title,
  body,
  meaning,
  expanded,
  onToggle,
}: {
  icon: IconName;
  title: string;
  body: string;
  meaning: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.term}>
      <View style={styles.termIcon}>
        <Icon name={icon} size={20} color={brand.green} />
      </View>
      <View style={styles.termCopy}>
        <Text variant="headline">{title}</Text>
        <Text variant="footnote" color={semantic.textSecondary}>
          {body}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={whatThisMeansLabel(title)}
          accessibilityState={{ expanded }}
          onPress={onToggle}
          style={styles.meaning}
        >
          <Text variant="footnoteEmphasized" color={brand.green}>
            {whatThisMeans}
          </Text>
          <Icon
            name="chev-d"
            size={14}
            color={brand.green}
            style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
          />
        </Pressable>
        {expanded ? (
          <Text variant="footnote" color={semantic.textSecondary}>
            {meaning}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function PlainNote({ icon, copy }: { icon: IconName; copy: string }) {
  return (
    <View style={styles.note}>
      <Icon name={icon} size={18} color={semantic.textMuted} style={styles.noteIcon} />
      <Text variant="footnote" color={semantic.textSecondary} style={styles.noteCopy}>
        {copy}
      </Text>
    </View>
  );
}

function ConsentChoice({
  label,
  hint,
  hintColor,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  hintColor: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.choice}
    >
      <View style={[styles.radio, checked ? styles.radioOn : styles.radioOff]}>
        {checked ? <Icon name="check" size={14} color={semantic.textOnBrand} /> : null}
      </View>
      <View style={styles.choiceCopy}>
        <Text variant="subheadlineEmphasized">{label}</Text>
        <Text variant="footnote" color={hintColor}>
          {hint}
        </Text>
      </View>
    </Pressable>
  );
}
