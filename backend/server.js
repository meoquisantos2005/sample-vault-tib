require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const sampleRoutes = require('./routes/sampleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const viewRoutes = require('./routes/viewRoutes');
const testsRoutes = require('./routes/testsRoutes');

const app = express();

// =========================
// CONSTANTES
// =========================
const DEFAULT_PORT = 3000;

const HTTP_BAD_REQUEST = 400;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const INVALID_AUDIO_ERROR = 'INVALID_AUDIO';
const INVALID_AUDIO_MESSAGE = 'El archivo no es un audio válido';

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Carpeta uploads ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// --- Frontend static ---
app.use(express.static(path.join(__dirname, '../frontend')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/samples', sampleRoutes);
app.use('/api/admin', adminRoutes);

// --- Views / Tests ---
if (process.env.NODE_ENV === 'testing') {
    app.use('/', testsRoutes);
} else {
    app.use('/', viewRoutes);
}

// --- ERROR HANDLER GLOBAL ---
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err && err.message === INVALID_AUDIO_ERROR) {
        return res.status(HTTP_BAD_REQUEST).json({
            message: INVALID_AUDIO_MESSAGE
        });
    }

    return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
        message: "Error en el servidor",
        error: err.message
    });
});

// --- SERVER START ---
const PORT = process.env.PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log("==================================");
    console.log("🚀 SampleVault listo en:");
    console.log(`http://localhost:${PORT}`);
    console.log("==================================");
});