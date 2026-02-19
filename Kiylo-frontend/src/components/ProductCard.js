import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Heart, ShoppingCart, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

const ProductCard = ({ product, onPress, onWishlistPress, onAddToCartPress }) => {
    const isOutOfStock = product.total_stock <= 0;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress && onPress(product)}
            activeOpacity={0.8}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.main_image || 'https://via.placeholder.com/150' }}
                    style={styles.image}
                />

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <View style={styles.stockOverlay}>
                        <Text style={styles.stockText}>OUT OF STOCK</Text>
                    </View>
                )}

                {/* Wishlist Button */}
                <TouchableOpacity
                    style={styles.wishlistBtn}
                    onPress={() => onWishlistPress && onWishlistPress(product)}
                >
                    <Heart
                        size={18}
                        color={product.is_wishlisted ? theme.colors.error : theme.colors.textLight}
                        fill={product.is_wishlisted ? theme.colors.error : 'transparent'}
                    />
                </TouchableOpacity>

                {/* Badge if Featured */}
                {product.is_featured && (
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.primaryLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.badge}
                    >
                        <Text style={styles.badgeText}>PROMO</Text>
                    </LinearGradient>
                )}
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <Text style={styles.brandName} numberOfLines={1}>{product.brand_name || 'Kiylo Selection'}</Text>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>

                <View style={styles.ratingInfo}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{product.rating || '4.5'}</Text>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>${parseFloat(product.base_price).toFixed(2)}</Text>
                    <TouchableOpacity
                        style={[styles.addBtn, isOutOfStock && styles.disabledAddBtn]}
                        onPress={() => !isOutOfStock && onAddToCartPress && onAddToCartPress(product)}
                        disabled={isOutOfStock}
                    >
                        <ShoppingCart size={16} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        marginBottom: 16,
        marginHorizontal: width * 0.02,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        ...theme.shadows.sm,
    },
    imageContainer: {
        height: CARD_WIDTH * 1.1,
        width: '100%',
        backgroundColor: '#F9FAFB',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    stockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stockText: {
        backgroundColor: theme.colors.error,
        color: theme.colors.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 10,
        fontWeight: 'bold',
        borderRadius: 4,
    },
    wishlistBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: theme.colors.white,
        padding: 6,
        borderRadius: 20,
        ...theme.shadows.sm,
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: theme.colors.white,
        fontSize: 9,
        fontWeight: 'bold',
    },
    content: {
        padding: 10,
    },
    brandName: {
        fontSize: 10,
        color: theme.colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        height: 40,
        marginBottom: 4,
    },
    ratingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 11,
        color: theme.colors.textLight,
        marginLeft: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    addBtn: {
        backgroundColor: theme.colors.primary,
        padding: 8,
        borderRadius: 8,
    },
    disabledAddBtn: {
        backgroundColor: theme.colors.textLight,
        opacity: 0.5,
    }
});

export default ProductCard;
