import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    Easing,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { theme } from '../../theme';
import { ShoppingBag } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.5);
    const textTranslateY = useSharedValue(20);
    const textOpacity = useSharedValue(0);
    const bgScale = useSharedValue(1);

    useEffect(() => {
        // Logo entrance
        logoOpacity.value = withTiming(1, { duration: 1000 });
        logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });

        // Text entrance
        textOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
        textTranslateY.value = withDelay(500, withSpring(0));

        // Finish splash after 2.5 seconds
        const timer = setTimeout(() => {
            // Exit animation
            logoOpacity.value = withTiming(0, { duration: 400 });
            textOpacity.value = withTiming(0, { duration: 400 });
            bgScale.value = withTiming(1.2, { duration: 600, easing: Easing.out(Easing.exp) });

            setTimeout(onFinish, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }],
    }));

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bgScale.value }],
    }));

    return (
        <View style={styles.outerContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <Animated.View style={[styles.container, containerStyle]}>
                <Animated.View style={[styles.logoContainer, logoStyle]}>
                    <View style={styles.iconCircle}>
                        <ShoppingBag color={theme.colors.primary} size={60} />
                    </View>
                </Animated.View>

                <Animated.View style={[styles.titleContainer, textStyle]}>
                    <Text style={styles.brandName}>Kiylo</Text>
                    <Text style={styles.tagline}>Premium E-Commerce Experience</Text>
                </Animated.View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>v1.0.0</Text>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
    },
    logoContainer: {
        marginBottom: 24,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    titleContainer: {
        alignItems: 'center',
    },
    brandName: {
        fontSize: 48,
        fontWeight: '800',
        color: theme.colors.white,
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 8,
        letterSpacing: 2,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default SplashScreen;
