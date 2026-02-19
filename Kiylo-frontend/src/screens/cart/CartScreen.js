import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react-native';
import { theme } from '../../theme';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';


const CartScreen = ({ navigation }) => {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const { user } = useAuthStore();

    const handleCheckout = () => {
        if (!user) {
            navigation.navigate('Auth');
            return;
        }
        console.log('Proceed to checkout');
        // navigation.navigate('Checkout');
    };


    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: item.main_image || 'https://via.placeholder.com/100' }}
                style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>${parseFloat(item.base_price).toFixed(2)}</Text>

                <View style={styles.quantityRow}>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                        <Minus size={16} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                        <Plus size={16} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeItem(item.id)}
            >
                <Trash2 size={20} color={theme.colors.error} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Cart</Text>
            </View>

            <FlatList
                data={items}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Your cart is empty</Text>
                        <TouchableOpacity
                            style={styles.shopBtn}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.shopBtnText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {items.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${getTotal()}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.checkoutBtn}
                        onPress={handleCheckout}
                    >
                        <Text style={styles.checkoutBtnText}>Checkout</Text>
                        <ArrowRight color={theme.colors.white} size={20} />
                    </TouchableOpacity>
                </View>
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
    cartItem: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: 15,
        marginBottom: 15,
        ...theme.shadows.sm,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.md,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    itemName: {
        ...theme.typography.body,
        fontWeight: '600',
        marginBottom: 5,
    },
    itemPrice: {
        ...theme.typography.body,
        color: theme.colors.accent,
        fontWeight: '700',
        marginBottom: 10,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityBtn: {
        backgroundColor: theme.colors.surface,
        padding: 5,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    quantityText: {
        marginHorizontal: 15,
        ...theme.typography.body,
        fontWeight: '600',
    },
    deleteBtn: {
        justifyContent: 'center',
        paddingLeft: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        ...theme.typography.h3,
        color: theme.colors.textLight,
        marginBottom: 20,
    },
    shopBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: theme.borderRadius.md,
    },
    shopBtnText: {
        ...theme.typography.button,
        color: theme.colors.white,
    },
    footer: {
        padding: 20,
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    totalLabel: {
        ...theme.typography.h3,
        color: theme.colors.textLight,
    },
    totalValue: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    checkoutBtn: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    checkoutBtnText: {
        ...theme.typography.button,
        color: theme.colors.white,
        marginRight: 10,
    },
});

export default CartScreen;
