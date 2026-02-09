import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Assessment from '../models/Assessment.js';
import User from '../models/User.js';
import { analyzeProfile } from '../services/claude.js';

const router = Router();

// POST /api/assessments - create new assessment via AI
router.post(
  '/',
  auth,
  [body('jobRole').trim().notEmpty().withMessage('Job role is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const user = await User.findById(req.user._id);
      const profile = user.profile || {};

      if (!profile.skills || profile.skills.length === 0) {
        return res
          .status(400)
          .json({ message: 'Please complete your profile before running an assessment' });
      }

      const { jobRole } = req.body;

      const profileSnapshot = {
        education: profile.education,
        skills: profile.skills,
        experience: profile.experience,
        projects: profile.projects,
        certifications: profile.certifications,
      };

      const result = await analyzeProfile(profileSnapshot, jobRole);

      const assessment = await Assessment.create({
        user: user._id,
        jobRole,
        profileSnapshot,
        result,
      });

      res.status(201).json(assessment);
    } catch (error) {
      console.error('Assessment error:', error.message);
      if (error.message.includes('API') || error.message.includes('parse')) {
        return res
          .status(502)
          .json({ message: 'AI service temporarily unavailable. Please try again.' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET /api/assessments - get all assessments for current user
router.get('/', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-profileSnapshot');
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/assessments/:id - get single assessment
router.get('/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/assessments/:id/complete-item - mark a recommendation as completed
router.patch('/:id/complete-item', auth, async (req, res) => {
  try {
    const { category, item } = req.body;
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    assessment.completedItems.push({ category, item });
    await assessment.save();

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/assessments/:id/uncomplete-item - unmark a recommendation
router.patch('/:id/uncomplete-item', auth, async (req, res) => {
  try {
    const { category, item } = req.body;
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    assessment.completedItems = assessment.completedItems.filter(
      (ci) => !(ci.category === category && ci.item === item)
    );
    await assessment.save();

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/assessments/:id - delete an assessment
router.delete('/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json({ message: 'Assessment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
