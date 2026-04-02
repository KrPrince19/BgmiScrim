const express = require('express');
const router = express.Router();
const {
    joinScrim, getPaymentStatus, getMyPayments,
    getAllPayments, updatePaymentStatus, getDashboardStats,
    getScrimPlayers, removePlayer, getScrimParticipants
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');
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
router.post('/join', protect, upload.single('screenshot'), joinScrim);
router.get('/my-payments', protect, getMyPayments);
router.get('/status/:scrimId', protect, getPaymentStatus);

// Admin routes
router.get('/admin/stats', protect, admin, getDashboardStats);
router.get('/admin/all', protect, admin, getAllPayments);
router.patch('/admin/:id/status', protect, admin, updatePaymentStatus);
router.get('/admin/scrim/:scrimId/players', protect, admin, getScrimPlayers);
router.get('/admin/scrim/:scrimId/participants', protect, admin, getScrimParticipants);
router.delete('/admin/:id/remove', protect, admin, removePlayer);

module.exports = router;
