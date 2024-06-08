const {
    createSurveyResponseController,
    getOneSurveyResponseController,
    deleteSurveyResponseController,
    getAllResponseController,
    getSurveyResponseCountController,
} = require("../surveyResponse.controller");

const surveyResponseService = require("../../services/surveyResponse.service");
jest.mock("../../services/surveyResponse.service", () => ({
    createSurveyResponses: jest.fn(),
    deleteResponse: jest.fn(),
    getOneResponse: jest.fn(),
    getAllResponsesFromSurvey: jest.fn(),
    getSurveyResponseCount: jest.fn(),
}));

describe("Survey Response Controller", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should successfully create survey responses", async () => {
      const req = {
        body: {
          FullName: "John Doe",
          Email: "john.doe@example.com",
          SurveyResponses: [{ SurveyID: 1, ResponseValue: "Excellent" }],
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = { status: true, message: "Responses recorded successfully" };
      surveyResponseService.createSurveyResponses.mockResolvedValue(mockResponse);
  
      await createSurveyResponseController(req, res);
  
      expect(surveyResponseService.createSurveyResponses).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service failure", async () => {
      const req = {
        body: {
          FullName: "Jane Doe",
          SurveyResponses: [{ SurveyID: 1, ResponseValue: "Good" }],
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.createSurveyResponses.mockResolvedValue({
        status: false,
        message: "Error processing survey responses",
      });
  
      await createSurveyResponseController(req, res);
  
      expect(surveyResponseService.createSurveyResponses).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Error processing survey responses", status: false });
    });
  
    it("should return 400 and an error message on controller exception", async () => {
      const req = {
        body: {},
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.createSurveyResponses.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await createSurveyResponseController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred", status: false });
    });
});

describe("Survey Response Controller: getOneSurveyResponseController", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should successfully fetch a survey response by ID", async () => {
      const req = {
        params: { responseID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = { status: true, response: { id: "1", value: "Excellent" } };
      surveyResponseService.getOneResponse.mockResolvedValue(mockResponse);
  
      await getOneSurveyResponseController(req, res);
  
      expect(surveyResponseService.getOneResponse).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the response is not found", async () => {
      const req = {
        params: { responseID: "2" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.getOneResponse.mockResolvedValue({
        status: false,
        message: "Survey response not found",
      });
  
      await getOneSurveyResponseController(req, res);
  
      expect(surveyResponseService.getOneResponse).toHaveBeenCalledWith("2");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Survey response not found", status: false });
    });
  
    it("should return 400 and an error message on controller exception", async () => {
      const req = {
        params: { responseID: "3" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.getOneResponse.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await getOneSurveyResponseController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred", status: false });
    });
});

describe("Survey Response Controller: deleteSurveyResponseController", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock data before each test
    });
  
    it("should successfully delete a survey response by ID", async () => {
      const req = {
        params: { responseID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.deleteResponse.mockResolvedValue({
        status: true,
        message: "Survey response and associated tickets deleted successfully",
      });
  
      await deleteSurveyResponseController(req, res);
  
      expect(surveyResponseService.deleteResponse).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith({ message: "Survey response and associated tickets deleted successfully" });
    });
  
    it("should return an error message if the response is not found", async () => {
      const req = {
        params: { responseID: "2" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.deleteResponse.mockResolvedValue({
        status: false,
        message: "Survey response not found",
      });
  
      await deleteSurveyResponseController(req, res);
  
      expect(surveyResponseService.deleteResponse).toHaveBeenCalledWith("2");
    });
  
    it("should return 400 and an error message on controller exception", async () => {
      const req = {
        params: { responseID: "3" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.deleteResponse.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await deleteSurveyResponseController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred", status: false });
    });
});

describe("Survey Response Controller: getAllResponseController", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should successfully fetch all responses for a given survey ID", async () => {
      const req = {
        params: { surveyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponses = [
        {
          ResponseID: "1",
          SurveyID: "1",
          SurveyQuestion: {
            QuestionID: "1",
            SurveyType: { SurveyTypeName: "Multiple Choice" },
          },
        },
        {
          ResponseID: "2",
          SurveyID: "1",
          SurveyQuestion: {
            QuestionID: "2",
            SurveyType: { SurveyTypeName: "Text" },
          },
        },
      ];
  
      surveyResponseService.getAllResponsesFromSurvey.mockResolvedValue({
        status: true,
        responses: mockResponses,
      });
  
      await getAllResponseController(req, res);
  
      expect(surveyResponseService.getAllResponsesFromSurvey).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith({ status: true, responses: mockResponses });
    });
  
    it("should return an error message if no responses are found for the survey", async () => {
      const req = {
        params: { surveyID: "2" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.getAllResponsesFromSurvey.mockResolvedValue({
        status: false,
        message: "No responses found for this survey",
      });
  
      await getAllResponseController(req, res);
  
      expect(surveyResponseService.getAllResponsesFromSurvey).toHaveBeenCalledWith("2");
      expect(res.json).toHaveBeenCalledWith({ status: false, message: "No responses found for this survey" });
    });
  
    it("should return 400 and an error message on controller exception", async () => {
      const req = {
        params: { surveyID: "3" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.getAllResponsesFromSurvey.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await getAllResponseController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred", status: false });
    });
});

describe("Survey Response Controller: getSurveyResponseCountController", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock data before each test
    });
  
    it("should successfully fetch the survey response count and active package limit", async () => {
      const req = {
        params: { surveyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockData = {
        status: true,
        count: 30,
        responseLimit: 100,
      };
  
      surveyResponseService.getSurveyResponseCount.mockResolvedValue(mockData);
  
      await getSurveyResponseCountController(req, res);
  
      expect(surveyResponseService.getSurveyResponseCount).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    it("should return an error message if the survey is not found", async () => {
      const req = {
        params: { surveyID: "2" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.getSurveyResponseCount.mockResolvedValue({
        status: false,
        message: "Survey not found",
      });
  
      await getSurveyResponseCountController(req, res);
  
      expect(surveyResponseService.getSurveyResponseCount).toHaveBeenCalledWith("2");
      expect(res.json).toHaveBeenCalledWith({ status: false, message: "Survey not found" });
    });
  
    it("should return 400 and an error message on controller exception", async () => {
      const req = {
        params: { surveyID: "3" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyResponseService.getSurveyResponseCount.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await getSurveyResponseCountController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred", status: false });
    });
});