const fs = require('fs');
const path = require('path');
const Answer = require('../models/answer.model');
const Question = require('../models/question.model');
const Interview = require('../models/interview.model');
const {transcribeAudio, evaluateAnswer} = require('../services/ai.service');

const submitAnswer = async (req, res, next) => {
    try {
        const {id: interview_id} = req.params;
        const {question_id} = req.body;

        const interview = await Interview.findById(interview_id);
        if (!interview) {
            return res.status(404).json({error: 'Interview not found'});
        }
        if (String(interview.user_id) !== String(req.user._id)) {
            return res.status(403).json({error: 'Forbidden'});
        }

        const question = await Question.findById(question_id);
        if (!question) {
            return res.status(404).json({error: 'Question not found'});
        }

        let transcript = req.body.transcript || '';

        if (req.file) {
            transcript = await transcribeAudio(req.file.path);
            fs.unlink(req.file.path, () => {});
        }

        const evaluation = await evaluateAnswer(question.content, transcript);

        const answer = await Answer.create({
            question_id,
            interview_id,
            transcript,
            score_technical: evaluation.score_technical,
            score_comm: evaluation.score_comm,
            score_grammar: evaluation.score_grammar,
            speaking_wpm: evaluation.speaking_wpm,
            ai_feedback: evaluation.ai_feedback,
        });

        res.status(201).json({message: 'Answer submitted',answer});
    }catch (err) {
        if (req.file) fs.unlink(req.file.path, () => {});
        next(err);
    }
};

const getAnswers = async (req, res, next) => {
    try {
      const { id: interview_id } = req.params;
      const interview = await Interview.findById(interview_id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found' });
      }
      if (String(interview.user_id) !== String(req.user._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const answers = await Answer.find({ interview_id }).populate('question_id', 'content category difficulty order_num');
      res.json({ answers });
    } catch (err) {
      next(err);
    }
  };
  module.exports = { submitAnswer, getAnswers };
  