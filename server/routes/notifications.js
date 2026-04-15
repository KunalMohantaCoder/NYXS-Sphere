const router = require('express').Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.userId, read: false });
    res.json({ count });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.userId, read: false }, { $set: { read: true } });
    res.json({ message: 'All marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', auth, async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.userId })
      .populate('fromUser', 'username fullName avatar')
      .populate('post', 'title content')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(notifs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;