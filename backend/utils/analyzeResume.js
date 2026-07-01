import { skillsDB } from "../data/skills.js";

export function analyzeResume(text) {
  const cleanText = text.toLowerCase();

  const hasEducation =
    cleanText.includes("education") ||
    cleanText.includes("b.tech") ||
    cleanText.includes("bachelor");

  const hasProjects =
    cleanText.includes("projects") || cleanText.includes("project");

  const hasExperience =
    cleanText.includes("experience") ||
    cleanText.includes("internship") ||
    cleanText.includes("work experience");

  const hasCertifications =
    cleanText.includes("certification") || cleanText.includes("certifications");

  const projectKeywords = [
    "project",
    "projects",
    "github",
    "portfolio",
    "developed",
    "built",
    "created",
  ];

  const experienceKeywords = [
    "internship",
    "experience",
    "work experience",
    "software engineer",
    "developer",
    "intern",
  ];

  let projectCount = 0;

  projectKeywords.forEach((keyword) => {
    if (cleanText.includes(keyword)) {
      projectCount++;
    }
  });

  let experienceCount = 0;

  experienceKeywords.forEach((keyword) => {
    if (cleanText.includes(keyword)) {
      experienceCount++;
    }
  });

  let foundSkills = [];
  let missingSkills = [];

  // 1. Flatten all skills
  const allSkills = Object.values(skillsDB).flat();

  // 2. Find skills in resume
  allSkills.forEach((skill) => {
    if (cleanText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  // 3. Missing skills (basic logic)
  const targetSkills = [
    "react",
    "node.js",
    "mongodb",
    "express",
    "javascript",
    "git",
    "docker",
    "aws",
  ];

  targetSkills.forEach((skill) => {
    if (!cleanText.includes(skill)) {
      missingSkills.push(skill);
    }
  });

  // 4. ATS SCORE (better logic)
  let skillScore = Math.min(foundSkills.length * 5, 30);

  let projectScore = hasProjects ? 20 : 0;

  let educationScore = hasEducation ? 15 : 0;

  let experienceScore = hasExperience ? 20 : 0;

  let certificationScore = hasCertifications ? 15 : 0;

  const atsScore =
    skillScore +
    projectScore +
    educationScore +
    experienceScore +
    certificationScore;

  const suggestions = [];

  if (!hasProjects) {
    suggestions.push("Add projects section");
  }

  if (!hasExperience) {
    suggestions.push("Add internship or experience section");
  }

  if (!hasCertifications) {
    suggestions.push("Add certifications");
  }

  if (missingSkills.length > 0) {
    suggestions.push(
      `Consider learning: ${missingSkills.slice(0, 3).join(", ")}`,
    );
  }

  return {
    atsScore,

    breakdown: {
      skillScore,
      projectScore,
      educationScore,
      experienceScore,
      certificationScore,
    },
    skills: foundSkills,
    missingSkills,

    projectCount,
    experienceCount,

    sections: {
      education: hasEducation,
      projects: hasProjects,
      experience: hasExperience,
      certifications: hasCertifications,
    },

    suggestions,
  };
}
