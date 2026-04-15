const router = require('express').Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const { filter, tag, search, page = 1, limit = 20 } = req.query;
    let query = {};
    if (filter === 'following') {
      const me = await User.findById(req.userId);
      query.author = { $in: [...me.following, req.userId] };
    }
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('author', 'username fullName avatar isFounder buildInPublic')
      .lean();
    const total = await Post.countDocuments(query);
    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullName avatar isFounder buildInPublic')
      .lean();
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, image, tags, type } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    if (type === 'blog' && !title) return res.status(400).json({ message: 'Blog posts require a title' });
    const post = await Post.create({ author: req.userId, title, content, image, tags: tags || [], type: type || 'quick' });
    const populated = await post.populate('author', 'username fullName avatar isFounder buildInPublic');
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const idx = post.likes.indexOf(req.userId);
    if (idx > -1) post.likes.pull(req.userId);
    else {
      post.likes.push(req.userId);
      if (post.author.toString() !== req.userId) {
        await Notification.create({ user: post.author, type: 'like', fromUser: req.userId, post: post._id });
      }
    }
    await post.save();
    res.json({ liked: idx === -1, likesCount: post.likes.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/save', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const idx = post.saves.indexOf(req.userId);
    if (idx > -1) post.saves.pull(req.userId);
    else {
      post.saves.push(req.userId);
      if (post.author.toString() !== req.userId) {
        await Notification.create({ user: post.author, type: 'save', fromUser: req.userId, post: post._id });
      }
    }
    await post.save();
    res.json({ saved: idx === -1, savesCount: post.saves.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username fullName avatar')
      .sort({ createdAt: 1 })
      .lean();
    res.json(comments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content, parent } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content required' });
    const comment = await Comment.create({ post: req.params.id, author: req.userId, content, parent: parent || null });
    const populated = await comment.populate('author', 'username fullName avatar');
    const post = await Post.findById(req.params.id);
    if (post && post.author.toString() !== req.userId) {
      await Notification.create({ user: post.author, type: 'comment', fromUser: req.userId, post: post._id });
    }
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;