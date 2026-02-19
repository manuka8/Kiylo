import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react-native';
import { theme } from '../../theme';
import useAuthStore from '../../store/authStore';
import { register as apiRegister } from '../../api/auth';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError('Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await apiRegister({ name, email, password });
            navigation.navigate('Login');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft color={theme.colors.text} size={24} />
                </TouchableOpacity>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join Kiylo for a premium shopping experience</Text>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.inputWrapper}>
                        <User color={theme.colors.secondary} size={20} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

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

                    <View style={styles.inputWrapper}>
                        <Lock color={theme.colors.secondary} size={20} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={theme.colors.white} />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    backButton: {
        padding: 20,
        marginTop: Platform.OS === 'ios' ? 40 : 20,
    },
    formContainer: {
        padding: 30,
        paddingTop: 10,
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
    registerButton: {
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
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 40,
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

export default RegisterScreen;
