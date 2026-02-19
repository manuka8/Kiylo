import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';
import useAuthStore from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '../screens/main/SplashScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { user, isLoading, checkAuth } = useAuthStore();
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading || isSplashVisible) {
        return (
            <SplashScreen onFinish={() => setIsSplashVisible(false)} />
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainApp" component={AppNavigator} />
                <Stack.Screen name="Auth" component={AuthNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
