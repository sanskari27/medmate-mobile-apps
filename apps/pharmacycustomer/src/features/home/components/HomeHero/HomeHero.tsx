import { useState } from 'react';
import { Image, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { Button, Icon, Text } from '@medmate/base-components';
import { brand, semantic } from '@medmate/theme';

import type { HomeCoupon } from '../../types/home';
import {
  deliveryWindow,
  homeCategories,
  offersLabel,
  searchLabel,
  sourceAction,
  sourceEyebrow,
  sourceNote,
  sourceTitle,
  type HomeCategory,
} from '../../utils/copy';
import { homeHeroStyles as styles } from './HomeHero.styles';

export type HomeHeroProps = {
  coupons: HomeCoupon[];
  onSearchPress: () => void;
  onCategoryPress: (category: HomeCategory) => void;
};

export function bannerPage(offset: number, pageWidth: number): number {
  if (pageWidth <= 0) return 0;
  const page = Math.round(offset / pageWidth);
  if (page <= 0) return 0;
  return page;
}

export function slideLabel(index: number): string {
  return `Slide ${index + 1}`;
}

function SourceCard() {
  return (
    <View style={styles.source}>
      <View pointerEvents="none" style={styles.ring} />
      <View pointerEvents="none" style={styles.ringInner} />
      <View style={styles.sourceCopy}>
        <Text variant="eyebrow" color={brand.forest}>
          {sourceEyebrow}
        </Text>
        <Text variant="title3" color={brand.forest}>
          {sourceTitle}
        </Text>
        <Text variant="footnote" color={semantic.textSecondary}>
          {sourceNote}
        </Text>
        <Button label={sourceAction} tone="forest" chevron style={styles.sourceButton} />
      </View>
      <View pointerEvents="none" style={styles.sourceArt}>
        <View style={styles.searchOrb}>
          <Icon name="search" size={24} color={brand.gold} />
        </View>
        <View style={[styles.tile, styles.tilePill]}>
          <Icon name="pill" size={16} color={brand.green} />
        </View>
        <View style={[styles.tile, styles.tilePhone]}>
          <Icon name="phone" size={16} color={brand.green} />
        </View>
      </View>
    </View>
  );
}

export function HomeHero({ coupons, onSearchPress, onCategoryPress }: HomeHeroProps) {
  const { width } = useWindowDimensions();
  const [chosen, setChosen] = useState<HomeCategory>(homeCategories[0]);
  const [page, setPage] = useState(0);
  const slides = coupons.length + 1;

  return (
    <View style={styles.mast}>
      <View pointerEvents="none" style={styles.watermark}>
        <Icon name="pill" size={48} color={semantic.textOnBrand} />
      </View>
      <View style={styles.block}>
        <View style={styles.delivery}>
          <View style={styles.scooter}>
            <Icon name="scooter" size={16} color={brand.forest} />
          </View>
          <Text
            variant="headline"
            color={semantic.textOnBrand}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            style={styles.deliveryTitle}
          >
            {deliveryWindow}
          </Text>
          <Icon name="shield" size={16} color={brand.gold} />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={searchLabel}
          onPress={onSearchPress}
          style={styles.search}
        >
          <Icon name="search" size={20} color={semantic.textMuted} />
          <Text
            variant="subheadline"
            color={semantic.textMuted}
            numberOfLines={1}
            style={styles.searchCopy}
          >
            {searchLabel}
          </Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroller}
        contentContainerStyle={styles.chips}
      >
        {homeCategories.map((category) => {
          const selected = category === chosen;
          return (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityLabel={category}
              accessibilityState={{ selected }}
              onPress={() => {
                setChosen(category);
                onCategoryPress(category);
              }}
              style={[styles.chip, selected ? styles.chipOn : null]}
            >
              {selected ? null : <View pointerEvents="none" style={styles.glass} />}
              <Text
                variant="footnoteEmphasized"
                color={selected ? brand.forest : semantic.textOnBrand}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <ScrollView
          horizontal
          pagingEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          accessibilityLabel={offersLabel}
          onMomentumScrollEnd={(event) => {
            setPage(bannerPage(event.nativeEvent.contentOffset.x, width));
          }}
        >
          {coupons.map((coupon) => (
            <View key={coupon.id} style={[styles.slide, { width }]}>
              <Image
                accessibilityLabel={coupon.title}
                source={{ uri: coupon.banner.url }}
                style={styles.banner}
              />
            </View>
          ))}
          <View style={[styles.slide, { width }]}>
            <SourceCard />
          </View>
        </ScrollView>
        {slides > 1 ? (
          <View style={styles.pager}>
            {coupons.map((coupon, index) => (
              <View
                key={coupon.id}
                accessibilityLabel={slideLabel(index)}
                accessibilityState={{ selected: index === page }}
                style={[styles.dot, index === page ? styles.dotOn : null]}
              />
            ))}
            <View
              accessibilityLabel={slideLabel(coupons.length)}
              accessibilityState={{ selected: page === coupons.length }}
              style={[styles.dot, page === coupons.length ? styles.dotOn : null]}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}
