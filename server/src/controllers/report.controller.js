const Report = require('../models/report.model');
const Interview = require('../models/interview.model');
const { generateReport } = require('../services/report.service');

const createReport = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    if (String(interview.user_id) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const report = await generateReport(req.params.id);
    res.status(201).json({ message: 'Report generated', report });
  } catch (err) {
    next(err);
  }
};

const getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate('interview_id');
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    if (String(report.interview_id.user_id) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ report });
  } catch (err) {
    next(err);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const interviews = await Interview.find({
      user_id: req.user._id,
      status: 'done',
    }).sort({ ended_at: -1 }).limit(10);

    const interviewIds = interviews.map((i) => i._id);

    const reports = await Report.find({ interview_id: { $in: interviewIds } });

    const analytics = interviews.map((interview) => {
      const report = reports.find((r) => String(r.interview_id) === String(interview._id));
      return {
        interview_id: interview._id,
        job_position: interview.job_position,
        job_level: interview.job_level,
        ended_at: interview.ended_at,
        score_total: report?.score_total || 0,
        score_technical: report?.score_technical || 0,
        score_communication: report?.score_communication || 0,
      };
    });

    res.json({ analytics });
  } catch (err) {
    next(err);
  }
};

module.exports = { createReport, getReport, getAnalytics };