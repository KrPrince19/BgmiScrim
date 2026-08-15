const express = require('express');
const router = express.Router();
const {
    joinScrim, buyStoreItem, getPaymentStatus, getMyPayments,
    getAllPayments, updatePaymentStatus, getDashboardStats,
    getScrimPlayers, removePlayer, getScrimParticipants
} = require('../controllers/paymentController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Player routes
router.post('/join', upload.single('screenshot'), joinScrim);
router.post('/buy-item', upload.single('screenshot'), buyStoreItem);
router.get('/my-payments', getMyPayments);
router.get('/status/:scrimId', getPaymentStatus);

// Admin routes
router.get('/admin/stats', getDashboardStats);
router.get('/admin/all', getAllPayments);
router.patch('/admin/:id/status', updatePaymentStatus);
router.get('/admin/scrim/:scrimId/players', getScrimPlayers);
router.get('/admin/scrim/:scrimId/participants', getScrimParticipants);
router.delete('/admin/:id/remove', removePlayer);

module.exports = router;
