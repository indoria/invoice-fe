function constructThemeCSSVariables({
  primary,
  primaryVariant,
  secondary,
  secondaryVariant,
  background,
  surface,
  error,
  onPrimary,
  onSecondary,
  onBackground,
  onSurface,
  onError
}, themePrefix = 'md-theme-') {

  if (!primary || !secondary || !background || !surface || !error || !onPrimary || !onSecondary || !onBackground || !onSurface || !onError) {
    console.error("Missing required color parameters for theme construction.");
    return '';
  }


  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  }

  const primaryRgb = hexToRgb(primary);


  let cssVariables = `:root {
`;

  cssVariables += `  --${themePrefix}primary: ${primary};
`;
  if (primaryVariant) {
      cssVariables += `  --${themePrefix}primary-variant: ${primaryVariant};
`;
  }


  cssVariables += `  --${themePrefix}secondary: ${secondary};
`;
   if (secondaryVariant) {
      cssVariables += `  --${themePrefix}secondary-variant: ${secondaryVariant};
`;
   }


  cssVariables += `  --${themePrefix}background: ${background};
`;
  cssVariables += `  --${themePrefix}surface: ${surface};
`;
  cssVariables += `  --${themePrefix}error: ${error};
`;

  cssVariables += `  --${themePrefix}on-primary: ${onPrimary};
`;
  cssVariables += `  --${themePrefix}on-secondary: ${onSecondary};
`;
  cssVariables += `  --${themePrefix}on-background: ${onBackground};
`;
  cssVariables += `  --${themePrefix}on-surface: ${onSurface};
`;
  cssVariables += `  --${themePrefix}on-error: ${onError};
`;

  cssVariables += `
`;
  cssVariables += `  --${themePrefix}text-high-emphasis: rgba(${onBackground === '#FFFFFF' ? '255, 255, 255' : '0, 0, 0'}, 0.87);
`;
  cssVariables += `  --${themePrefix}text-medium-emphasis: rgba(${onBackground === '#FFFFFF' ? '255, 255, 255' : '0, 0, 0'}, 0.60);
`;
  cssVariables += `  --${themePrefix}text-disabled: rgba(${onBackground === '#FFFFFF' ? '255, 255, 255' : '0, 0, 0'}, 0.38);
`;

  cssVariables += `
`;
  cssVariables += `  --${themePrefix}icon-active: rgba(${onBackground === '#FFFFFF' ? '255, 255, 255' : '0, 0, 0'}, 1);
`;
  cssVariables += `  --${themePrefix}icon-inactive: rgba(${onBackground === '#FFFFFF' ? '255, 255, 255' : '0, 0, 0'}, 0.50);
`;
  cssVariables += `  --${themePrefix}icon-disabled: rgba(${onBackground === '#FFFFFF' ? '255, 255, 255' : '0, 0, 0'}, 0.38);
`;


  cssVariables += `
`;
  cssVariables += `  --${themePrefix}state-hover-opacity: 0.04;
`;
  cssVariables += `  --${themePrefix}state-focus-opacity: 0.12;
`;
  cssVariables += `  --${themePrefix}state-pressed-opacity: 0.12;
`;
  cssVariables += `  --${themePrefix}state-dragged-opacity: 0.08;
`;


   cssVariables += `
`;
   cssVariables += `  --${themePrefix}elevation-shadow-1: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-2: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-3: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-4: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-6: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-8: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-12: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-16: 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 14px 23px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-24: 0px 9px 12px -6px rgba(0, 0, 0, 0.2), 0px 16px 29px 2px rgba(0, 0, 0, 0.14), 0px 10px 37px 7px rgba(0, 0, 0, 0.12);
`;


   if (primaryRgb) {
       cssVariables += `
  --${themePrefix}primary-rgb: ${primaryRgb};
`;
       }


   cssVariables += `
`;
   cssVariables += `  --${themePrefix}elevation-overlay-1: 0.05;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-2: 0.07;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-3: 0.08;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-4: 0.09;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-6: 0.11;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-8: 0.12;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-12: 0.14;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-16: 0.15;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-24: 0.16;
`;


  cssVariables += `}`;

  return cssVariables;
}


const lightThemeColors = {
  primary: '#6200EE',
  primaryVariant: '#3700B3',
  secondary: '#03DAC4',
  secondaryVariant: '#018786',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF'
};

const lightThemeCSS = constructThemeCSSVariables(lightThemeColors, 'md-theme-light-');
console.log(lightThemeCSS);


const darkThemeColors = {
  primary: '#BB86FC',
  primaryVariant: '#3700B3',
  secondary: '#03DAC6',
  secondaryVariant: '#03DAC6',
  background: '#121212',
  surface: '#1E1E1E',
  error: '#CF6679',
  onPrimary: '#000000',
  onSecondary: '#000000',
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onError: '#000000'
};

const darkThemeCSS = constructThemeCSSVariables(darkThemeColors, 'md-theme-dark-');
console.log(darkThemeCSS);



function constructThemeCSSVariables({
  primary,
  primaryVariant,
  secondary,
  secondaryVariant,
  background,
  surface,
  error,
  onPrimary,
  onSecondary,
  onBackground,
  onSurface,
  onError
}, themePrefix = 'md-theme-') {

  if (!primary || !secondary || !background || !surface || !error || !onPrimary || !onSecondary || !onBackground || !onSurface || !onError) {
    console.error("Missing required color parameters for theme construction.");
    return '';
  }


  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  }

  const primaryRgb = hexToRgb(primary);


  let cssVariables = `:root {
`;

  cssVariables += `  --${themePrefix}primary: ${primary};
`;
  if (primaryVariant) {
      cssVariables += `  --${themePrefix}primary-variant: ${primaryVariant};
`;
  }


  cssVariables += `  --${themePrefix}secondary: ${secondary};
`;
   if (secondaryVariant) {
      cssVariables += `  --${themePrefix}secondary-variant: ${secondaryVariant};
`;
   }


  cssVariables += `  --${themePrefix}background: ${background};
`;
  cssVariables += `  --${themePrefix}surface: ${surface};
`;
  cssVariables += `  --${themePrefix}error: ${error};
`;

  cssVariables += `  --${themePrefix}on-primary: ${onPrimary};
`;
  cssVariables += `  --${themePrefix}on-secondary: ${onSecondary};
`;
  cssVariables += `  --${themePrefix}on-background: ${onBackground};
`;
  cssVariables += `  --${themePrefix}on-surface: ${onSurface};
`;
  cssVariables += `  --${themePrefix}on-error: ${onError};
`;

  cssVariables += `
`;
  cssVariables += `  --${themePrefix}text-high-emphasis: rgba(${onBackground === '#FFFFFF' || onBackground.toLowerCase() === 'white' ? '255, 255, 255' : '0, 0, 0'}, 0.87);
`;
  cssVariables += `  --${themePrefix}text-medium-emphasis: rgba(${onBackground === '#FFFFFF' || onBackground.toLowerCase() === 'white' ? '255, 255, 255' : '0, 0, 0'}, 0.60);
`;
  cssVariables += `  --${themePrefix}text-disabled: rgba(${onBackground === '#FFFFFF' || onBackground.toLowerCase() === 'white' ? '255, 255, 255' : '0, 0, 0'}, 0.38);
`;

  cssVariables += `
`;
  cssVariables += `  --${themePrefix}icon-active: rgba(${onBackground === '#FFFFFF' || onBackground.toLowerCase() === 'white' ? '255, 255, 255' : '0, 0, 0'}, 1);
`;
  cssVariables += `  --${themePrefix}icon-inactive: rgba(${onBackground === '#FFFFFF' || onBackground.toLowerCase() === 'white' ? '255, 255, 255' : '0, 0, 0'}, 0.50);
`;
  cssVariables += `  --${themePrefix}icon-disabled: rgba(${onBackground === '#FFFFFF' || onBackground.toLowerCase() === 'white' ? '255, 255, 255' : '0, 0, 0'}, 0.38);
`;


  cssVariables += `
`;
  cssVariables += `  --${themePrefix}state-hover-opacity: 0.04;
`;
  cssVariables += `  --${themePrefix}state-focus-opacity: 0.12;
`;
  cssVariables += `  --${themePrefix}state-pressed-opacity: 0.12;
`;
  cssVariables += `  --${themePrefix}state-dragged-opacity: 0.08;
`;


   cssVariables += `
`;
   cssVariables += `  --${themePrefix}elevation-shadow-1: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-2: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-3: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-4: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-6: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-8: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-12: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-16: 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 14px 23px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);
`;
   cssVariables += `  --${themePrefix}elevation-shadow-24: 0px 9px 12px -6px rgba(0, 0, 0, 0.2), 0px 16px 29px 2px rgba(0, 0, 0, 0.14), 0px 10px 37px 7px rgba(0, 0, 0, 0.12);
`;


   if (primaryRgb) {
       cssVariables += `
  --${themePrefix}primary-rgb: ${primaryRgb};
`;
       }


   cssVariables += `
`;
   cssVariables += `  --${themePrefix}elevation-overlay-1: 0.05;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-2: 0.07;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-3: 0.08;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-4: 0.09;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-6: 0.11;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-8: 0.12;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-12: 0.14;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-16: 0.15;
`;
   cssVariables += `  --${themePrefix}elevation-overlay-24: 0.16;
`;


  cssVariables += `}`;

  return cssVariables;
}

function generateComplementaryTheme(theme) {
    if (!theme || !theme.background) {
        console.error("Invalid theme object provided.");
        return null;
    }


    function isDarkTheme(bgColor) {

        const hexToRgb = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b];
        };

        let r, g, b;
        if (bgColor.startsWith('#')) {
            [r, g, b] = hexToRgb(bgColor);
        } else if (bgColor.startsWith('rgb')) {
             const rgbMatch = bgColor.match(/\d+/g);
             if (rgbMatch && rgbMatch.length >= 3) {
                 [r, g, b] = rgbMatch.map(Number);
             } else {
                 return false;
             }
        } else {
            return false;
        }


        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;


        return luminance < 0.3;
    }

    const isInputDark = isDarkTheme(theme.background);


    const lightThemeDefaults = {
        primary: '#6200EE',
        primaryVariant: '#3700B3',
        secondary: '#03DAC4',
        secondaryVariant: '#018786',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        error: '#B00020',
        onPrimary: '#FFFFFF',
        onSecondary: '#000000',
        onBackground: '#000000',
        onSurface: '#000000',
        onError: '#FFFFFF'
    };

    const darkThemeDefaults = {
        primary: '#BB86FC',
        primaryVariant: '#3700B3',
        secondary: '#03DAC6',
        secondaryVariant: '#03DAC6',
        background: '#121212',
        surface: '#1E1E1E',
        error: '#CF6679',
        onPrimary: '#000000',
        onSecondary: '#000000',
        onBackground: '#FFFFFF',
        onSurface: '#FFFFFF',
        onError: '#000000'
    };

    if (isInputDark) {

        return lightThemeDefaults;
    } else {

        return darkThemeDefaults;
    }
}


const lightThemeColors1 = {
  primary: '#6200EE',
  primaryVariant: '#3700B3',
  secondary: '#03DAC4',
  secondaryVariant: '#018786',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF'
};

const darkThemeColors1 = {
  primary: '#BB86FC',
  primaryVariant: '#3700B3',
  secondary: '#03DAC6',
  secondaryVariant: '#03DAC6',
  background: '#121212',
  surface: '#1E1E1E',
  error: '#CF6679',
  onPrimary: '#000000',
  onSecondary: '#000000',
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onError: '#000000'
};


const complementaryDarkTheme = generateComplementaryTheme(lightThemeColors1);
console.log("Complementary Dark Theme Object:", complementaryDarkTheme);

const complementaryLightTheme = generateComplementaryTheme(darkThemeColors1);
console.log("Complementary Light Theme Object:", complementaryLightTheme);


const lightThemeCSS1 = constructThemeCSSVariables(lightThemeColors1, 'md-theme-light-');
console.log(lightThemeCSS1);

const darkThemeCSS1 = constructThemeCSSVariables(darkThemeColors1, 'md-theme-dark-');
console.log(darkThemeCSS1);
