const express = require('express');
const router = express.Router();
const StoreItem = require('../models/StoreItem');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Setup Multer storage for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'store-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Admin Middleware for Protecting Admin Routes
const { protect, admin } = require('../middleware/authMiddleware');

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET /api/store : Fetch all non-hidden store items (or all if admin query param is passed)
router.get('/', async (req, res) => {
    try {
        const { adminView } = req.query;
        let query = {};
        
        // If not requesting admin view, hide the hidden items
        if (adminView !== 'true') {
            query.isHidden = false;
        }

        const items = await StoreItem.find(query).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// POST /api/store : Add a new store item
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const { name, category, originalPrice, price, discount, rating, rarity, isDealOfDay } = req.body;
        
        const newItem = new StoreItem({
            name,
            category,
            originalPrice: Number(originalPrice),
            price: Number(price),
            discount: discount ? Number(discount) : 0,
            rating: rating ? Number(rating) : 5.0,
            rarity,
            imageUrl: `/uploads/${req.file.filename}`,
            isDealOfDay: isDealOfDay === 'true'
        });

        await newItem.save();
        
        // Ensure only one deal of the day exists if this one is true
        if (newItem.isDealOfDay) {
            await StoreItem.updateMany({ _id: { $ne: newItem._id } }, { isDealOfDay: false });
        }

        // Emit real-time update
        req.io.emit('storeUpdate', { action: 'create', item: newItem });

        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/store/:id/stock : Toggle Out Of Stock
router.put('/:id/stock', protect, admin, async (req, res) => {
    try {
        const item = await StoreItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.isOutOfStock = !item.isOutOfStock;
        await item.save();

        // Emit real-time update
        req.io.emit('storeUpdate', { action: 'stock_toggle', id: item._id, isOutOfStock: item.isOutOfStock });

        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/store/:id/hide : Toggle visibility (hide/show)
router.put('/:id/hide', protect, admin, async (req, res) => {
    try {
        const item = await StoreItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.isHidden = !item.isHidden;
        await item.save();

        // Emit real-time update
        req.io.emit('storeUpdate', { action: 'visibility_toggle', id: item._id, isHidden: item.isHidden });

        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/store/:id : Delete a store item
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const item = await StoreItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        
        // Attempt to remove the file
        if (item.imageUrl) {
            const filePath = path.join(__dirname, '..', item.imageUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Emit real-time update
        req.io.emit('storeUpdate', { action: 'delete', id: req.params.id });

        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
