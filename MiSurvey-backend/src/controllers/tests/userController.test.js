const {
    createUserController,
    updateUserController,
    deleteUserController,
    getOneUserController,
    getAllUsersController,
    searchUserController,
    getUserProfileController,
    getUserDataController,
} = require("../user.controller");

const userService = require("../../services/user.service");
jest.mock("../../services/user.service", () => ({
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getOneUser: jest.fn(),
    getAllUsers: jest.fn(),
    searchUsers: jest.fn(),
    getUserData: jest.fn(),
}));

describe("User Controller: createUserController", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should successfully create a user", async () => {
      const req = {
        body: {
          Username: "testUser",
          UserPassword: "testPassword",
        },
        user: {
          id: "adminID",
          companyID: "companyID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResult = {
        status: true,
        message: "User created successfully",
        userID: "1",
      };
  
      userService.createUser.mockResolvedValue(mockResult);
  
      await createUserController(req, res);
  
      expect(userService.createUser).toHaveBeenCalledWith(req.body, req.user);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  
    it("should return 400 and an error message if user creation fails", async () => {
      const req = {
        body: {
          Username: "testUser",
          UserPassword: "testPassword",
        },
        user: {
          id: "adminID",
          companyID: "companyID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = {
        status: false,
        message: "User creation failed",
        error: "User already exists",
      };
  
      userService.createUser.mockResolvedValue(mockError);
  
      await createUserController(req, res);
  
      expect(userService.createUser).toHaveBeenCalledWith(req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User creation failed" });
    });
  
    it("should handle unexpected errors and return 400", async () => {
      const req = {
        body: {
          Username: "testUser",
          UserPassword: "testPassword",
        },
        user: {
          id: "adminID",
          companyID: "companyID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      userService.createUser.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await createUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred" });
    });
});

describe("User Controller: updateUserController", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should successfully update a user", async () => {
      const req = {
        params: {
          UserID: "1",
        },
        body: {
          Username: "updatedUser",
          UserPassword: "newPassword",
        },
        user: {
          id: "adminID",
          companyID: "companyID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResult = {
        status: true,
        message: "User updated successfully",
        data: {
          user: {
            UserID: "1",
            Username: "updatedUser",
          },
        },
      };
  
      userService.updateUser.mockResolvedValue(mockResult);
  
      await updateUserController(req, res);
  
      expect(userService.updateUser).toHaveBeenCalledWith("1", req.body, req.user);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  
    it("should return 400 and an error message if no rows are updated", async () => {
      const req = {
        params: {
          UserID: "1",
        },
        body: {
          Username: "updatedUser",
          UserPassword: "newPassword",
        },
        user: {
          id: "adminID",
          companyID: "companyID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = {
        status: false,
        message: "No rows updated",
      };
  
      userService.updateUser.mockResolvedValue(mockError);
  
      await updateUserController(req, res);
  
      expect(userService.updateUser).toHaveBeenCalledWith("1", req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No rows updated" });
    });
  
    it("should handle unexpected errors and return 400", async () => {
      const req = {
        params: {
          UserID: "1",
        },
        body: {
          Username: "updatedUser",
          UserPassword: "newPassword",
        },
        user: {
          id: "adminID",
          companyID: "companyID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      userService.updateUser.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await updateUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred" });
    });
});

describe("User Controller: deleteUserController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully delete a user", async () => {
      const req = {
        params: {
          UserID: "1",
        },
        user: {
          id: "adminID",
          companyID: "companyID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResult = {
        status: true,
        message: "User and all related records deleted successfully",
      };
  
      userService.deleteUser.mockResolvedValue(mockResult);
  
      await deleteUserController(req, res);
  
      expect(userService.deleteUser).toHaveBeenCalledWith("1", req.user);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  
    it("should return 400 and an error message if the user deletion fails", async () => {
      const req = {
        params: {
          UserID: "1",
        },
        user: {
          id: "adminID",
          companyID: "companyID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = {
        status: false,
        message: "Failed to delete user and related data.",
      };
  
      userService.deleteUser.mockResolvedValue(mockError);
  
      await deleteUserController(req, res);
  
      expect(userService.deleteUser).toHaveBeenCalledWith("1", req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  
    it("should handle unexpected errors and return 400", async () => {
      const req = {
        params: {
          UserID: "1",
        },
        user: {
          id: "adminID",
          companyID: "companyID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      userService.deleteUser.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await deleteUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred" });
    });
});

describe("User Controller: getOneUserController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully retrieve a user", async () => {
      const req = {
        params: {
          UserID: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockUserDetails = {
        status: true,
        data: {
          UserID: "1",
          FullName: "John Doe",
          Email: "john.doe@example.com",
        },
      };
  
      userService.getOneUser.mockResolvedValue(mockUserDetails);
  
      await getOneUserController(req, res);
  
      expect(userService.getOneUser).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockUserDetails);
    });
  
    it("should return 400 and an error message if the user is not found", async () => {
      const req = {
        params: {
          UserID: "nonexistent",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = {
        status: false,
        message: "User not found",
      };
  
      userService.getOneUser.mockResolvedValue(mockError);
  
      await getOneUserController(req, res);
  
      expect(userService.getOneUser).toHaveBeenCalledWith("nonexistent");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  
    it("should handle unexpected errors and return 400", async () => {
      const req = {
        params: {
          UserID: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      userService.getOneUser.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await getOneUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred" });
    });
});

describe("User Controller: getAllUsersController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should return all users for a SuperAdmin", async () => {
      const req = {
        user: {
          role: "SuperAdmin",
        },
        query: {
          page: "1",
          pageSize: "10",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockUsers = {
        status: true,
        data: [
          {
            UserID: "1",
            Username: "admin",
            Email: "admin@example.com",
          },
          {
            UserID: "2",
            Username: "user1",
            Email: "user1@example.com",
          },
        ],
        total: 2,
      };
  
      userService.getAllUsers.mockResolvedValue(mockUsers);
  
      await getAllUsersController(req, res);
  
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  
    it("should return users for a non-SuperAdmin scoped to the user's company", async () => {
      const req = {
        user: {
          role: "Admin",
          companyID: "1",
        },
        query: {
          page: "1",
          pageSize: "10",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockUsers = {
        status: true,
        data: [
          {
            UserID: "1",
            Username: "user1",
            Email: "user1@example.com",
          },
        ],
        total: 1,
      };
  
      userService.getAllUsers.mockResolvedValue(mockUsers);
  
      await getAllUsersController(req, res);
  
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        user: {
          role: "Admin",
          companyID: "1",
        },
        query: {
          page: "1",
          pageSize: "10",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = {
        status: false,
        message: "Failed to retrieve users",
      };
  
      userService.getAllUsers.mockResolvedValue(mockError);
  
      await getAllUsersController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
});

describe("User Controller: searchUserController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should return 400 if column or searchTerm is missing", async () => {
      const req = {
        query: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await searchUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Both column and searchTerm are required as query parameters.",
      });
    });
  
    it("should return users based on the search query", async () => {
      const req = {
        query: {
          column: "Username",
          searchTerm: "john",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      const mockUsers = {
        status: true,
        data: [
          {
            UserID: "1",
            Username: "john",
            Email: "john@example.com",
          },
          {
            UserID: "2",
            Username: "johnny",
            Email: "johnny@example.com",
          },
        ],
      };
  
      userService.searchUsers.mockResolvedValue(mockUsers);
  
      await searchUserController(req, res);
  
      expect(userService.searchUsers).toHaveBeenCalledWith("Username", "john");
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  
    it("should return a 400 error if the column is invalid", async () => {
      const req = {
        query: {
          column: "InvalidColumn",
          searchTerm: "john",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      const mockError = {
        status: false,
        message: "Invalid search column",
      };
  
      userService.searchUsers.mockResolvedValue(mockError);
  
      await searchUserController(req, res);
  
      expect(userService.searchUsers).toHaveBeenCalledWith("InvalidColumn", "john");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid search column" });
    });
  
    it("should return 500 and an error message on service error", async () => {
      const req = {
        query: {
          column: "Username",
          searchTerm: "john",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      const mockError = {
        status: false,
        message: "Failed to search users.",
      };
  
      userService.searchUsers.mockRejectedValue(new Error(mockError.message));
  
      await searchUserController(req, res);
  
      expect(userService.searchUsers).toHaveBeenCalledWith("Username", "john");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
  
    it("should return no users found if none match the criteria", async () => {
        const req = {
            query: {
                column: "Username",
                searchTerm: "nonexistentuser",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        const mockResponse = {
            message: "No users found for the given search criteria"
        };
    
        userService.searchUsers.mockResolvedValue(mockResponse);
    
        await searchUserController(req, res);
    
        expect(userService.searchUsers).toHaveBeenCalledWith("Username", "nonexistentuser");
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
});

describe("User Controller: getUserProfileController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch user profile", async () => {
      const req = {
        user: {
          id: "123",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockUserDetails = {
        status: true,
        data: {
          UserID: "123",
          Username: "testuser",
          Email: "test@example.com",
        },
      };
  
      userService.getOneUser.mockResolvedValue(mockUserDetails);
  
      await getUserProfileController(req, res);
  
      expect(userService.getOneUser).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith(mockUserDetails);
    });
  
    it("should return 400 and an error message if user profile fetch fails", async () => {
      const req = {
        user: {
          id: "123",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = new Error("User not found");
  
      userService.getOneUser.mockRejectedValue(mockError);
  
      await getUserProfileController(req, res);
  
      expect(userService.getOneUser).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
});

describe("User Controller: getUserDataController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully return user data", async () => {
      const req = {
        user: {
          id: "123",
          role: "Admin",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResult = {
        status: true,
        userDetails: {
          UserID: "123",
          Username: "testuser",
          Email: "test@example.com",
        },
        packages: { PackageName: "Free" },
      };
  
      userService.getUserData.mockResolvedValue(mockResult);
  
      await getUserDataController(req, res);
  
      expect(userService.getUserData).toHaveBeenCalledWith("123", "Admin");
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  
    it("should return 400 if userID is not provided", async () => {
      const req = {
        user: {},
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await getUserDataController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "userID is required as a query parameter.",
      });
    });
  
    it("should return 500 and an error message on failure", async () => {
      const req = {
        user: {
          id: "123",
          role: "Admin",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = new Error("Failed to retrieve user data.");
  
      userService.getUserData.mockRejectedValue(mockError);
  
      await getUserDataController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to retrieve user data.",
      });
    });
});