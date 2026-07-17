const mongoose = require('mongoose');

const cameraAnalysisSchema = new mongoose.Schema({
    interview_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true,
        unique: true,
    },
    eye_contact_pct: {type: Number, default: 0},
    head_pose_score: {type: Number, default: 0},
    blink_count: {type: Number, default: 0},
},
{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}}
);

module.exports = mongoose.model('CameraAnalysis', cameraAnalysisSchema);