const supabase = require('../config/supabase');

const uploadImageToSupabase = async (file, folder = 'food-images') => {
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('food-images') // Your bucket name
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600'
            });

        if (error) {
            throw new Error(`Supabase upload error: ${error.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('food-images')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Image upload error:', error);
        throw new Error('Failed to upload image');
    }
};

module.exports = { uploadImageToSupabase };