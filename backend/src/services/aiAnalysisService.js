/**
 * Very lightweight rules-based "AI" analysis of medical text.
 * Optionally enhanced with a real LLM (OpenAI / Gemini) when configured.
 */

const { generateAiText, generateAiTextDetailed, getProviderInfo } = require('./llmService');

async function withTimeout(promise, ms) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('LLM request timed out'));
    }, ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

function safeJsonParse(maybeJsonText) {
  if (!maybeJsonText) return null;
  try {
    return JSON.parse(maybeJsonText);
  } catch {
    // Common LLM patterns: ```json ... ``` or leading/trailing text.
    const fenced = maybeJsonText.match(/```json\s*([\s\S]*?)\s*```/i);
    if (fenced && fenced[1]) {
      try {
        return JSON.parse(fenced[1]);
      } catch {
        // continue
      }
    }

    const start = maybeJsonText.indexOf('{');
    const end = maybeJsonText.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const slice = maybeJsonText.slice(start, end + 1);
      try {
        return JSON.parse(slice);
      } catch {
        return null;
      }
    }
    return null;
  }
}

const PARAMS = [
  {
    key: 'hemoglobin',
    label: 'Hemoglobin',
    pattern: /hemoglobin[:\s]*([\d.]+)/i,
    unit: 'g/dL',
    normalRange: { min: 12, max: 16 },
  },
  {
    key: 'cholesterol',
    label: 'Total Cholesterol',
    pattern: /cholesterol[:\s]*([\d.]+)/i,
    unit: 'mg/dL',
    normalRange: { min: 0, max: 200 },
  },
  {
    key: 'ldl',
    label: 'LDL Cholesterol',
    pattern: /ldl[:\s]*([\d.]+)/i,
    unit: 'mg/dL',
    normalRange: { min: 0, max: 130 },
  },
  {
    key: 'hdl',
    label: 'HDL Cholesterol',
    pattern: /hdl[:\s]*([\d.]+)/i,
    unit: 'mg/dL',
    normalRange: { min: 40, max: 60 },
  },
  {
    key: 'triglycerides',
    label: 'Triglycerides',
    pattern: /triglycerides?[:\s]*([\d.]+)/i,
    unit: 'mg/dL',
    normalRange: { min: 0, max: 150 },
  },
  {
    key: 'fasting_glucose',
    label: 'Fasting Glucose',
    pattern: /(fasting\s+glucose|fbs)[:\s]*([\d.]+)/i,
    unit: 'mg/dL',
    normalRange: { min: 70, max: 100 },
    valueGroupIndex: 2,
  },
];

function classifyValue(value, range) {
  if (value < range.min) return 'low';
  if (value > range.max) return 'high';
  return 'normal';
}

function statusToColor(status) {
  if (status === 'high' || status === 'critical_high' || status === 'critical_low') {
    return 'red';
  }
  if (status === 'low' || status === 'borderline_high' || status === 'borderline_low') {
    return 'yellow';
  }
  return 'green';
}

function buildExplanation(param, value, status) {
  const { label, normalRange, unit } = param;
  const rangeText = `${normalRange.min}–${normalRange.max} ${unit}`;

  if (status === 'normal') {
    return `${label}: ${value} ${unit}. This value is within the normal range (${rangeText}).`;
  }

  if (status === 'low') {
    if (param.key === 'hemoglobin') {
      return `${label}: ${value} ${unit}. This is slightly lower than normal and may suggest mild anemia. Discuss iron intake and possible causes with your doctor.`;
    }
    return `${label}: ${value} ${unit}. This is below the normal range (${rangeText}). Please discuss this with your healthcare provider.`;
  }

  if (status === 'high') {
    if (param.key === 'cholesterol' || param.key === 'ldl' || param.key === 'triglycerides') {
      return `${label}: ${value} ${unit}. This is above the normal range (${rangeText}) and may increase your risk for heart disease. A heart-healthy diet, regular exercise, and follow-up with your doctor are recommended.`;
    }
    if (param.key === 'fasting_glucose') {
      return `${label}: ${value} ${unit}. This is higher than normal and may suggest prediabetes or diabetes. Please consult your doctor for further evaluation.`;
    }
    return `${label}: ${value} ${unit}. This is above the normal range (${rangeText}). Further evaluation with your doctor is advised.`;
  }

  return `${label}: ${value} ${unit}. This value is outside the usual range; please review with your doctor.`;
}

async function analyzeMedicalText(text) {
  const metrics = [];
  const aiMeta = {
    ...getProviderInfo(),
    used: false,
    mode: null, // 'structured' | 'summary' | null
    error: null,
  };

  for (const param of PARAMS) {
    const match = text.match(param.pattern);
    if (!match) continue;
    const groupIndex = param.valueGroupIndex || 1;
    const rawValue = match[groupIndex];
    const value = parseFloat(rawValue);
    if (Number.isNaN(value)) continue;

    const status = classifyValue(value, param.normalRange);
    const color = statusToColor(status);
    const explanation = buildExplanation(param, value, status);

    metrics.push({
      key: param.key,
      label: param.label,
      value,
      unit: param.unit,
      status,
      color,
      explanation,
      normalRange: param.normalRange,
    });
  }

  // If we didn't detect any numeric lab-style metrics, ask the LLM
  // to fully interpret the free-text report and return structured JSON.
  if (!metrics.length) {
    try {
      const { text: raw, error } = await withTimeout(
        generateAiTextDetailed({
          systemInstruction:
            'You are a medical assistant that explains imaging and lab reports in simple, kind, non-alarming language. Do NOT invent facts. If something is not present, set it to null or "unknown". You must respond with STRICT JSON only, no extra text.',
          userPrompt:
            'Analyze the following medical report text and produce a JSON object with this EXACT shape:\n' +
            '{\n' +
            '  "patient": { "name": string|null, "age": string|null, "sex": string|null },\n' +
            '  "reportType": string|null, // e.g., "USG Whole Abdomen"\n' +
            '  "date": string|null,\n' +
            '  "summary": string, // 4-7 sentences, easy English\n' +
            '  "findings": string[], // key findings from the report (short bullet sentences)\n' +
            '  "conditions": string[], // mentioned conditions e.g. "fatty liver grade 1", "ureteric calculus"\n' +
            '  "precautions": string[], // do/avoid list\n' +
            '  "effects": string[], // possible symptoms/impacts (not diagnosis)\n' +
            '  "recovery": { "expectedTime": string|null, "dependsOn": string|null },\n' +
            '  "diet": string[],\n' +
            '  "advantages": string[], // positive/okay points in the report\n' +
            '  "disadvantages": string[], // risk/concern points in the report\n' +
            '  "riskScore": number, // 0-100 overall risk (higher = more serious findings)\n' +
            '  "riskLevel": string, // "Low", "Moderate", or "High"\n' +
            '  "doctorRecommendation": string, // which specialist to see and why\n' +
            '  "dietAndLifestyle": string[], // 2-6 short suggestions\n' +
            '  "indicators": [ // for graphs (0-100). Use organs/issues that appear in text.\n' +
            '    { "label": string, "score": number, "status": "normal" | "mild" | "moderate" | "severe" }\n' +
            '  ]\n' +
            '}\n\n' +
            'Here is the report text:\n"""' +
            text.slice(0, 2500) +
            '"""',
          responseMimeType: 'application/json',
        }),
        Number(process.env.AI_STRUCTURED_TIMEOUT_MS || 15000)
      );

      if (raw) {
        const parsed = safeJsonParse(raw);
        if (!parsed) {
          throw new Error('Invalid JSON from LLM');
        }
        aiMeta.used = true;
        aiMeta.mode = 'structured';
        const riskScore = Math.max(0, Math.min(100, Number(parsed.riskScore || 0)));
        const riskLevel = parsed.riskLevel || 'Low';
        const summary = parsed.summary || buildSummary(text, [], riskLevel);
        const patient = parsed.patient || { name: null, age: null, sex: null };
        const reportType = parsed.reportType || null;
        const date = parsed.date || null;
        const findings = Array.isArray(parsed.findings) ? parsed.findings : [];
        const conditions = Array.isArray(parsed.conditions) ? parsed.conditions : [];
        const precautions = Array.isArray(parsed.precautions) ? parsed.precautions : [];
        const effects = Array.isArray(parsed.effects) ? parsed.effects : [];
        const recovery =
          parsed.recovery && typeof parsed.recovery === 'object'
            ? parsed.recovery
            : { expectedTime: null, dependsOn: null };
        const diet = Array.isArray(parsed.diet) ? parsed.diet : [];
        const advantages = Array.isArray(parsed.advantages) ? parsed.advantages : [];
        const disadvantages = Array.isArray(parsed.disadvantages) ? parsed.disadvantages : [];
        const dietAndLifestyle = Array.isArray(parsed.dietAndLifestyle)
          ? parsed.dietAndLifestyle
          : buildDietAndLifestyleAdvice([]);
        const doctorRecommendation =
          parsed.doctorRecommendation || buildDoctorRecommendation([]);

        const indicators = Array.isArray(parsed.indicators) ? parsed.indicators : [];
        const safeIndicators = indicators.length
          ? indicators
          : [
              {
                label: 'Overall findings',
                score: riskScore,
                status: riskScore >= 70 ? 'severe' : riskScore >= 40 ? 'moderate' : 'mild',
              },
            ];

        const metricsFromIndicators = safeIndicators.map((ind, idx) => {
          const score = Math.max(0, Math.min(100, Number(ind.score || 0)));
          const status =
            ind.status === 'severe'
              ? 'high'
              : ind.status === 'moderate' || ind.status === 'mild'
              ? 'low'
              : 'normal';
          return {
            key: `indicator_${idx}`,
            label: ind.label || `Indicator ${idx + 1}`,
            value: score,
            unit: '/100',
            status,
            color: statusToColor(status),
            explanation: '',
            normalRange: { min: 0, max: 100 },
          };
        });

        return {
          patient,
          reportType,
          date,
          findings,
          conditions,
          precautions,
          effects,
          recovery,
          diet,
          advantages,
          disadvantages,
          metrics: metricsFromIndicators,
          riskScore,
          riskLevel,
          summary,
          dietAndLifestyle,
          doctorRecommendation,
          aiMeta,
        };
      }
      if (error) {
        aiMeta.error = error;
      }
    } catch {
      // If LLM fails, fall through to the simple rule-based handling below.
    }
  }

  const { riskScore, riskLevel } = calculateRiskScore(metrics);
  let summary = buildSummary(text, metrics, riskLevel);
  const dietAndLifestyle = buildDietAndLifestyleAdvice(metrics);
  const doctorRecommendation = buildDoctorRecommendation(metrics);

  // If an LLM provider + key is configured, ask it for a more natural summary.
  try {
    const aiSummary = await withTimeout(
      generateAiText({
        systemInstruction:
          'You are a medical assistant that explains lab test results in simple, kind, non-alarming language. Do NOT give diagnoses. Always remind users to consult their doctor.',
        userPrompt:
          'Here is the extracted medical report text and the parsed key lab values.\n\n' +
          `Raw report text:\n"""${text.slice(0, 2500)}"""\n\n` +
          `Parsed metrics (JSON):\n${JSON.stringify(metrics, null, 2)}\n\n` +
          'Write a short (3–5 sentence) summary explaining what these results mean in everyday language.',
      }),
      Number(process.env.AI_SUMMARY_TIMEOUT_MS || 5000)
    );

    if (aiSummary) {
      summary = aiSummary;
      aiMeta.used = true;
      aiMeta.mode = 'summary';
    }
  } catch {
    // ignore AI timeout/errors and keep fast rule-based summary
  }

  return {
    metrics,
    riskScore,
    riskLevel,
    summary,
    dietAndLifestyle,
    doctorRecommendation,
    aiMeta,
  };
}

function calculateRiskScore(metrics) {
  if (!metrics.length) {
    return { riskScore: 20, riskLevel: 'Low (limited data)' };
  }

  let points = 0;

  for (const m of metrics) {
    if (m.status === 'normal') continue;
    if (m.status === 'low') points += 10;
    if (m.status === 'high') points += 25;
  }

  let riskScore = Math.min(100, points);

  let riskLevel = 'Low';
  if (riskScore >= 70) {
    riskLevel = 'High';
  } else if (riskScore >= 40) {
    riskLevel = 'Moderate';
  }

  return { riskScore, riskLevel };
}

function buildSummary(text, metrics, riskLevel) {
  if (!metrics.length) {
    return 'The report does not contain clearly recognized standard lab values. Please review the full report with your doctor.';
  }

  const abnormals = metrics.filter((m) => m.status !== 'normal');

  if (!abnormals.length) {
    return 'Most of your key lab values appear to be within normal ranges. Continue your current healthy lifestyle and follow your doctor’s routine checkup schedule.';
  }

  const abnormalNames = abnormals.map((m) => m.label.toLowerCase()).join(', ');

  return `Your report shows some values outside the usual range: ${abnormalNames}. Overall, your health risk based on the available lab values is **${riskLevel}**. Please discuss these findings with your healthcare provider for personalized advice.`;
}

function buildDietAndLifestyleAdvice(metrics) {
  const advice = [];

  const hasLipidIssues = metrics.some((m) =>
    ['cholesterol', 'ldl', 'triglycerides'].includes(m.key) && m.status === 'high'
  );
  const hasLowHemoglobin = metrics.some((m) => m.key === 'hemoglobin' && m.status === 'low');
  const hasHighGlucose = metrics.some((m) => m.key === 'fasting_glucose' && m.status === 'high');

  if (hasLipidIssues) {
    advice.push(
      'Focus on a heart-healthy diet: more fruits, vegetables, whole grains, nuts, and fish. Limit fried foods, processed snacks, and high-sugar desserts.'
    );
    advice.push('Aim for at least 150 minutes of moderate exercise (like brisk walking) per week.');
  }

  if (hasLowHemoglobin) {
    advice.push(
      'Include iron-rich foods such as lean red meat, beans, lentils, spinach, and fortified cereals. Pair them with vitamin C sources (like citrus fruits) to improve absorption.'
    );
  }

  if (hasHighGlucose) {
    advice.push(
      'Reduce sugary drinks and refined carbohydrates (white bread, sweets). Choose whole grains, lean proteins, and high-fiber foods to help keep blood sugar stable.'
    );
    advice.push('Try to maintain a regular meal schedule and include daily physical activity.');
  }

  if (!advice.length) {
    advice.push(
      'Maintain a balanced diet rich in vegetables, fruits, whole grains, and lean proteins, while limiting added sugars and highly processed foods.'
    );
    advice.push('Stay physically active most days of the week and keep up with regular health checkups.');
  }

  return advice;
}

function buildDoctorRecommendation(metrics) {
  const hasLipidIssues = metrics.some((m) =>
    ['cholesterol', 'ldl', 'triglycerides'].includes(m.key) && m.status === 'high'
  );
  const hasHighGlucose = metrics.some((m) => m.key === 'fasting_glucose' && m.status === 'high');
  const hasLowHemoglobin = metrics.some((m) => m.key === 'hemoglobin' && m.status === 'low');

  if (hasLipidIssues) {
    return 'Consult a cardiologist or an internal medicine specialist to discuss your cholesterol and heart disease risk.';
  }

  if (hasHighGlucose) {
    return 'Consult an endocrinologist or diabetologist to evaluate your blood sugar control.';
  }

  if (hasLowHemoglobin) {
    return 'Consult an internal medicine specialist or hematologist to evaluate possible causes of anemia.';
  }

  return 'A general practitioner or internal medicine doctor can review this report and guide you on next steps.';
}

async function generateChatResponse(question, analysisContext) {
  const q = question.toLowerCase();
  const {
    metrics = [],
    riskScore,
    riskLevel,
    summary,
    patient,
    reportType,
    date,
    findings,
    conditions,
    precautions,
    effects,
    recovery,
    diet,
    advantages,
    disadvantages,
  } = analysisContext;

  // Try LLM first if configured
  const aiAnswer = await generateAiText({
    systemInstruction:
      'You are a medical assistant that explains lab tests in simple, kind language. Do NOT give definitive diagnoses or treatment plans. Always recommend discussing results with a doctor.',
    userPrompt:
      `Patient question: "${question}"\n\n` +
      'Context (lab metrics JSON):\n' +
      `${JSON.stringify(
        {
          patient,
          reportType,
          date,
          summary,
          findings,
          conditions,
          precautions,
          effects,
          recovery,
          diet,
          advantages,
          disadvantages,
          metrics,
          riskScore,
          riskLevel,
        },
        null,
        2
      )}\n\n` +
      'Answer the question in 2–4 short paragraphs, easy to understand, without being alarming.',
  });

  if (aiAnswer) {
    return aiAnswer;
  }

  if (q.includes('cholesterol')) {
    const chol = metrics.find((m) => m.key === 'cholesterol' || m.key === 'ldl');
    if (chol) {
      if (chol.status === 'high') {
        return `Your ${chol.label.toLowerCase()} is ${chol.value} ${chol.unit}, which is higher than the usual target range. This increases your long-term risk for heart disease, but with lifestyle changes and medical guidance it can often be improved.`;
      }
      if (chol.status === 'normal') {
        return `Your ${chol.label.toLowerCase()} is ${chol.value} ${chol.unit}, which is within the normal range. At this time, it does not look dangerous, but it is still important to maintain a heart-healthy lifestyle.`;
      }
    }
  }

  if (q.includes('diabetes') || q.includes('sugar') || q.includes('glucose')) {
    const glu = metrics.find((m) => m.key === 'fasting_glucose');
    if (glu) {
      if (glu.status === 'high') {
        return `Your fasting glucose is ${glu.value} ${glu.unit}, which is above the usual normal range. This may indicate prediabetes or diabetes and should be followed up with your doctor.`;
      }
      if (glu.status === 'normal') {
        return `Your fasting glucose is ${glu.value} ${glu.unit}, within the normal range. Based on this value alone, diabetes is less likely, but your doctor will consider your full history.`;
      }
    }
  }

  if (q.includes('hemoglobin') || q.includes('anemia')) {
    const hb = metrics.find((m) => m.key === 'hemoglobin');
    if (hb) {
      if (hb.status === 'low') {
        return `Your hemoglobin is ${hb.value} ${hb.unit}, which is lower than normal and may indicate anemia. This can cause fatigue and weakness and should be discussed with your doctor.`;
      }
      if (hb.status === 'normal') {
        return `Your hemoglobin is ${hb.value} ${hb.unit}, within the normal range. Based on this, anemia is less likely.`;
      }
    }
  }

  if (q.includes('risk') || q.includes('overall') || q.includes('summary')) {
    if (riskScore != null && riskLevel) {
      return `Your estimated health risk score from the analyzed lab values is ${riskScore} out of 100, which falls into the **${riskLevel}** category. ${summary}`;
    }
  }

  return (
    'Based on the analyzed values, your report shows: ' +
    summary +
    ' For a precise and personalized interpretation, please discuss these results with your healthcare provider.'
  );
}

module.exports = {
  analyzeMedicalText,
  generateChatResponse,
};

