const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Always load backend/.env regardless of where node is started from
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Safe startup diagnostics (do NOT log secrets)
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);
const provider = (process.env.AI_PROVIDER || '').toLowerCase() || (hasGeminiKey ? 'gemini' : hasOpenAiKey ? 'openai' : 'none');
console.log(`[AI] provider=${provider} geminiKey=${hasGeminiKey} openaiKey=${hasOpenAiKey}`);

const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static folder for any temporary uploads if needed
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Medical Report Analyzer backend is running.' });
});

app.use('/api/reports', reportRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});

