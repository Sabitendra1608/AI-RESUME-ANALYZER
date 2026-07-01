import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    atsScore: Number,
    skills: [String],
    missingSkills: [String],

    sections: {
      education: Boolean,
      projects: Boolean,
      experience: Boolean,
      certifications: Boolean,
    },

    projectCount: Number,
    experienceCount: Number,

    breakdown: {
      skillScore: Number,
      projectScore: Number,
      educationScore: Number,
      experienceScore: Number,
      certificationScore: Number,
    },

    summary: String,
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],

    matchScore: Number,
    matchedSkills: [String],
    jdMissingSkills: [String],

    resumeText: String,
    jobDescription: String,
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;