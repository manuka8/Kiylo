import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { theme } from '../../theme';
import useAuthStore from '../../store/authStore';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) return;
        await login(email, password);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login to Kiylo</Text>
                <Text style={styles.subtitle}>Welcome back to your account</Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.inputWrapper}>
                    <Mail color={theme.colors.secondary} size={20} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Lock color={theme.colors.secondary} size={20} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={theme.colors.white} />
                    ) : (
                        <>
                            <Text style={styles.buttonText}>Sign In</Text>
                            <ArrowRight color={theme.colors.white} size={20} />
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.linkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    formContainer: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        marginBottom: 5,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textLight,
        marginBottom: 40,
    },
    errorText: {
        color: theme.colors.error,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: theme.borderRadius.md,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        ...theme.typography.body,
        color: theme.colors.text,
    },
    loginButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        ...theme.shadows.sm,
    },
    buttonText: {
        ...theme.typography.button,
        color: theme.colors.white,
        marginRight: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        ...theme.typography.body,
        color: theme.colors.textLight,
    },
    linkText: {
        ...theme.typography.body,
        color: theme.colors.accent,
        fontWeight: '600',
    },
});

export default LoginScreen;
