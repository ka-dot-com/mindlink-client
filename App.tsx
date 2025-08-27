import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { I18nProvider } from './src/core/i18n/i18n';
import { ThemeProvider } from './src/core/theme/theme';

export default function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </I18nProvider>
  );
}