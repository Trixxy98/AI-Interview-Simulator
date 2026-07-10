const Answer = require('../models/answer.model');
const Report = require('../models/report.model');
const Interview = require('../models/interview.model');
const { evaluateAnswer } = require('./ai.service');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

const generateSummary = async (scores, jobPosition, jobLevel) => {
  const prompt = `You are an interview coach. Write a 2-paragraph summary for a candidate who just completed a ${jobLevel}-level ${jobPosition} interview.

Scores:
- Technical Knowledge: ${scores.score_technical}/100
- Communication: ${scores.score_communication}/100
- Confidence: ${scores.score_confidence}/100
- Eye Contact: ${scores.score_eye_contact}/100
- Grammar: ${scores.score_grammar}/100
- Speaking Speed: ${scores.score_speed}/100
- Overall Score: ${scores.score_total}/100

Write an encouraging but honest summary. Paragraph 1: overall performance. Paragraph 2: specific areas to improve. Keep it under 100 words total.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 300,
  });

  return response.choices[0].message.content.trim();
};

const generateReport = async (interviewId) => {
  const answers = await Answer.find({ interview_id: interviewId });

  if (answers.length === 0) {
    throw new Error('No answers found for this interview');
  }

  const score_technical = Math.round(avg(answers.map((a) => a.score_technical)));
  const score_communication = Math.round(avg(answers.map((a) => a.score_comm)));
  const score_grammar = Math.round(avg(answers.map((a) => a.score_grammar)));
  const score_speed = Math.round(avg(answers.map((a) => a.speaking_wpm > 0 ? Math.min(100, (a.speaking_wpm / 150) * 100) : 0)));

  // Confidence derived from communication + technical average
  const score_confidence = Math.round((score_communication + score_technical) / 2);

  // Eye contact placeholder — will be filled from camera analysis in Phase 2
  const score_eye_contact = 70;

  const score_total = Math.round(
    score_technical * 0.35 +
    score_communication * 0.25 +
    score_confidence * 0.15 +
    score_eye_contact * 0.10 +
    score_grammar * 0.10 +
    score_speed * 0.05
  );

  const scores = {
    score_technical,
    score_communication,
    score_confidence,
    score_eye_contact,
    score_grammar,
    score_speed,
    score_total,
  };

  const interview = await Interview.findById(interviewId);
  const summary = await generateSummary(scores, interview.job_position, interview.job_level);

  const report = await Report.findOneAndUpdate(
    { interview_id: interviewId },
    { ...scores, summary },
    { upsert: true, new: true }
  );

  await Interview.findByIdAndUpdate(interviewId, {
    status: 'done',
    score_total,
    ended_at: new Date(),
  });

  return report;
};

module.exports = { generateReport };