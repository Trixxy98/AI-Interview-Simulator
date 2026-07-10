const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    interview_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true,
        unique: true,
    },
    score_technical: {type: Number, default: 0},
    score_communication: {type: Number, default: 0},
    score_confidence: {type: Number, default: 0},
    score_eye_contact: {type: Number, default: 0},
    score_grammar: {type: Number, default: 0},
    score_speed: {type: Number, default: 0},
    score_total: {type: Number, default: 0},
    summary: {type: String, default: ''},
    pdf_url: {type: String, default: ''},
},
{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}}
);

module.exports = mongoose.model('Report', reportSchema);