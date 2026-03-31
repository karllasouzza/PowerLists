# Design System Foundation — PowerLists

Analyze a design reference and extend the PowerLists design system: update design tokens in `src/css/global.css` and `tailwind.config.js`.

## Input

[SCREENSHOT OR FIGMA URL / DRIBBBLE / BEHANCE REFERENCE]

## Project Stack

- **React Native** 0.83 + **Expo** 55 + **Expo Router** (file-based routing)
- **NativeWind** 4.1 (Tailwind CSS for React Native via `className` props)
- **Design tokens**: `src/css/global.css` (HSL CSS variables) + `tailwind.config.js` (Tailwind mappings)
- **Fonts**: `@expo-google-fonts/poppins` (primary sans-serif) + `@expo-google-fonts/lora` (serif) — already installed
- **Dark mode**: `'class'` strategy in `tailwind.config.js`

## Existing Design System

### Token File: `src/css/global.css`

Tokens are HSL values (no `hsl()` wrapper — NativeWind handles it). The `@theme inline` block maps them to Tailwind via `--color-*` variables.

**Current Light Mode Palette:**
| Token | Value | Description |
|---|---|---|
| `--background` | `90 20% 98%` | Off-white page background |
| `--foreground` | `127 15% 12%` | Dark text |
| `--primary` | `123 44% 34%` | Moss-green brand color |
| `--primary-foreground` | `0 0% 100%` | White on primary |
| `--secondary` | `122 30% 93%` | Light mint secondary |
| `--secondary-foreground` | `125 59% 24%` | Dark green on secondary |
| `--muted` | `90 12% 94%` | Muted background |
| `--muted-foreground` | `138 5% 38%` | Medium grey text |
| `--accent` | `122 38% 83%` | Bright mint accent |
| `--accent-foreground` | `125 59% 24%` | Dark green on accent |
| `--destructive` | `1 65% 47%` | Red/error |
| `--border` | `90 10% 88%` | Soft border |
| `--input` | `90 12% 88%` | Input border |
| `--ring` | `123 44% 34%` | Focus ring (= primary) |
| `--radius` | `1rem` | Border radius base |

**Custom Color Scales (50–950):**
- `moss-green` — primary brand green
- `beige` — warm neutral
- `bright-snow` — high-contrast whites
- `mint-cream` — interactive/accent tones
- `hunter-green` — deep accent

**Shadow Tokens:** `--shadow-2xs` through `--shadow-2xl` (CSS box-shadow values)

### Token File: `tailwind.config.js`

CSS variables are mapped to Tailwind classes using `hsl(var(--color-*))`:

```js
colors: {
  primary: {
    DEFAULT: 'hsl(var(--color-primary))',
    foreground: 'hsl(var(--color-primary-foreground))',
  },
  'moss-green': {
    50: 'hsl(var(--color-moss-green-50))',
    // ... 100 through 950
  },
  // ... all other semantic tokens and color scales
}
```

**To add a new color scale**, add both:
1. CSS variables in `src/css/global.css` (light and dark variants)
2. Tailwind mapping in `tailwind.config.js`

---

## Workflow

### 1. Analyze the Design

Look at the reference and identify:

**Colors:**
- Primary/brand color → does it fit the existing moss-green palette or needs a new scale?
- Neutral tones → map to beige or bright-snow scales
- Semantic colors (success, warning, info) → new tokens in `src/css/global.css`

**Typography:**
- Font family — Poppins (sans) and Lora (serif) are already available
- If a new font is needed: install via `expo install @expo-google-fonts/[font-name]`
- Load fonts in `src/app/_layout.tsx` using `useFonts` from `expo-font`

**Spacing & Radius:**
- Current base radius: `--radius: 1rem` (16px)
- Shadow style: choose from `--shadow-2xs` to `--shadow-2xl`

### 2. Update Design Tokens in `src/css/global.css`

Add or modify tokens in the `:root` block (light mode) and `.dark` block:

```css
/* src/css/global.css */

:root {
  /* === SEMANTIC TOKENS === */
  --background: [H S% L%];          /* page background */
  --foreground: [H S% L%];          /* primary text */
  --card: [H S% L%];                /* card surfaces */
  --card-foreground: [H S% L%];
  --popover: [H S% L%];             /* dropdowns, tooltips */
  --popover-foreground: [H S% L%];
  --primary: [H S% L%];             /* brand color */
  --primary-foreground: [H S% L%];
  --secondary: [H S% L%];
  --secondary-foreground: [H S% L%];
  --muted: [H S% L%];
  --muted-foreground: [H S% L%];
  --accent: [H S% L%];
  --accent-foreground: [H S% L%];
  --destructive: [H S% L%];
  --border: [H S% L%];
  --input: [H S% L%];
  --ring: [H S% L%];                /* = primary */

  /* === SIDEBAR === */
  --sidebar: [H S% L%];
  --sidebar-foreground: [H S% L%];
  --sidebar-primary: [H S% L%];
  --sidebar-primary-foreground: [H S% L%];
  --sidebar-accent: [H S% L%];
  --sidebar-accent-foreground: [H S% L%];
  --sidebar-border: [H S% L%];
  --sidebar-ring: [H S% L%];

  /* === CUSTOM SCALES (new) === */
  --color-[scale-name]-50: [H S% L%];
  --color-[scale-name]-100: [H S% L%];
  /* ... 200 through 950 */

  /* === BORDER RADIUS === */
  --radius: 1rem;   /* adjust if needed */

  /* === SHADOWS === */
  --shadow-2xs: 0 1px 3px 0px rgb(0 0 0 / 0.05);
  /* ... keep existing or adjust */
}

.dark {
  /* Mirror all tokens with dark-mode-appropriate values */
  --background: [H S% L%];
  --foreground: [H S% L%];
  /* ... */
}

@theme inline {
  /* Map every new token to --color-* for Tailwind */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... */
  --color-[new-token]: var(--[new-token]);
}
```

> **Rule:** Values are raw HSL components (`H S% L%`), NOT wrapped in `hsl()`. NativeWind applies the wrapper.
> **Rule:** Every `:root` token must also exist in `.dark` and in `@theme inline`.

### 3. Update `tailwind.config.js`

For any new semantic token or color scale added to `src/css/global.css`, add a Tailwind mapping:

```js
// tailwind.config.js
colors: {
  // Existing semantic tokens (update if needed)
  primary: {
    DEFAULT: 'hsl(var(--color-primary))',
    foreground: 'hsl(var(--color-primary-foreground))',
  },

  // New color scale
  '[scale-name]': {
    50:  'hsl(var(--color-[scale-name]-50))',
    100: 'hsl(var(--color-[scale-name]-100))',
    200: 'hsl(var(--color-[scale-name]-200))',
    300: 'hsl(var(--color-[scale-name]-300))',
    400: 'hsl(var(--color-[scale-name]-400))',
    500: 'hsl(var(--color-[scale-name]-500))',
    600: 'hsl(var(--color-[scale-name]-600))',
    700: 'hsl(var(--color-[scale-name]-700))',
    800: 'hsl(var(--color-[scale-name]-800))',
    900: 'hsl(var(--color-[scale-name]-900))',
    950: 'hsl(var(--color-[scale-name]-950))',
  },
},
```

### 4. Add New Fonts (if needed)

Fonts are loaded in `src/app/_layout.tsx` using `@expo-google-fonts`:

```bash
# Install the font package
expo install @expo-google-fonts/[font-name]
```

```tsx
// src/app/_layout.tsx
import { useFonts } from 'expo-font';
import { [FontName]_400Regular, [FontName]_700Bold } from '@expo-google-fonts/[font-name]';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    '[FontName]': [FontName]_400Regular,
    '[FontName]-Bold': [FontName]_700Bold,
  });

  // ...
}
```

Then register in `tailwind.config.js` under `fontFamily`.

### 5. Verify Tokens Work

Test the new tokens in any existing screen:

```tsx
// Quick verification — add temporarily to any screen
<View className="bg-primary p-4">
  <Text className="text-primary-foreground">Primary token works</Text>
</View>
<View className="bg-[your-new-token] p-4">
  <Text className="text-foreground">New token works</Text>
</View>
```

Run `yarn start` and check visually on device/emulator in both light and dark modes.

### 6. Dark Mode Toggle

Dark mode is toggled via the `dark` class on the root component. Use `useColorScheme` from `nativewind`:

```tsx
import { useColorScheme } from 'nativewind';

const { colorScheme, toggleColorScheme } = useColorScheme();
```

Verify dark mode tokens look correct when toggled.

---

## Directory Structure

```
src/
├── css/
│   └── global.css          ← Design token definitions (HSL vars)
├── app/
│   └── _layout.tsx         ← Font loading
└── (components use className to reference tokens)

tailwind.config.js           ← Maps CSS vars to Tailwind color classes
```

## Output

- `src/css/global.css` updated with new/modified tokens (light + dark + @theme inline)
- `tailwind.config.js` updated with Tailwind mappings for all new tokens
- New font installed and loaded (if applicable)
- Tokens verified visually in the app

---

## Design Summary (provide after update)

- **Primary color:** [hex and palette name, e.g., "moss-green-600 / #3a7a3a"]
- **Font:** [e.g., "Poppins (sans) + Lora (serif) — already in project"]
- **Style:** [e.g., "Natural, organic, calm — earthy greens and warm beige"]
- **Border radius:** [`--radius: 1rem` = 16px rounded corners]
- **Shadows:** [e.g., "Soft, subtle — shadow-sm for cards"]
- **Overall feel:** [brief description]

---

## Notes

- Values are raw HSL components — never wrap in `hsl()` inside `src/css/global.css`
- Ensure all tokens exist in both `:root` (light) and `.dark` blocks
- Ensure sufficient contrast for accessibility (4.5:1 for text)
- Color scales should be cohesive: generate using a hue-consistent scale
- Do not use `StyleSheet.create()` — all styling via NativeWind `className`
