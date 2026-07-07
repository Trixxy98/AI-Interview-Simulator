const Interview = require('../models/interview.model');
const Question = require('../models/question.model');
const {generateQuestions} = require('../services/ai.service');

const startInterview = async (req, res, next) => {
    try {
        const {job_position, job_level} = req.validated.body;
        const user_id = req.user._id;

        const interview = await Interview.create({
            user_id,
            job_position,
            job_level,
            status: 'pending',
            started_at: new Date(),
        });

        const rawQuestions = await generateQuestions(job_position, job_level);

        const questions = await Question.insertMany(
            rawQuestions.map((q) => ({
                interview_id: interview._id,
                content: q.content,
                category: q.category,
                difficulty: q.difficulty,
                order_num: q.order_num,
            }))
        );

        await Interview.findByIdAndUpdate(interview._id, {status: 'active'});

        res.status(201).json({
            message: 'Interview started',
            interview: {...interview.toObject(), status: 'active'},
            questions,
        });
    }catch (err) {
        next(err);
    }
};

const getInterview = async (req, res, next) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({error: 'Interview not found'});
        }

        if (String(interview.user_id) !== String(req.user._id)) {
            return res.status(403).json({error: 'Forbidden'});
        }

        const questions = await Question.find({ interview_id: interview._id }).sort({ order_num: 1 });

        res.json({interview, questions});
    }catch (err) {
        next(err);
    }
};

const getInterviewHistory = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || 1));
        const limit = 10;
        const skip = (page - 1) * limit;

        const [interviews, total] = await Promise.all([
            Interview.find({user_id: req.user._id})
            .sort({created_at: -1})
            .skip(skip)
            .limit(limit),
            Interview.countDocuments({user_id: req.user._id}),
        ]);

        res.json({
            interviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/ limit),
            },
        })
    }catch (err) {
        next(err);
    }
};

module.exports = {startInterview, getInterview, getInterviewHistory};