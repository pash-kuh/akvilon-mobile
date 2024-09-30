import 'react-native-worklets-core/src'; // for frame processor with react-native-vision-camera@^3.0.0
import 'react-native-reanimated';

import { AppRegistry, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import App from './src/App';
import { name as appName } from './app.json';
import { FirebaseNotification } from './src/helpers/firebase';
import { store } from './src/store/';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import theme from './src/helpers/theme';
import AppMetrica from '@appmetrica/react-native-analytics';

const notification = new FirebaseNotification();
notification.requestUserPermission();

AppMetrica.activate({
    apiKey: 'e340487a-04fd-43c8-9f0e-6c3aa8621ec4',
    sessionTimeout: 120,
    firstActivationAsUpdate: false,
});

const component = () => (
    <Provider store={store}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <PaperProvider theme={theme}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <App />
                </NavigationContainer>
            </SafeAreaProvider>
        </PaperProvider>
    </Provider>
);

AppRegistry.registerComponent(appName, () => component);
