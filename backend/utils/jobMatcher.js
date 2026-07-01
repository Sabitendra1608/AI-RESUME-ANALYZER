export function calculateMatchScore(resumeText, jobDescription) {
  const resume = resumeText.toLowerCase();
  const jd = jobDescription.toLowerCase();

  const skills = [
    "react",
    "javascript",
    "typescript",
    "node.js",
    "express",
    "mongodb",
    "mysql",
    "sql",
    "git",
    "github",
    "docker",
    "aws",
    "html",
    "css",
    "tailwind",
    "python",
    "java",
    "c++",
  ];

  let matchedSkills = [];
  let missingSkills = [];

  skills.forEach((skill) => {
    if (jd.includes(skill)) {
      if (resume.includes(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }
  });

  const totalSkills = matchedSkills.length + missingSkills.length;

  const matchScore =
    totalSkills === 0
      ? 0
      : Math.round((matchedSkills.length / totalSkills) * 100);

  return {
    matchScore,
    matchedSkills,
    missingSkills,
  };
}