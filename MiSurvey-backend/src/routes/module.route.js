const express = require('express');
const { moduleController } = require('../controllers');

const router = express.Router();

// SuperAdmin routes
router.post('/SuperAdmin/createModule', moduleController.createModuleBySuperAdminController); 
router.put('/SuperAdmin/updateModule/:ModuleID', moduleController.updateModuleBySuperAdminController); 
router.delete('/SuperAdmin/deleteModule/:ModuleID', moduleController.deleteModuleBySuperAdminController); 

// User routes

module.exports = router;