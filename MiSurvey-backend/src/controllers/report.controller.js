const reportService = require('../services/report.service');

const getDashboardDataController = async (req, res) => {
    const result = await reportService.getDashboardData();
    if (!result.status) {
        return res.status(500).json({ message: result.message });
    }
    res.json(result.data);
};

const getSurveyTypeUsageController = async (req, res) => {
    const { startDate, endDate } = req.query;  // Lấy các tham số từ query string
    const result = await reportService.getSurveyTypeUsage(startDate, endDate);
    res.status(result.status ? 200 : 500).json(result);
};

const getActivityOverviewController = async (req, res) => {
    const { startDate, endDate } = req.query;
    const result = await reportService.getActivityOverview(startDate, endDate);
    res.status(result.status ? 200 : 500).json(result);
};


module.exports = {
    getDashboardDataController,
    getActivityOverviewController,
    getSurveyTypeUsageController
};