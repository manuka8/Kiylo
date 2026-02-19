import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Text
} from 'react-native';
import { theme } from '../theme';

const BrandCard = ({ brand, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress && onPress(brand)}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                {brand.logo_url ? (
                    <Image
                        source={{ uri: `http://localhost:5000/${brand.logo_url}` }}
                        style={styles.image}
                    />
                ) : (
                    <Text style={styles.placeholder}>{brand.name?.[0]}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 12,
        ...theme.shadows.sm,
    },
    imageContainer: {
        width: 80,
        height: 48,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    placeholder: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    }
});

export default BrandCard;
