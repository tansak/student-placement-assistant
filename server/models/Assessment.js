import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobRole: {
      type: String,
      required: [true, 'Target job role is required'],
    },
    profileSnapshot: {
      education: Object,
      skills: [String],
      experience: Array,
      projects: Array,
      certifications: Array,
    },
    result: {
      summary: String,
      skillGaps: [
        {
          skill: String,
          priority: { type: String, enum: ['high', 'medium', 'low'] },
          description: String,
        },
      ],
      recommendedCertifications: [
        {
          name: String,
          reason: String,
        },
      ],
      projectSuggestions: [
        {
          name: String,
          description: String,
          skills: [String],
        },
      ],
      resumeTips: [String],
      interviewTips: [String],
    },
    completedItems: [
      {
        category: String,
        item: String,
        completedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Assessment', assessmentSchema);
