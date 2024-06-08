const {
    loginController,
    logoutController,
    registerUserController,
    getPermissionsController,
} = require("../auth.controller");

const authService = require("../../services/auth.service");
jest.mock("../../services/auth.service", () => ({
    loginUser: jest.fn(),
    logoutUser: jest.fn(),
    registerUser: jest.fn(),
    getUserPermissions: jest.fn(),
}));

describe("Auth controller: loginController", () => {
    beforeEach(() => {
        jest.resetAllMocks(); // Reset mocks between tests
    });

    // Test successful login
    it("should successfully log in a user and return a success message", async () => {
        const req = {
            body: { username: "testuser", password: "password123" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            cookie: jest.fn(),
        };

        authService.loginUser.mockResolvedValue({
            status: true,
            message: "User login successful",
        });

        await loginController(req, res);

        expect(authService.loginUser).toHaveBeenCalledWith(res, "testuser", "password123");
        expect(res.status).not.toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: true,
            message: "User login successful",
        });
    });

    // Test login with incorrect password
    it("should return an error message for incorrect password", async () => {
        const req = {
            body: { username: "testuser", password: "wrongpassword" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        authService.loginUser.mockResolvedValue({
            status: false,
            message: "Incorrect password",
        });

        await loginController(req, res);

        expect(authService.loginUser).toHaveBeenCalledWith(res, "testuser", "wrongpassword");
        expect(res.json).toHaveBeenCalledWith({
            status: false,
            message: "Incorrect password",
        });
    });

    // Test user not found
    it("should return an error message if the user is not found", async () => {
        const req = {
            body: { username: "unknownuser", password: "password123" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        authService.loginUser.mockResolvedValue({
            status: false,
            message: "No user found",
        });

        await loginController(req, res);

        expect(authService.loginUser).toHaveBeenCalledWith(res, "unknownuser", "password123");
        expect(res.json).toHaveBeenCalledWith({
            status: false,
            message: "No user found",
        });
    });

    // Test server error
    it("should return a 400 status and error message on server error", async () => {
        const req = {
            body: { username: "testuser", password: "password123" },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        authService.loginUser.mockRejectedValue(new Error("Server error"));

        await loginController(req, res);

        expect(authService.loginUser).toHaveBeenCalledWith(res, "testuser", "password123");
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server error",
        });
    });
});

describe("Auth controller: logoutController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully log out a user and return a success message", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn(),
      };
  
      authService.logoutUser.mockImplementation((res) => {
        res.cookie("jwt", "", {
          httpOnly: true,
          expires: new Date(0),
        });
        return {
          status: true,
          message: "Logged out successfully",
        };
    });
  
    await logoutController(req, res);
  
    expect(authService.logoutUser).toHaveBeenCalledWith(res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Logged out successfully",
    });
    expect(res.cookie).toHaveBeenCalledWith("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
    });
  
    it("should return a 400 status and error message on server error", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      authService.logoutUser.mockImplementation(() => {
        throw new Error("Server error");
      });
  
      await logoutController(req, res);
  
      expect(authService.logoutUser).toHaveBeenCalledWith(res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error",
      });
    });
});

describe("Auth controller: registerUserController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    // Test successful registration
    it("should successfully register a user and return a success message", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          companyName: "OpenAI",
          email: "john.doe@example.com",
          username: "johndoe",
          password: "password123",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockUser = {
        Username: "johndoe",
        FirstName: "John",
        LastName: "Doe",
        Email: "john.doe@example.com",
        UserRole: "Admin",
        UserID: 1,
      };
      const mockCompany = {
        CompanyID: 1,
        CompanyName: "OpenAI",
        AdminID: 1,
      };
  
      authService.registerUser.mockResolvedValue({
        status: true,
        message: "Registration successful",
        data: {
          user: mockUser,
          company: mockCompany,
        },
      });
  
      await registerUserController(req, res);
  
      expect(authService.registerUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Registration successful",
        data: {
          user: mockUser,
          company: mockCompany,
        },
      });
    });
  
    // Test registration failure due to existing user
    it("should return an error message when the user already exists", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          companyName: "OpenAI",
          email: "john.doe@example.com",
          username: "johndoe",
          password: "password123",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      authService.registerUser.mockResolvedValue({
        status: false,
        message: "User already exists",
      });
  
      await registerUserController(req, res);
  
      expect(authService.registerUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "User already exists",
      });
    });
  
    // Test server error
    it("should return a 400 status and error message on server error", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          companyName: "OpenAI",
          email: "john.doe@example.com",
          username: "johndoe",
          password: "password123",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      authService.registerUser.mockRejectedValue(new Error("Server error"));
  
      await registerUserController(req, res);
  
      expect(authService.registerUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error",
      });
    });
});

describe("Auth controller: getPermissionsController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should return 400 and an error message if userId is missing", async () => {
      const req = {
        params: {},
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await getPermissionsController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "UserID is required",
      });
    });
  
    it("should successfully retrieve permissions for a valid userId", async () => {
      const req = {
        params: { userId: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockPermissions = {
        companyUserId: "1",
        permissions: [
          { module: { ModuleName: "Module1" }, Permission: "read" },
          { module: { ModuleName: "Module2" }, Permission: "write" },
        ],
      };
  
      authService.getUserPermissions.mockResolvedValue(mockPermissions);
  
      await getPermissionsController(req, res);
  
      expect(authService.getUserPermissions).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPermissions);
    });
  
    it("should return a 400 status and error message on service error", async () => {
      const req = {
        params: { userId: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      authService.getUserPermissions.mockRejectedValue(new Error("Service error"));
  
      await getPermissionsController(req, res);
  
      expect(authService.getUserPermissions).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Service error",
      });
    });
});