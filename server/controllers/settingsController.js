const Settings = require('../models/Settings');

// @desc    Get a setting by key
// @route   GET /api/settings/:key
// @access  Public
const getSetting = async (req, res) => {
    try {
        const setting = await Settings.findOne({ key: req.params.key });
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update or create a setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
const updateSetting = async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    try {
        let setting = await Settings.findOne({ key });

        if (setting) {
            setting.value = value;
            await setting.save();
        } else {
            setting = await Settings.create({ key, value });
        }

        // Emit real-time update
        if (req.io) {
            req.io.emit('settingUpdate', { key, value });
        }

        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSetting,
    updateSetting
};
