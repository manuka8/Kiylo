import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,
    View
} from 'react-native';
import { theme } from '../theme';

const CategoryCard = ({ category, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress && onPress(category)}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: category.image_url || 'https://via.placeholder.com/60' }}
                    style={styles.image}
                />
            </View>
            <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 16,
        width: 70,
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    name: {
        fontSize: 11,
        fontWeight: '500',
        color: theme.colors.text,
        textAlign: 'center',
    },
});

export default CategoryCard;
