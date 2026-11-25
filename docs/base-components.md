# Base components

`@medmate/base-components` is the shared kit. Import from the package root only.

```tsx
import { Button, Screen, Text } from '@medmate/base-components';
```

Each control lives in `src/<component-name>/<Component>.tsx` with its test beside it. Shared helpers sit in the same folder (`text/resolve-type.ts`, `icon/iconPaths.ts`).

Controls use NativeWind classes for layout, colour, spacing, radius, and type. Gradients, shadows, and icons use theme tokens directly. Prop names match the existing MedMate app where a control already existed (`Button` tones, `Text` variants).

## Starter kit

| Component       | Role                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Box`           | Surface container. `className` optional.                                                                                                        |
| `Stack`         | `direction` `row` or `column`. `gap` is a spacing token.                                                                                        |
| `Screen`        | Page shell with safe area and the page gutter.                                                                                                  |
| `ScrollScreen`  | Scrolling page shell.                                                                                                                           |
| `Text`          | `variant` is an iOS token, Material token, or type role. `color` defaults to `semantic.text`.                                                   |
| `Button`        | `label`, `tone` (`filled`, `forest`, `gold`, `outline`, `muted`, `mint`), `size` (`small`, `large`), optional `icon` and `chevron`, `disabled`. |
| `IconButton`    | `icon` plus a required `accessibilityLabel`. Touch target follows platform metrics.                                                             |
| `TextField`     | `label`, `value`, `onChangeText`, optional `error`, `disabled`, `secureTextEntry`.                                                              |
| `PasswordField` | Text field plus show/hide. `revealed`, `onToggleReveal`.                                                                                        |
| `Checkbox`      | `checked`, `onChange`, `disabled`.                                                                                                              |
| `Switch`        | `value`, `onValueChange`, `disabled`.                                                                                                           |
| `RadioGroup`    | `options` (`label`, `value`, optional `disabled`), `value`, `onChange`.                                                                         |
| `Card`          | Surface with the card radius and medium elevation.                                                                                              |
| `Badge`         | `tone`: `neutral`, `success`, `warning`, `danger`.                                                                                              |
| `Divider`       | `strong`, `dashed`, or a `label` for a labelled rule.                                                                                           |
| `Spinner`       | `size` `small` or `large`. Default label `Loading`.                                                                                             |
| `Banner`        | `tone` `info`, `warning`, or `danger`.                                                                                                          |
| `ListItem`      | `title`, optional `subtitle`, `icon`, `chevron`, `onPress`.                                                                                     |
| `Avatar`        | `initials`, `size` `sm`, `md`, or `lg`.                                                                                                         |
| `Modal`         | Centered dialog. `visible`, `title`, `onClose`.                                                                                                 |

## Controls taken from the current screens

| Component                                   | Role                                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| `Icon`                                      | Stroked glyph set shared with the current app. `name`, `color` (a token), `size`. |
| `Gradient`                                  | `token` or an explicit `colors` list. Vertical.                                   |
| `ArtTile`                                   | Mint art tile. `initials` when `photo` is absent.                                 |
| `AddButton`                                 | Filled button, plus icon, default label `ADD`.                                    |
| `IconTile`                                  | Icon plus label on a mint tile.                                                   |
| `Eyebrow`                                   | Uppercase eyebrow text.                                                           |
| `SectionHeader`                             | Title plus an optional action.                                                    |
| `EmptyState`                                | Title, message, optional action button.                                           |
| `ServiceChip`, `FilterChip`, `CategoryChip` | `label`, `selected`, `onPress`.                                                   |
| `OutlinePillButton`                         | Outline button.                                                                   |
| `SortButton`                                | Outline button labelled Sort.                                                     |
| `InfoNote`                                  | Mint note.                                                                        |
| `CheckLine`                                 | Label with a check or minus icon.                                                 |
| `FactTile`                                  | Label and value.                                                                  |
| `ChoiceTile`                                | Selectable tile. Optional `description`.                                          |
| `FoldRow`                                   | Disclosure row. `expanded`, `onToggle`.                                           |
| `QuantityStepper`                           | `value`, `min`, `max`, `onChange`.                                                |
| `Stepper`                                   | Steps with `complete`, `current`, or `upcoming`.                                  |
| `SegmentedControl`                          | `options`, `value`, `onChange`.                                                   |
| `ProgressRing`                              | `progress` clamped to 0–1.                                                        |
| `SearchField`                               | Query field. Clear button when the value is non-empty.                            |
| `OtpInput`                                  | Digits only, default length 6.                                                    |
| `Sheet`                                     | Bottom sheet. `visible`, `title`, `onClose`.                                      |
| `Dialog`                                    | Confirm and cancel buttons.                                                       |

## Left in each app

Product tiles, shop sections, brand hero and tab bar, cart bar, search result rows, order cards, the track map, pharmacy and coupon cards, care and consultation cards, family and dose rows, chat, and the splash wordmark stay in the app. They render catalogue, cart, order, pharmacy, or care data.

## Adding a component

1. Add `packages/base-components/src/<component-name>/<Component>.tsx` and a colocated `<Component>.test.tsx`. Export the control from `src/index.ts`. Do not add a folder `index.ts`.
2. Cover every branch, including disabled and pressed, with Testing Library.
3. Use theme tokens or NativeWind classes. No raw hex.
4. Add a row to this document.
