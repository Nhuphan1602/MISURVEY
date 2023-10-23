const { Module } = require('../models');

const createModuleBySuperAdmin = async (moduleData) => {
  try {
    const module = await Module.create(moduleData);
    return { status: true, message: "Module created successfully", module };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const updateModuleBySuperAdmin = async (id, moduleData) => {
  try {
    const [updatedRows] = await Module.update(moduleData, { where: { ModuleID: id } });
    if (updatedRows === 0) {
      return { status: false, message: "No module updated" };
    }
    return { status: true, message: "Module updated successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const deleteModuleBySuperAdmin = async (id) => {
  try {
    await Module.destroy({ where: { ModuleID: id } });
    return { status: true, message: "Module deleted successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

module.exports = {
  createModuleBySuperAdmin,
  updateModuleBySuperAdmin,
  deleteModuleBySuperAdmin
};
