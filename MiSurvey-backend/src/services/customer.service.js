const { Customer } = require("../models");
const { Op } = require("sequelize");

const createCustomer = async (customerData) => {
  try {
    const customer = await Customer.create(customerData);
    return { status: true, message: "Customer created successfully", customer };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const updateCustomer = async (id, customerData) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return {
        status: false,
        message: "Customer not found",
      };
    }

    const [updatedRows] = await Customer.update(customerData, {
      where: { CustomerID: id },
    });
    if (updatedRows === 0) {
      return { status: false, message: "No customer updated" };
    }
    return { status: true, message: "Customer updated successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const deleteCustomer = async (id) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return { status: false, message: "Customer not found" };
    }

    await Customer.destroy({ where: { CustomerID: id } });

    return { status: true, message: "Customer deleted successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getAllCustomers = async () => {
  try {
    const customers = await Customer.findAll();
    return { status: true, message: "Customers fetched successfully", customers };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneCustomer = async (id) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return { status: false, message: "Customer not found" };
    }

    return { status: true, message: "Customer fetched successfully", customer };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const searchCustomers = async (query) => {
  try {
    console.log("Searching customers", query);
    const customers = await Customer.findAll({
      where: {
        FullName: {
          [Op.like]: "%" + query + "%",
        },
      },
    });

    if (customers.length === 0) {
      return { status: false, message: "No customers found" };
    }

    return { status: true, message: "Customers fetched successfully", customers };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

module.exports = {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomers,
  getOneCustomer,
  searchCustomers,
};