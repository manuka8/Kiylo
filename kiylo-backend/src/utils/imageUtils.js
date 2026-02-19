import path from 'path';

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // This assumes the uploads folder is served statically at /uploads
    return `/uploads/${path.basename(imagePath)}`;
};

export const getGalleryUrls = (images) => {
    if (!images || !Array.isArray(images)) return [];
    return images.map(img => getImageUrl(img.image_url || img));
};
