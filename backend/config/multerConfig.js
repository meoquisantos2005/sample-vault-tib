const multer = require('multer');

// =========================
// CONSTANTES
// =========================
const UPLOAD_DIR = 'uploads';

const ALLOWED_AUDIO_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/flac'
];

const INVALID_AUDIO_ERROR = 'INVALID_AUDIO';

// =========================
// STORAGE CONFIG
// =========================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// =========================
// FILE FILTER (VALIDACIÓN)
// =========================
const fileFilter = (req, file, cb) => {
    const isValidType = ALLOWED_AUDIO_TYPES.includes(file.mimetype);

    if (isValidType) {
        cb(null, true);
    } else {
        cb(new Error(INVALID_AUDIO_ERROR), false);
    }
};

// =========================
// MULTER INSTANCE
// =========================
const upload = multer({
    storage,
    fileFilter
});

// =========================
// EXPORT
// =========================
module.exports = upload.single('audioFile');