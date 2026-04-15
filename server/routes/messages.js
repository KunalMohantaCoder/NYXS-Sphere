const router = require('express').Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

router.get('/conversations', auth, async (req, res) => {
  try {
    const convos = await Message.aggregate([
      { $match: { $or: [{ sender: req.userId }, { receiver: req.userId }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$receiver', lastMsg: { $first: '$$ROOT' } } },
      { $unionWith: {
        collection: 'messages',
        pipeline: [
          { $match: { $or: [{ sender: req.userId }, { receiver: req.userId }] } },
          { $sort: { createdAt: -1 } },
          { $group: { _id: '$sender', lastMsg: { $first: '$$ROOT' } } },
        ]
      }},
      { $group: { _id: { $cond: [{ $lt: ['$_id', req.userId] }, [$_id, req.userId], [req.userId, '$_id']] }, lastMsg: { $first: '$lastMsg' } } },
      { $sort: { 'lastMsg.createdAt': -1 } },
    ]);
    const partnerIds = convos.map(c => {
      const pid = c.lastMsg.sender.toString() === req.userId ? c.lastMsg.receiver : c.lastMsg.sender;
      return pid;
    });
    const User = require('../models/User');
    const partners = await User.find({ _id: { $in: partnerIds } }).select('username fullName avatar').lean();
    const unreadCounts = await Message.aggregate([
      { $match: { receiver: req.userId, read: false } },
      { $group: { _id: '$sender', count: { $sum: 1 } } },
    ]);
    const unreadMap = {};
    unreadCounts.forEach(u => { unreadMap[u._id.toString()] = u.count; });
    const result = partners.map(p => ({
      ...p,
      unread: unreadMap[p._id.toString()] || 0,
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { receiver, content } = req.body;
    if (!receiver || !content) return res.status(400).json({ message: 'Receiver and content required' });
    const msg = await Message.create({ sender: req.userId, receiver, content });
    await Notification.create({ user: receiver, type: 'message', fromUser: req.userId });
    const populated = await msg.populate('sender receiver', 'username fullName avatar');
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:userId', auth, async (req, res) => {
  try {
    const msgs = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId },
      ]
    }).sort({ createdAt: 1 }).lean();
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.userId, read: false },
      { $set: { read: true } }
    );
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;