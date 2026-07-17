const CameraAnalysis = require('../models/cameraAnalysis.model');
const Interview = require('../models/interview.model');

const saveCameraAnalysis = async (req, res, next) => {
    try {
        const {interview_id, eye_contact_pct, head_pose_score, blink_count} = req.body;

        const interview = await Interview.findById(interview_id);
        if (!interview) {
            return res.status(404).json({error: 'Interview not found'});
        }
        if (String(interview.user_id) !== String(req.user._id)) {
            return res.status(403).json({error: 'Forbidden'});
        }

        const analysis = await CameraAnalysis.findOneAndUpdate(
            {interview_id},
            {eye_contact_pct, head_pose_score, blink_count},
            {upsert: true, new: true}
        );

        res.status(200).json({message: 'Camera analysis saved', analysis});
    }catch (err) {
        next(err);
    }
};

module.exports = {saveCameraAnalysis};