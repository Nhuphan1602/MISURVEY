const { moduleService } = require('../services');

const createModuleBySuperAdminController = async (req, res) => {
    console.log(req.body)
    try {
        const newUser = await moduleService.createModuleBySuperAdmin(req.body);
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateModuleBySuperAdminController = async (req, res) => {

    try {
        const result = await moduleService.updateModuleBySuperAdmin(req.params.ModuleID, req.body);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteModuleBySuperAdminController = async (req, res) => {
    try {
        const result = await moduleService.deleteModuleBySuperAdmin(req.params.ModuleID);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createModuleBySuperAdminController,
    updateModuleBySuperAdminController,
    deleteModuleBySuperAdminController
};
