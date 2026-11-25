import { Image, View } from 'react-native';

import carton from './images/carton.jpg';
import syrup from './images/syrup.jpg';
import tablets from './images/tablets.jpg';
import { medicineFanStyles as styles } from './MedicineFan.styles';

const cards = [
  { source: carton, label: 'Medicine carton', frame: styles.left },
  { source: tablets, label: 'Tablet pack', frame: styles.right },
  { source: syrup, label: 'Cough syrup', frame: styles.center },
] as const;

export function MedicineFan() {
  return (
    <View style={styles.stage}>
      {cards.map((card) => (
        <View key={card.label} style={[styles.slot, card.frame]}>
          <View style={styles.card}>
            <Image
              source={card.source}
              style={styles.photo}
              resizeMode="cover"
              accessible
              accessibilityRole="image"
              accessibilityLabel={card.label}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
