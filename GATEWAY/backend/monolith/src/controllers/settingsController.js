const Setting = require('../models/Setting');

exports.getSettings = async (req, res, next) => {
    try {
        const settings = await Setting.find({});
        const result = {};

        settings.forEach(item => {
            result[item.key] = item.value;
        });

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        const body = req.body || {};

        for (let key of Object.keys(body)) {
            await Setting.findOneAndUpdate(
                { key },
                { value: body[key] },
                { upsert: true, new: true }
            );
        }

        const updated = await Setting.find({});
        const result = {};
        updated.forEach(item => {
            result[item.key] = item.value;
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};
// Get service by ID
exports.getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findOne({
            _id: req.params.id,
            userId: req.user.id   // ensure isolation
        });

        if (!service) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, 'Service not found');
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};
