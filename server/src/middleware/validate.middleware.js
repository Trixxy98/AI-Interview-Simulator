const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });

    if(!result.success) {
        const errors = result.error.issues.map((e) => ({
            field: e.path.slice(1).join('.'),
            message: e.message,
        }));
        return res.status(400).json({error: 'Validation failed', errors})
    }

    req.validated = result.data;
    next();
};

module.exports = validate;