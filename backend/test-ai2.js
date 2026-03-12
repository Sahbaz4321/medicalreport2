require('dotenv').config();
const { analyzeMedicalText } = require('./src/services/aiAnalysisService');

async function test() {
  console.time('analysis');
  const result = await analyzeMedicalText("CBC REPORT: HEMOGLOBIN 11 g/dL. PLEASE CORRELATE CLINICALLY.");
  console.timeEnd('analysis');
  console.log(JSON.stringify(result, null, 2));
}

test().catch(console.error);
