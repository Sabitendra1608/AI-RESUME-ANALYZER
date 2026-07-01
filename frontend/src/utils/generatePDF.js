import jsPDF from "jspdf";

export const generatePDF = (data) => {
const doc = new jsPDF();

let y = 20;

const checkPage = () => {
if (y > 270) {
doc.addPage();
y = 20;
}
};

// Title
doc.setFont("helvetica", "bold");
doc.setFontSize(22);
doc.text("AI Resume Analysis Report", 20, y);

y += 8;

doc.setFont("helvetica", "normal");
doc.setFontSize(10);

doc.text(
`Generated on ${new Date().toLocaleDateString()}`,
20,
y
);

y += 10;

doc.line(20, y, 190, y);

y += 15;

// ATS Score
doc.setFont("helvetica", "bold");
doc.setFontSize(18);

doc.text(
`ATS Score: ${data.atsScore || 0}/100`,
20,
y
);

y += 10;

// Progress Bar
doc.setFillColor(230, 230, 230);
doc.rect(20, y, 120, 6, "F");

doc.setFillColor(34, 197, 94);

const scoreWidth =
((data.atsScore || 0) / 100) * 120;

doc.rect(20, y, scoreWidth, 6, "F");

y += 15;

// ATS Breakdown
doc.setFontSize(15);
doc.setFont("helvetica", "bold");
doc.text("ATS Breakdown", 20, y);

y += 8;

doc.setFontSize(11);
doc.setFont("helvetica", "normal");

doc.text(
`Skills: ${data.breakdown?.skillScore || 0}/30`,
25,
y
);

y += 7;

doc.text(
`Projects: ${data.breakdown?.projectScore || 0}/20`,
25,
y
);

y += 7;

doc.text(
`Education: ${data.breakdown?.educationScore || 0}/15`,
25,
y
);

y += 7;

doc.text(
`Experience: ${data.breakdown?.experienceScore || 0}/20`,
25,
y
);

y += 7;

doc.text(
`Certifications: ${data.breakdown?.certificationScore || 0}/15`,
25,
y
);

y += 15;

/// Skills Found
doc.setFontSize(15);
doc.setFont("helvetica", "bold");
doc.text("Skills Found", 20, y);

y += 8;

doc.setFontSize(11);
doc.setFont("helvetica", "normal");

(data.skills || []).forEach((skill) => {
checkPage();

doc.text("- " + skill, 25, y);

y += 7;
});

y += 8;

// Missing Skills
doc.setFontSize(15);
doc.setFont("helvetica", "bold");
doc.text("Missing Skills", 20, y);

y += 8;

doc.setFontSize(11);
doc.setFont("helvetica", "normal");

(data.missingSkills || []).forEach((skill) => {
checkPage();

doc.text("- " + skill, 25, y);

y += 7;
});

y += 8;

// Summary
doc.setFontSize(15);
doc.setFont("helvetica", "bold");
doc.text("AI Resume Summary", 20, y);

y += 8;

doc.setFontSize(11);
doc.setFont("helvetica", "normal");

const summaryLines = doc.splitTextToSize(
data.summary || "No summary available",
170
);

summaryLines.forEach((line) => {
checkPage();

doc.text(line, 20, y);

y += 7;
});

y += 10;

// Strengths
doc.setFontSize(15);
doc.setFont("helvetica", "bold");
doc.text("Strengths", 20, y);

y += 8;

doc.setFontSize(11);
doc.setFont("helvetica", "normal");

(data.strengths || []).forEach((item) => {
  const lines = doc.splitTextToSize(
    "- " + item,
    170
  );

  lines.forEach((line) => {
    checkPage();

    doc.text(line, 25, y);

    y += 7;
  });
});

y += 10;

// Weaknesses
doc.setFontSize(15);
doc.setFont("helvetica", "bold");
doc.text("Weaknesses", 20, y);

y += 8;

doc.setFontSize(11);
doc.setFont("helvetica", "normal");

(data.weaknesses || []).forEach((item) => {
  const lines = doc.splitTextToSize(
    "- " + item,
    170
  );

  lines.forEach((line) => {
    checkPage();

    doc.text(line, 25, y);

    y += 7;
  });
});

y += 10;

// Suggestions
doc.setFontSize(15);
doc.setFont("helvetica", "bold");
doc.text("Suggestions", 20, y);

y += 8;

doc.setFontSize(11);
doc.setFont("helvetica", "normal");

(data.suggestions || []).forEach((item) => {
  const lines = doc.splitTextToSize(
    "- " + item,
    170
  );

  lines.forEach((line) => {
    checkPage();

    doc.text(line, 25, y);

    y += 7;
  });
});

doc.save("resume-analysis-report.pdf");
};