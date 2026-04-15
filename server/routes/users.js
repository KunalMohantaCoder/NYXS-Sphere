const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/suggestions', auth, async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    const suggestions = await User.find({
      _id: { $ne: req.userId, $nin: me.following }
    }).limit(5).select('-password').lean();
    res.json(suggestions);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (req.params.id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const { fullName, bio, skills, interests, isFounder, buildInPublic } = req.body;
    const user = await User.findById(req.userId);
    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    if (isFounder !== undefined) user.isFounder = isFounder;
    if (buildInPublic !== undefined) user.buildInPublic = buildInPublic;
    await user.save();
    res.json({ user: user.toPublic() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/follow', auth, async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.userId) return res.status(400).json({ message: 'Cannot follow yourself' });
    const [me, target] = await Promise.all([
      User.findById(req.userId),
      User.findById(targetId)
    ]);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const followingIdx = me.following.indexOf(targetId);
    if (followingIdx > -1) {
      me.following.pull(targetId);
      target.followers.pull(req.userId);
    } else {
      me.following.push(targetId);
      target.followers.push(req.userId);
      const Notification = require('../models/Notification');
      await Notification.create({ user: targetId, type: 'follow', fromUser: req.userId });
    }
    await Promise.all([me.save(), target.save()]);
    res.json({ following: followingIdx === -1 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'username fullName avatar').lean();
    res.json(user?.followers || []);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'username fullName avatar').lean();
    res.json(user?.following || []);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;