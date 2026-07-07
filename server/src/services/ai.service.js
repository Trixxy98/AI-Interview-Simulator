const Groq = require('groq-sdk');

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

const generateQuestions = async (jobPosition, jobLevel) => {
    const prompt = `You are an expert technical interviewer. Generate exactly 6 interview questions for a ${jobLevel}-level ${jobPosition} candidate.
    Return ONLY a valid JSON array with this exact structure, no extra text:
    [
    {
    "content": "question text here",
    "category": "technical",
    "difficulty": "medium",
    "order_num": 1
    }
    ]
    
    Rules:
    - category must be one of: technical, behavioural, situational
    - difficulty must be one of: easy, medium, hard
    - For ${jobLevel} level: junior = mostly easy/medium, mid = mostly medium, senior = mostly medium/hard
    - Mix of: 3 technical, 2 behavioural, 1 situational
    - order_num must be 1 to 6
    - Questions must be specific to ${jobPosition} role`;
    
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2048,
  });
  const raw = response.choices[0].message.content.trim();
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('AI returned invalid question format');
  }
  const questions = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('AI returned empty questions array');
  }
  return questions;
};
module.exports = { generateQuestions };
