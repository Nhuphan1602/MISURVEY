const {
    createCustomerController,
    updateCustomerController,
    deleteCustomerController,
    getAllCustomersController,
    getOneCustomerController,
    searchCustomersController,
} = require("../customer.controller");

const customerService = require("../../services/customer.service");
jest.mock("../../services/customer.service", () => ({
    createCustomer: jest.fn(),
    updateCustomer: jest.fn(),
    deleteCustomer: jest.fn(),
    getAllCustomers: jest.fn(),
    getOneCustomer: jest.fn(),
    searchCustomers: jest.fn(),
}));

describe("Customer controller: createCustomerController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully create a customer and return a success message", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Customer created successfully",
        customer: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
      };
  
      customerService.createCustomer.mockResolvedValue(mockResponse);
  
      await createCustomerController(req, res);
  
      expect(customerService.createCustomer).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.createCustomer.mockRejectedValue(new Error("Service error"));
  
      await createCustomerController(req, res);
  
      expect(customerService.createCustomer).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Customer controller: updateCustomerController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully update a customer and return a success message", async () => {
      const req = {
        params: { CustomerID: "1" },
        body: { firstName: "John", lastName: "Doe", email: "john.doe@example.com" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Customer updated successfully",
      };
  
      customerService.updateCustomer.mockResolvedValue(mockResponse);
  
      await updateCustomerController(req, res);
  
      expect(customerService.updateCustomer).toHaveBeenCalledWith("1", req.body);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the customer is not found", async () => {
      const req = {
        params: { CustomerID: "invalidCustomerID" },
        body: { firstName: "John", lastName: "Doe", email: "john.doe@example.com" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.updateCustomer.mockResolvedValue({
        status: false,
        message: "Customer not found",
      });
  
      await updateCustomerController(req, res);
  
      expect(customerService.updateCustomer).toHaveBeenCalledWith("invalidCustomerID", req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Customer not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { CustomerID: "1" },
        body: { firstName: "John", lastName: "Doe", email: "john.doe@example.com" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.updateCustomer.mockRejectedValue(new Error("Service error"));
  
      await updateCustomerController(req, res);
  
      expect(customerService.updateCustomer).toHaveBeenCalledWith("1", req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Customer controller: deleteCustomerController", () => {
    beforeEach(() => {
      jest.resetAllMocks(); // Reset mocks between tests
    });
  
    it("should successfully delete a customer and return a success message", async () => {
      const req = {
        params: { CustomerID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Customer deleted successfully",
      };
  
      customerService.deleteCustomer.mockResolvedValue(mockResponse);
  
      await deleteCustomerController(req, res);
  
      expect(customerService.deleteCustomer).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the customer is not found", async () => {
      const req = {
        params: { CustomerID: "invalidCustomerID" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.deleteCustomer.mockResolvedValue({
        status: false,
        message: "Customer not found",
      });
  
      await deleteCustomerController(req, res);
  
      expect(customerService.deleteCustomer).toHaveBeenCalledWith("invalidCustomerID");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Customer not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { CustomerID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.deleteCustomer.mockRejectedValue(new Error("Service error"));
  
      await deleteCustomerController(req, res);
  
      expect(customerService.deleteCustomer).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Customer controller: searchCustomersController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch customers and return a success message", async () => {
      const req = {
        query: { name: "John" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Customers fetched successfully",
        customers: [
          { CustomerID: "1", FullName: "John Doe" },
          { CustomerID: "2", FullName: "John Smith" },
        ],
      };
  
      customerService.searchCustomers.mockResolvedValue(mockResponse);
  
      await searchCustomersController(req, res);
  
      expect(customerService.searchCustomers).toHaveBeenCalledWith("John");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if no customers are found", async () => {
      const req = {
        query: { name: "NonExistentName" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.searchCustomers.mockResolvedValue({
        status: false,
        message: "No customers found",
      });
  
      await searchCustomersController(req, res);
  
      expect(customerService.searchCustomers).toHaveBeenCalledWith("NonExistentName");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No customers found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        query: { name: "John" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.searchCustomers.mockRejectedValue(new Error("Service error"));
  
      await searchCustomersController(req, res);
  
      expect(customerService.searchCustomers).toHaveBeenCalledWith("John");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Customer controller: getOneCustomerController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch a customer and return a success message", async () => {
      const req = {
        params: { CustomerID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Customer fetched successfully",
        customer: { CustomerID: "1", FullName: "John Doe" },
      };
  
      customerService.getOneCustomer.mockResolvedValue(mockResponse);
  
      await getOneCustomerController(req, res);
  
      expect(customerService.getOneCustomer).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the customer is not found", async () => {
      const req = {
        params: { CustomerID: "invalidCustomerID" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.getOneCustomer.mockResolvedValue({
        status: false,
        message: "Customer not found",
      });
  
      await getOneCustomerController(req, res);
  
      expect(customerService.getOneCustomer).toHaveBeenCalledWith("invalidCustomerID");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Customer not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { CustomerID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.getOneCustomer.mockRejectedValue(new Error("Service error"));
  
      await getOneCustomerController(req, res);
  
      expect(customerService.getOneCustomer).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Customer controller: getAllCustomersController", () => {
    beforeEach(() => {
      jest.resetAllMocks(); 
    });
  
    it("should successfully fetch customers and return a success message", async () => {
      const req = {
        query: { page: "1", pageSize: "10" },
        user: { companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Customers fetched successfully",
        customers: [
          { CustomerID: "1", FullName: "John Doe" },
          { CustomerID: "2", FullName: "Jane Doe" },
        ],
        total: 2,
      };
  
      customerService.getAllCustomers.mockResolvedValue(mockResponse);
  
      await getAllCustomersController(req, res);
  
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        query: { page: "1", pageSize: "10" },
        user: { companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.getAllCustomers.mockRejectedValue(new Error("Service error"));
  
      await getAllCustomersController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
  
    it("should return 400 and an error message if fetching customers fails", async () => {
      const req = {
        query: { page: "1", pageSize: "10" },
        user: { companyID: "1" }, 
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      customerService.getAllCustomers.mockResolvedValue({
        status: false,
        message: "No customers found",
      });
  
      await getAllCustomersController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No customers found" });
    });
});