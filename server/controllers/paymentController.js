const Payment = require('../models/Payment');
const Scrim = require('../models/Scrim');
const User = require('../models/User');

// Join a scrim
exports.joinScrim = async (req, res) => {
  try {
    const { transactionID, clanName, scrimId, player1, player2, player3, player4 } = req.body;

    if (!transactionID || transactionID.length !== 12) {
      return res.status(400).json({ message: 'Transaction ID (UTR) must be exactly 12 characters.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required.' });
    }

    const scrim = await Scrim.findById(scrimId);
    if (!scrim) return res.status(404).json({ message: 'Scrim not found' });

    if (scrim.slotsFilled >= scrim.totalSlots) {
      return res.status(400).json({ message: 'Match is full! No more slots available.' });
    }

    const alreadyJoined = await Payment.findOne({ user: req.user._id, scrim: scrimId });
    if (alreadyJoined) {
      return res.status(400).json({ message: 'You have already requested to join this scrim' });
    }

    const payment = await Payment.create({
      user: req.user._id,
      scrim: scrimId,
      transactionID,
      screenshot: `/uploads/${req.file.filename}`, // Store relative path
      clanName,
      player1,
      player2,
      player3,
      player4
    });

    // Emit Real-time Update for Admin
    if (req.io) {
      req.io.emit('newPayment', {
        message: `New join request from ${req.user.username}`,
        scrimName: scrim.matchName
      });
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ user: req.user._id, scrim: req.params.scrimId })
      .populate('scrim', 'matchName time entryFee roomID roomPassword');

    if (payment) {
      // Security: Only send room details if the payment is approved
      if (payment.scrim && payment.status !== 'approved') {
        payment.scrim.roomID = undefined;
        payment.scrim.roomPassword = undefined;
      }
      res.json(payment);
    } else {
      res.status(404).json({ message: 'Payment record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all user join requests
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate('scrim', 'matchName time');
    res.json(payments);
  } catch (error) {
    const fs = require('fs');
    fs.appendFileSync('error.log', `[${new Date().toISOString()}] getMyPayments in payment controller: ${error.stack}\n`);
    res.status(500).json({ message: error.message });
  }
};

// [ADMIN] Get all payments with optional status filter
exports.getAllPayments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const payments = await Payment.find(filter)
      .populate('user', 'username email phone')
      .populate('scrim', 'matchName time entryFee')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [ADMIN] Approve or Reject payment
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use approved or rejected.' });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status, approvalDate: status === 'approved' ? new Date() : undefined },
      { new: true }
    ).populate('user', 'username email').populate('scrim', 'matchName');

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    if (status === 'approved' && payment.scrim) {
      const updatedScrim = await Scrim.findByIdAndUpdate(
        payment.scrim._id,
        { $inc: { slotsFilled: 1 } },
        { new: true }
      );

      // Emit Real-time Update for everyone (Slots)
      if (req.io && updatedScrim) {
        req.io.emit('scrimUpdate', updatedScrim);
      }
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [ADMIN] Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalScrims, totalPayments, pendingPayments, approvedPayments, totalUsers] = await Promise.all([
      Scrim.countDocuments(),
      Payment.countDocuments(),
      Payment.countDocuments({ status: 'pending' }),
      Payment.countDocuments({ status: 'approved' }),
      User.countDocuments({ role: 'user' }), // Only count non-admins
    ]);
    res.json({ totalScrims, totalPayments, pendingPayments, approvedPayments, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [ADMIN] Get all players (approved payments) for a specific scrim
exports.getScrimPlayers = async (req, res) => {
  try {
    const payments = await Payment.find({ scrim: req.params.scrimId, status: 'approved' })
      .populate('user', 'username email phone')
      .sort({ approvalDate: 1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [ADMIN] Remove a player from a scrim (delete payment + decrement slotsFilled)
exports.getScrimParticipants = async (req, res) => {
  try {
    const payments = await Payment.find({ scrim: req.params.scrimId, status: 'approved' });
    // Use player1 as the representative "Team Name" or squad leader
    const teams = payments.map(p => p.clanName || p.player1);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removePlayer = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('scrim');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Decrement slot count if was approved
    if (payment.status === 'approved' && payment.scrim) {
      const updatedScrim = await Scrim.findByIdAndUpdate(
        payment.scrim._id,
        { $inc: { slotsFilled: -1 } },
        { new: true }
      );

      // Emit Real-time Update for everyone (Slots)
      if (req.io && updatedScrim) {
        req.io.emit('scrimUpdate', updatedScrim);
      }
    }

    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
