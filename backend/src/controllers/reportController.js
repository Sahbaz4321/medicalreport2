const path = require('path');
const fs = require('fs');

const { extractTextFromFile } = require('../services/ocrService');
const { analyzeMedicalText, generateChatResponse } = require('../services/aiAnalysisService');

exports.analyzeReport = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No report file uploaded.' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    const extractedText = await extractTextFromFile(filePath);

    const analysis = await analyzeMedicalText(extractedText || '');

    // Optionally clean up uploaded file after processing
    try {
      fs.unlink(filePath, () => {});
    } catch (cleanupErr) {
      console.warn('Could not remove temp file:', cleanupErr.message);
    }

    return res.json({
      fileName: originalName,
      extractedText,
      ...analysis,
    });
  } catch (err) {
    return next(err);
  }
};

exports.chatAboutReport = async (req, res, next) => {
  try {
    const { question, analysisContext } = req.body;

    if (!question || !analysisContext) {
      return res.status(400).json({ error: 'Missing question or analysisContext in request body.' });
    }

    const answer = await generateChatResponse(question, analysisContext);

    return res.json({ answer });
  } catch (err) {
    return next(err);
  }
};

