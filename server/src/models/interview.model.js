const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    job_position: {
        type: String,
        required: true,
        trim: true,
    },
    job_level: {
        type: String,
        enum: ['junior', 'mid', 'senior'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'done'],
        required: true,
    },
    duration_sec: {
        type: Number,
        default: 0,
    },
    score_total: {
        type: Number,
        default: 0,
    },
    started_at: {
        type: Date,
    },
    ended_at: {
        type: Date,
    },
  }, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}}
);

module.exports = mongoose.model('Interview', interviewSchema);