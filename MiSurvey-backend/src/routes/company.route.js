const express = require('express');
const { companyController } = require('../controllers');

const router = express.Router();

// SuperAdmin routes
router.post('/admin/addCompany', companyController.adminAddCompanyController); 
router.put('/admin/updateCompany', companyController.adminUpdateCompanyController);
router.delete('/admin/deleteCompany', companyController.adminDeleteCompanyController);

// User routes
//router.post('/user/addCompany', companyController.adminAddCompanyController); 

module.exports = router;