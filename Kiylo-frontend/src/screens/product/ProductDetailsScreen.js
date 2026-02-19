import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { ArrowLeft, Star, ShoppingCart, Heart } from 'lucide-react-native';
import { theme } from '../../theme';
import { getProductDetails } from '../../api/products';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';


const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const addToCart = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (!user) {
            navigation.navigate('Auth');
            return;
        }
        addToCart(product);
    };


    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await getProductDetails(productId);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!product) return null;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.main_image || 'https://via.placeholder.com/400' }}
                        style={styles.image}
                    />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft color={theme.colors.text} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.wishlistButton}>
                        <Heart color={theme.colors.text} size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{product.name}</Text>
                        <Text style={styles.price}>${parseFloat(product.base_price).toFixed(2)}</Text>
                    </View>

                    <View style={styles.ratingRow}>
                        <Text style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} size={16} color="#FBBF24" fill="#FBBF24" />
                            ))}
                            <Text style={styles.ratingText}>(4.8)</Text>
                        </Text>
                        <Text style={styles.stockText}>
                            {(product.stock_quantity || product.total_stock) > 0 ? 'In Stock' : 'Out of Stock'}
                        </Text>
                    </View>

                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    {/* Add more details like variations if available */}
                </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                >
                    <ShoppingCart color={theme.colors.white} size={20} />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: width,
        height: 400,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: theme.colors.white,
        padding: 10,
        borderRadius: theme.borderRadius.round,
        ...theme.shadows.sm,
    },
    wishlistButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: theme.colors.white,
        padding: 10,
        borderRadius: theme.borderRadius.round,
        ...theme.shadows.sm,
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    title: {
        ...theme.typography.h2,
        flex: 1,
        color: theme.colors.text,
    },
    price: {
        ...theme.typography.h2,
        color: theme.colors.accent,
        marginLeft: 10,
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    stars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        ...theme.typography.caption,
        color: theme.colors.textLight,
        marginLeft: 5,
    },
    stockText: {
        ...theme.typography.caption,
        color: theme.colors.success,
        fontWeight: '700',
    },
    descriptionTitle: {
        ...theme.typography.h3,
        marginBottom: 10,
    },
    description: {
        ...theme.typography.body,
        color: theme.colors.textLight,
        lineHeight: 24,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.white,
    },
    addToCartButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    addToCartText: {
        ...theme.typography.button,
        color: theme.colors.white,
        marginLeft: 10,
    },
});

export default ProductDetailsScreen;
