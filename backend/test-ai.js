require('dotenv').config();
const { analyzeMedicalText } = require('./src/services/aiAnalysisService');

async function test() {
  console.time('analysis');
  const result = await analyzeMedicalText("Some text without any numeric metrics like hemoglobin or glucose.");
  console.timeEnd('analysis');
  console.log(JSON.stringify(result, null, 2));
}

test().catch(console.error);
