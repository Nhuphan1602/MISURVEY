const {
    getAllActivitiesController,
  } = require("../userActivityLog.controller");
  
const userActivityLogService = require("../../services/userActivityLog.service");
jest.mock("../../services/userActivityLog.service", () => ({
    getAllActivities: jest.fn(),
}));

describe("Activity Controller: getAllActivitiesController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should fetch activities successfully for a SuperAdmin", async () => {
      const req = {
        user: {
          id: "superAdminId",
          role: "SuperAdmin"
        },
        query: {
          page: "1",
          pageSize: "10"
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockActivities = {
        status: true,
        message: "Activities fetched successfully",
        activities: [{ id: 1, action: "logged in" }],
        total: 1
      };
  
      userActivityLogService.getAllActivities.mockResolvedValue(mockActivities);
  
      await getAllActivitiesController(req, res);
  
      expect(res.json).toHaveBeenCalledWith(mockActivities);
      expect(res.status).not.toHaveBeenCalledWith(400);
    });
  
    it("should fetch activities successfully for a non-SuperAdmin", async () => {
      const req = {
        user: {
          id: "adminId",
          role: "Admin",
          companyID: "company1"
        },
        query: {
          page: "1",
          pageSize: "10"
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockActivities = {
        status: true,
        message: "Activities fetched successfully",
        activities: [{ id: 2, action: "created account" }],
        total: 1
      };
  
      userActivityLogService.getAllActivities.mockResolvedValue(mockActivities);
  
      await getAllActivitiesController(req, res);
  
      expect(res.json).toHaveBeenCalledWith(mockActivities);
    });
  
    it("should handle errors when fetching activities fails", async () => {
      const req = {
        user: {
          id: "superAdminId",
          role: "SuperAdmin"
        },
        query: {
          page: "1",
          pageSize: "10"
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = {
        status: false,
        message: "Failed to fetch activities",
        error: "Database error"
      };
  
      userActivityLogService.getAllActivities.mockRejectedValue(mockError);
  
      await getAllActivitiesController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
});