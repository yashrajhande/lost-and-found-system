const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const nodemailer = require('nodemailer');

exports.getMatches = async (req, res) => {
  try {
    const matches = await FoundItem.find({ matchedWith: { $ne: null } })
                                  .populate('matchedWith')
                                  .populate('user', 'name email');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.approveReturn = async (req, res) => {
  try {
    const foundId = req.params.foundId;
    const foundItem = await FoundItem.findById(foundId).populate('matchedWith');
    const lostItem = await LostItem.findById(foundItem.matchedWith).populate('user');

    if (!foundItem || !lostItem) {
      return res.status(404).json({ message: 'Item not found or not matched' });
    }

    lostItem.status = 'returned';
    await lostItem.save();

    // ✅ EMAIL STUDENT
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: lostItem.user.email,
      subject: 'Your Lost Item Has Been Found!',
      text: `Good news! Your item "${lostItem.itemName}" has been found.\nPlease visit the admin office to collect it.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Item returned & email sent', foundItem, lostItem });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
