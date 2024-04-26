const { customerService } = require("../services");

const createCustomerController = async (req, res) => {
  console.log(req.body);
  try {
    const newCustomer = await customerService.createCustomer(req.body);
    res.json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCustomerController = async (req, res) => {
  try {
    const result = await customerService.updateCustomer(
      req.params.CustomerID,
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCustomerController = async (req, res) => {
  try {
    const result = await customerService.deleteCustomer(req.params.CustomerID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchCustomersController = async (req, res) => {
  try {
    const { name } = req.query;
    const result = await customerService.searchCustomers(name);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneCustomerController = async (req, res) => {
  try {
    const result = await customerService.getOneCustomer(req.params.CustomerID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCustomersController = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1; // Set default page to 1 if not provided
      const pageSize = parseInt(req.query.pageSize) || 10; // Set default pageSize to 10 if not provided
      console.log(req.user)
      const result = await customerService.getAllCustomers(page, pageSize, req.user);

      res.json(result);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};
module.exports = {
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
  getAllCustomersController,
  getOneCustomerController,
  searchCustomersController,
};
