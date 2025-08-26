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
// Helper function to upload NGO proof file to Supabase
upload.uploadNgoProofToSupabase = async (file) => {
    // put files inside "ngo-docs" folder
    const fileName = `ngo-docs/NGO-${Date.now()}${path.extname(file.originalname)}`;

    // Upload to the SAME bucket where donor proofs are stored
    const { error } = await supabase.storage
        .from('meal-mission-bucket')   // <-- replace with your actual bucket name
        .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) throw error;

    // Get public URL
    const { data } = supabase.storage
        .from('meal-mission-bucket')
        .getPublicUrl(fileName);

    return data.publicUrl; // corrected to use "data.publicUrl"
};


module.exports = upload;
