const express = require('express');
const router = express.Router();
const { startInterview, getInterview, getInterviewHistory } = require('../controllers/interview.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { startInterviewSchema } = require('../utils/interview.schemas');

router.use(verifyToken);

router.post('/', validate(startInterviewSchema), startInterview);
router.get('/', getInterviewHistory);
router.get('/:id', getInterview);

module.exports = router;