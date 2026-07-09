const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { startInterview, getInterview, getInterviewHistory } = require('../controllers/interview.controller');
const { submitAnswer, getAnswers } = require('../controllers/answer.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { startInterviewSchema } = require('../utils/interview.schemas');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/tmp'),
  filename: (req, file, cb) => cb(null, `audio-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['audio/webm', 'audio/mp4', 'audio/wav', 'audio/mpeg', 'audio/ogg'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid audio format'));
  },
});

router.use(verifyToken);

router.post('/', validate(startInterviewSchema), startInterview);
router.get('/', getInterviewHistory);
router.get('/:id', getInterview);
router.post('/:id/answer', upload.single('audio'), submitAnswer);
router.get('/:id/answers', getAnswers);

module.exports = router;