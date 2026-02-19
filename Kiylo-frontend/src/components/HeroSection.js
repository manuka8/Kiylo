import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const HeroSection = ({ data, onProductPress }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.slide}
            onPress={() => onProductPress && onProductPress(item)}
        >
            <ImageBackground
                source={{ uri: item.main_image || 'https://via.placeholder.com/400x200' }}
                style={styles.image}
                imageStyle={{ borderRadius: theme.borderRadius.xl }}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                >
                    <View style={styles.textContainer}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>FEATURED</Text>
                        </View>
                        <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                        <View style={styles.shopNowRow}>
                            <Text style={styles.shopNowText}>Shop Now</Text>
                            <ArrowRight size={14} color={theme.colors.white} />
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={width - 40}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    list: {
        paddingHorizontal: 20,
    },
    slide: {
        width: width - 40,
        height: 180,
        marginRight: 12,
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 16,
        borderRadius: theme.borderRadius.xl,
    },
    textContainer: {
        width: '70%',
    },
    badge: {
        backgroundColor: theme.colors.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 8,
    },
    badgeText: {
        color: theme.colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    title: {
        color: theme.colors.white,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    shopNowRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shopNowText: {
        color: theme.colors.white,
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    }
});

export default HeroSection;
