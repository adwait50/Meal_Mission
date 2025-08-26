const multer = require('multer');
const path = require('path');
const supabase = require('../config/supabaseClient'); // your supabase client

// Use memory storage for multer (buffer) — we’ll upload this buffer to Supabase
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,  // <-- use memory storage
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

// Helper function to upload file to Supabase
upload.uploadToSupabase = async (file) => {
    const fileName = 'NGO-' + Date.now() + path.extname(file.originalname);

    // Upload to Supabase bucket "ngo-documents"
    const { error } = await supabase.storage
        .from('ngo-documents')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) throw error;

    // Get public URL
    const { publicURL } = supabase.storage
        .from('ngo-documents')
        .getPublicUrl(fileName);

    return publicURL;
};

module.exports = upload;
