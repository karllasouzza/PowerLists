---
name: design-system-updater
description: Update PowerLists design system by analyzing design references and modifying design tokens in src/css/global.css and tailwind.config.js. Use when updating colors, typography, spacing, or other design tokens following PowerLists design system guidelines.
---

# Design System Updater

## Purpose
Update the PowerLists design system by analyzing design references and modifying design tokens according to the established guidelines.

## Input Requirements
- Design reference (Figma URL, screenshot, Dribbble/Behance link)
- Understanding of current PowerLists stack: React Native 0.83 + Expo 55 + Expo Router, NativeWind 4.1, HSL CSS variables

## Workflow Steps

### 1. Analyze the Design Reference
- Identify primary/brand colors and determine if they fit existing moss-green palette or need new scale
- Map neutral tones to beige or bright-snow scales
- Identify semantic colors (success, warning, info) for new tokens
- Check typography requirements (Poppins sans-serif and Lora serif are already available)
- Note spacing & radius requirements (current base radius: --radius: 1rem)
- Identify shadow style preferences

### 2. Update Design Tokens in src/css/global.css
- Add or modify tokens in the :root block (light mode) and .dark block
- Follow rules:
  - Values are raw HSL components (H S% L%), NOT wrapped in hsl()
  - Every :root token must also exist in .dark and in @theme inline
- Update semantic tokens (background, foreground, primary, etc.)
- Add custom color scales as needed
- Update border radius and shadows if required

### 3. Update tailwind.config.js
- For any new semantic token or color scale added to src/css/global.css, add Tailwind mapping
- Use hsl(var(--color-*)) format for color mappings
- Maintain existing structure while adding new color scales

### 4. Add New Fonts (if needed)
- Install font package: expo install @expo-google-fonts/[font-name]
- Load fonts in src/app/_layout.tsx using useFonts from expo-font
- Register in tailwind.config.js under fontFamily

### 5. Verify Tokens Work
- Test new tokens in existing screens using className attributes
- Run yarn start and check visually on device/emulator in both light and dark modes
- Verify dark mode tokens look correct when toggled

## Verification Checklist
- [ ] All new tokens exist in :root, .dark, and @theme inline blocks
- [ ] All HSL values are raw components (no hsl() wrapper)
- [ ] Tailwind mappings use correct hsl(var(--color-*)) format
- [ ] New fonts are properly installed and loaded
- [ ] Visual verification completed in both light and dark modes
- [ ] Contrast ratios meet accessibility requirements (4.5:1 for text)

## Additional Resources
- For complete design system documentation, see [.github/agents/design-system-foundation.md](/home/karllasouzza/Projects/me/PowerLists/.github/agents/design-system-foundation.md)
