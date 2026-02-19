import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    TextInput,
    ActivityIndicator,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
import { Search, Bell, ShoppingCart, MapPin, ChevronRight } from 'lucide-react-native';
import { theme } from '../../theme';
import homeService from '../../api/home.service';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

// Components
import HeroSection from '../../components/HeroSection';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';
import BrandCard from '../../components/BrandCard';

const HomeScreen = ({ navigation }) => {
    const { user } = useAuthStore();
    const { items: cartItems } = useCartStore();

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async (refresh = false) => {
        if (!refresh) setIsLoading(true);
        try {
            const [featRes, catRes, brandRes, trendRes, newRes] = await Promise.all([
                homeService.getFeaturedProducts(5),
                homeService.getCategories(),
                homeService.getBrands(),
                homeService.getTrendingProducts(6),
                homeService.getNewArrivals(6)
            ]);

            setFeaturedProducts(featRes.data || []);
            setCategories(catRes.data || []);
            setBrands(brandRes.data || []);
            setTrendingProducts(trendRes.data || []);
            setNewArrivals(newRes.data || []);
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchData(true);
    }, []);

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetails', { productId: product.id });
    };

    const renderSectionHeader = (title, onPress) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {onPress && (
                <TouchableOpacity onPress={onPress} style={styles.viewAllRow}>
                    <Text style={styles.viewAll}>View All</Text>
                    <ChevronRight size={14} color={theme.colors.primary} />
                </TouchableOpacity>
            )}
        </View>
    );

    if (isLoading && !isRefreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading Kiylo Experience...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Custom Header */}
            <View style={styles.header}>
                <View style={styles.locationContainer}>
                    <MapPin size={16} color={theme.colors.primary} />
                    <Text style={styles.locationText}>Colombo, LK</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerIconBtn}>
                        <Bell size={22} color={theme.colors.text} />
                        <View style={styles.dotBadge} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerIconBtn}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <ShoppingCart size={22} color={theme.colors.text} />
                        {cartItems?.length > 0 && (
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{cartItems.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search size={20} color={theme.colors.textLight} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search brands, products..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={theme.colors.textLight}
                        />
                    </View>
                </View>

                {/* Hero / Promo Section */}
                <HeroSection data={featuredProducts} onProductPress={handleProductPress} />

                {/* Categories */}
                <View style={styles.categoriesContainer}>
                    <FlatList
                        data={categories}
                        renderItem={({ item }) => <CategoryCard category={item} onPress={() => { }} />}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalListPadding}
                    />
                </View>

                {/* Brands Section */}
                {renderSectionHeader('Official Brands', () => { })}
                <FlatList
                    data={brands}
                    renderItem={({ item }) => <BrandCard brand={item} onPress={() => { }} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalListPadding}
                />

                {/* Trending Items */}
                {renderSectionHeader('Trending Now', () => { })}
                <View style={styles.productGrid}>
                    {trendingProducts.map((item) => (
                        <ProductCard
                            key={item.id}
                            product={item}
                            onPress={handleProductPress}
                        />
                    ))}
                </View>

                {/* New Arrivals */}
                {renderSectionHeader('New Arrivals', () => { })}
                <View style={styles.productGrid}>
                    {newArrivals.map((item) => (
                        <ProductCard
                            key={item.id}
                            product={item}
                            onPress={handleProductPress}
                        />
                    ))}
                </View>

                <View style={styles.footerSpace} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: theme.colors.textLight,
        fontSize: 14,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text,
        marginLeft: 4,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconBtn: {
        marginLeft: 16,
        position: 'relative',
    },
    dotBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.error,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    countBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.primary,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    countText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        height: 48,
        borderRadius: theme.borderRadius.xl,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: theme.colors.text,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    viewAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAll: {
        fontSize: 13,
        color: theme.colors.primary,
        fontWeight: '600',
        marginRight: 2,
    },
    horizontalListPadding: {
        paddingLeft: 20,
        paddingRight: 12,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: width * 0.02,
    },
    footerSpace: {
        height: 40,
    }
});

export default HomeScreen;
