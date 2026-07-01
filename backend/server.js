import express from "express";
import cors from "cors";
import multer from "multer";
import { analyzeResume } from "./utils/analyzeResume.js";
import dotenv from "dotenv";
import { getGeminiAnalysis } from "./utils/geminiAnalysis.js";
import { calculateMatchScore } from "./utils/jobMatcher.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import Analysis from "./models/Analysis.js";
import fs from "fs";

dotenv.config();
connectDB();

// console.log("KEY LOADED:", process.env.GEMINI_API_KEY);

console.log("SERVER FILE LOADED");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

const upload = multer({
  dest: "uploads/",

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" &&
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return cb(new Error("Only PDF resume files are allowed"));
    }

    cb(null, true);
  },
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/upload", protect, upload.single("resume"), async (req, res) => {
  try {
    
    const pdfParse = (await import("pdf-parse")).default;

    const filePath = req.file.path;

    if (!filePath) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(dataBuffer);

    const jobDescription = req.body.jobDescription || "";

    console.log("JOB DESCRIPTION:");
    console.log(jobDescription);

    const matchResult = calculateMatchScore(pdfData.text, jobDescription);

    console.log(matchResult);

    const analysis = analyzeResume(pdfData.text);

    const aiAnalysis = await getGeminiAnalysis(pdfData.text);

    console.log("GEMINI RESPONSE:");
    console.log(aiAnalysis);

    const cleanResponse = aiAnalysis
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const geminiData = JSON.parse(cleanResponse);

    console.log("BREAKDOWN:", analysis.breakdown);

    const responseData = {
      success: true,

      atsScore: analysis.atsScore,
      skills: analysis.skills,
      missingSkills: analysis.missingSkills,

      sections: analysis.sections,
      suggestions: geminiData.suggestions,
      strengths: geminiData.strengths,
      weaknesses: geminiData.weaknesses,
      summary: geminiData.summary,

      projectCount: analysis.projectCount,
      experienceCount: analysis.experienceCount,

      breakdown: analysis.breakdown,

      matchScore: matchResult.matchScore,
      matchedSkills: matchResult.matchedSkills,
      jdMissingSkills: matchResult.missingSkills,

      text: pdfData.text,
    };

   await Analysis.create({
  userId: req.user._id,

  atsScore: responseData.atsScore,
  skills: responseData.skills,
  missingSkills: responseData.missingSkills,

  sections: responseData.sections,
  projectCount: responseData.projectCount,
  experienceCount: responseData.experienceCount,
  breakdown: responseData.breakdown,

  summary: responseData.summary,
  strengths: responseData.strengths,
  weaknesses: responseData.weaknesses,
  suggestions: responseData.suggestions,

  matchScore: responseData.matchScore,
  matchedSkills: responseData.matchedSkills,
  jdMissingSkills: responseData.jdMissingSkills,

  resumeText: responseData.text,
  jobDescription,
});

    return res.status(200).json(responseData);
    } catch (err) {
    console.error("FULL ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) {
          console.error("FILE CLEANUP ERROR:", unlinkError.message);
        }
      });
    }
  }
});



app.get("/analysis/history", protect, async (req, res) => {
  try {
    const analyses = await Analysis.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      analyses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analysis history",
    });
  }
});

app.get("/analysis/:id", protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("GET ANALYSIS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analysis",
    });
  }
});


app.get("/dashboard", protect, async (req, res) => {
  try {
    const analyses = await Analysis.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    const totalAnalyses = analyses.length;

    const highestATS =
      analyses.length > 0
        ? Math.max(...analyses.map((item) => item.atsScore || 0))
        : 0;

    const averageMatchScore =
      analyses.length > 0
        ? Math.round(
            analyses.reduce(
              (sum, item) => sum + (item.matchScore || 0),
              0
            ) / analyses.length
          )
        : 0;

    const latestAnalysis = analyses[0] || null;

    return res.status(200).json({
      success: true,
      totalAnalyses,
      highestATS,
      averageMatchScore,
      latestAnalysis,
      recentAnalyses: analyses.slice(0, 4),
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
});

app.delete("/analysis/:id", protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ANALYSIS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete analysis",
    });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Resume file must be smaller than 5 MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed",
    });
  }

  next();
});

app.get("/dashboard/analytics", protect, async (req, res) => {
  try {
    const analyses = await Analysis.find({
      userId: req.user._id,
    })
      .sort({ createdAt: 1 })
      .select("atsScore matchScore skills createdAt");

    const scoreTrend = analyses.map((item) => ({
      id: item._id,
      date: new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      atsScore: item.atsScore || 0,
      matchScore: item.matchScore || 0,
    }));

    const skillFrequency = {};

    analyses.forEach((item) => {
      (item.skills || []).forEach((skill) => {
        const normalizedSkill = skill.toLowerCase().trim();

        if (!normalizedSkill) return;

        skillFrequency[normalizedSkill] =
          (skillFrequency[normalizedSkill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillFrequency)
      .map(([skill, count]) => ({
        skill,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const averageATS =
      analyses.length > 0
        ? Math.round(
            analyses.reduce(
              (sum, item) => sum + (item.atsScore || 0),
              0
            ) / analyses.length
          )
        : 0;

    return res.status(200).json({
      success: true,
      totalAnalyses: analyses.length,
      averageATS,
      scoreTrend,
      topSkills,
    });
  } catch (error) {
    console.error("DASHBOARD ANALYTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
