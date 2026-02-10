import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    profile: {
      education: {
        degree: { type: String, default: '' },
        branch: { type: String, default: '' },
        college: { type: String, default: '' },
        graduationYear: { type: Number, default: null },
        cgpa: { type: Number, default: null },
      },
      skills: [{ type: String }],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          techStack: [String],
          link: String,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          year: Number,
        },
      ],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
