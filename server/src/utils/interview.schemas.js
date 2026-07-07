const {z} = require('zod');

const startInterviewSchema = z.object({
    body: z.object({
        job_position: z.string().min(2, 'Job position is required').trim(),
        job_level: z.enum(['junior', 'mid', 'senior'], {
            errorMap: () => ({message: 'Level must be junior, mid or senior'}),
        })
    })
})

module.exports = {startInterviewSchema};