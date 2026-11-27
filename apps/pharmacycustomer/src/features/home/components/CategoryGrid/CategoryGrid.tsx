import { Image, Pressable, View } from 'react-native';
import { Text } from '@medmate/base-components';

import type { AppSection } from '../../types/home';
import { categoryGridStyles as styles } from './CategoryGrid.styles';

export type CategoryGridProps = {
  sections: AppSection[];
};

export function CategoryGrid({ sections }: CategoryGridProps) {
  if (sections.length === 0) return null;
  return (
    <View style={styles.grid}>
      {sections.map((section) => (
        <Pressable
          key={section.id}
          accessibilityRole="button"
          accessibilityLabel={section.category}
          style={styles.cell}
        >
          <Image accessible={false} source={{ uri: section.image.url }} style={styles.image} />
          <Text variant="caption" numberOfLines={2} style={styles.label}>
            {section.category}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
