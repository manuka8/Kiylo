import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import { Package, User } from 'lucide-react-native';
import { theme } from '../../theme';
import { getMyOrders } from '../../api/orders';
import useAuthStore from '../../store/authStore';

const OrderListScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await getMyOrders();
            setOrders(response.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>
            <View style={styles.orderInfo}>
                <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                <Text style={styles.orderTotal}>Total: ${item.total_amount}</Text>
            </View>
        </View>
    );

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return theme.colors.warning;
            case 'completed': return theme.colors.success;
            case 'shipped': return theme.colors.accent;
            case 'cancelled': return theme.colors.error;
            default: return theme.colors.textLight;
        }
    };

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.guestContainer}>
                    <View style={styles.guestIcon}>
                        <Package color={theme.colors.secondary} size={60} />
                    </View>
                    <Text style={styles.guestTitle}>Track your orders</Text>
                    <Text style={styles.guestSubtitle}>Please login to view your order history and status</Text>
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
                <Text style={styles.title}>My Orders</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Package size={60} color={theme.colors.border} />
                            <Text style={styles.emptyText}>No orders found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    listContent: {
        padding: 20,
    },
    orderCard: {
        backgroundColor: theme.colors.white,
        padding: 15,
        borderRadius: theme.borderRadius.lg,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orderId: {
        ...theme.typography.body,
        fontWeight: '700',
    },
    orderStatus: {
        ...theme.typography.caption,
        fontWeight: '700',
    },
    orderInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderDate: {
        ...theme.typography.caption,
        color: theme.colors.textLight,
    },
    orderTotal: {
        ...theme.typography.body,
        fontWeight: '600',
        color: theme.colors.text,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        ...theme.typography.h3,
        color: theme.colors.textLight,
        marginTop: 10,
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

export default OrderListScreen;
