/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Color scheme for CareBlue
 * Primary colors and derived colors for consistent styling
 */

// Primary Colors
export const primaryBlue = '#4A90E2';
export const primaryTeal = '#5BBFBA';

// Derived Colors
export const darkBlue = '#1B365D';
export const lightBlue = '#C5DAFF';
export const white = '#FFFFFF';
export const offWhite = '#F8F9FA';
export const lightGray = '#EFEFEF';

export const Colors = {
  light: {
    text: darkBlue,
    background: offWhite,
    cardBackground: white,
    tint: primaryBlue,
    tintSecondary: primaryTeal,
    tabIconDefault: darkBlue,
    tabIconSelected: primaryBlue,
  },
  dark: {
    text: white,
    background: darkBlue,
    cardBackground: '#243B5D',
    tint: primaryTeal,
    tintSecondary: primaryBlue,
    tabIconDefault: lightBlue,
    tabIconSelected: primaryTeal,
  },
  // Gradients
  gradients: {
    headerFooter: [primaryBlue, primaryTeal],
    cardPrimary: [lightBlue, lightGray],
    cardSecondary: [lightBlue, `rgba(91, 191, 186, 0.2)`],
    testimonial: [primaryTeal, primaryBlue],
  }
};
