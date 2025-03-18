const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');

const app = express();

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 Upload & Process PDF
app.post('/upload-pdf', upload.single('pdfFile'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const data = await pdfParse(req.file.buffer);

    // Extract Questions & Answers
    const questions = extractQuestionsAndAnswers(data.text);

    const images = []; 


    res.json({
      fileName: req.file.originalname,
      totalQuestions: questions.length,
      pages: [
        {
          page: 1, // Since pdf-parse doesn't support per-page extraction
          questions: questions,
          images: images
        }
      ]
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

// 📌 Extract Questions & Answers
function extractQuestionsAndAnswers(text) {
  const qaPattern = /(\d+[-.)]?\s*([^\?]+\?))\s*([\s\S]*?)(?=\n\d+[-.)]|\Z)/g;
  const answerPattern = /([A-Fa-f][.)-])\s*(.+)/g;
  const questions = [];

  let match;
  while ((match = qaPattern.exec(text)) !== null) {
    const questionText = match[2].trim();
    const answerText = match[3].trim();
    const answers = {};

    let answerMatch;
    while ((answerMatch = answerPattern.exec(answerText)) !== null) {
      answers[answerMatch[1][0].toLowerCase()] = answerMatch[2].trim();
    }

    questions.push({ question: questionText, answers });
  }
  return questions;
}

// 📌 Extract Images (Placeholder)
async function extractImagesFromPDF(filePath) {
  const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));
  const pages = pdfDoc.getPages();
  let images = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const imageObjects = page.node.Contents?.array || [];

    for (let imgIndex = 0; imgIndex < imageObjects.length; imgIndex++) {
      const imgData = imageObjects[imgIndex];
      if (imgData && imgData.value) {
        const base64Img = Buffer.from(imgData.value).toString('base64');
        images.push({
          id: `page${i + 1}_img${imgIndex + 1}`,
          format: "jpg", // PDF images are usually JPG or PNG
          base64: base64Img
        });
      }
    }
  }
  return images;
}

module.exports = app;
