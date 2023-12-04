const { companyUser } = require('../services');

const createCompanyUserController = async (req, res) => {
    try {
        // Extracting the company user data from the request body
        const companyUserData = req.body;

        // Calling the service function to create a company user
        const result = await companyUser.createCompanyUser(companyUserData);

        // Sending a successful response back
        res.status(201).json(result);
    } catch (error) {
        // Handling any errors that occur during the process
        res.status(400).json({ 
            status: false, 
            message: error.message || "Error occurred while creating company user" 
        });
    }
};

const deleteCompanyUserController = async (req, res) => {
  try {
    const result = await companyUser.deleteCompanyUser(req.params.companyUserId);

    if (result.status) {
      res.json({ status: true, message: result.message });
    } else {
      res.status(400).json({ status: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getOneCompanyUserController = async (req, res) => {
    try {
        const result = await companyUser.getOneCompanyUser(req.params.companyUserId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllCompanyUsersController = async (req, res) => {
    try {
        const result = await companyUser.getAllCompanyUsers();
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createCompanyUserController,
    deleteCompanyUserController,
    getOneCompanyUserController,
    getAllCompanyUsersController
};