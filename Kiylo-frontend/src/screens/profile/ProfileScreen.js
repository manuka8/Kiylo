import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { User, LogOut, ChevronRight, Settings, Heart, Bell } from 'lucide-react-native';
import { theme } from '../../theme';
import useAuthStore from '../../store/authStore';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuthStore();

    const menuItems = [
        { icon: Heart, title: 'My Wishlist' },
        { icon: Bell, title: 'Notifications' },
        { icon: Settings, title: 'Account Settings' },
    ];

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.guestContainer}>
                    <View style={styles.guestIcon}>
                        <User color={theme.colors.secondary} size={60} />
                    </View>
                    <Text style={styles.guestTitle}>Welcome to Kiylo</Text>
                    <Text style={styles.guestSubtitle}>Please login to view your profile and orders</Text>
                    <TouchableOpacity
                        style={styles.guestLoginBtn}
                        onPress={() => navigation.navigate('Auth')}
                    >
                        <Text style={styles.guestLoginText}>Login / Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <User color={theme.colors.primary} size={40} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user?.name || 'User'}</Text>
                        <Text style={styles.userEmail}>{user?.email}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.menuSection}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <item.icon color={theme.colors.text} size={20} />
                            <Text style={styles.menuTitle}>{item.title}</Text>
                        </View>
                        <ChevronRight color={theme.colors.textLight} size={20} />
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <LogOut color={theme.colors.error} size={20} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: 30,
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    userEmail: {
        ...theme.typography.body,
        color: theme.colors.textLight,
    },
    menuSection: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    menuTitle: {
        ...theme.typography.body,
        fontWeight: '500',
        color: theme.colors.text,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 'auto',
        marginBottom: 30,
        paddingVertical: 15,
        marginHorizontal: 20,
        backgroundColor: '#FEF2F2',
        borderRadius: theme.borderRadius.md,
    },
    logoutText: {
        ...theme.typography.button,
        color: theme.colors.error,
    },
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    guestIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    guestTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: 10,
    },
    guestSubtitle: {
        ...theme.typography.body,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: 30,
    },
    guestLoginBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: theme.borderRadius.md,
        width: '100%',
        alignItems: 'center',
    },
    guestLoginText: {
        ...theme.typography.button,
        color: theme.colors.white,
    },
});

export default ProfileScreen;
