const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    interview_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true,
    },
    transcript: {
        type: String,
        default: '',
    },
    audio_url: {
        type: String,
        default: '',
    },
    score_technical: {
        type: Number,
        default: 0,
    },
    score_comm: {
        type: Number,
        default: 0,
    },
    score_grammar: {
        type: Number,
        default: 0,
    },
    speaking_wpm: {
        type: Number,
        default: 0,
    },
    ai_feedback: {
        type: String,
        default: '',
    },
},
{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}}
);

module.exports = mongoose.model('Answer', answerSchema);