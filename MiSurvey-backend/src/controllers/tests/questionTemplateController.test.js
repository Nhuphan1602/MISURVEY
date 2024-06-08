const {
    createQuestionTemplateController,
    getAllQuestionTemplatesController,
    updateQuestionTemplateController,
    deleteQuestionTemplateController,
    getQuestionTemplateController,
    searchQuestionTemplatesController,
} = require("../questionTemplate.controller");

const questionTemplateService = require("../../services/questionTemplate.service");
jest.mock("../../services/questionTemplate.service", () => ({
    createQuestionTemplate: jest.fn(),
    getAllQuestionTemplates: jest.fn(),
    updateQuestionTemplate: jest.fn(),
    deleteQuestionTemplate: jest.fn(),
    getQuestionTemplateById: jest.fn(),
    searchQuestionTemplates: jest.fn(),
}));

describe("Question Template controller: createQuestionTemplateController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully create a question template and return a success message", async () => {
      const req = {
        body: {
          templateName: "Sample Template",
          questions: ["Question 1", "Question 2"],
        },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Create question successfully",
        template: { TemplateID: "1" },
      };
  
      questionTemplateService.createQuestionTemplate.mockResolvedValue(mockResponse);
  
      await createQuestionTemplateController(req, res);
  
      expect(questionTemplateService.createQuestionTemplate).toHaveBeenCalledWith(req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        body: {
          templateName: "Sample Template",
          questions: ["Question 1", "Question 2"],
        },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.createQuestionTemplate.mockRejectedValue(new Error("Service error"));
  
      await createQuestionTemplateController(req, res);
  
      expect(questionTemplateService.createQuestionTemplate).toHaveBeenCalledWith(req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: false, message: "Service error" });
    });
});

describe("Question Template controller: getAllQuestionTemplatesController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch all question templates with pagination", async () => {
      const req = {
        query: { page: "1", pageSize: "10" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        templates: [
          { TemplateID: "1", TemplateName: "Template 1" },
          { TemplateID: "2", TemplateName: "Template 2" },
        ],
        total: 2,
      };
  
      questionTemplateService.getAllQuestionTemplates.mockResolvedValue(mockResponse);
  
      await getAllQuestionTemplatesController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if service returns an error", async () => {
      const req = {
        query: { page: "1", pageSize: "10" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.getAllQuestionTemplates.mockResolvedValue({
        status: false,
        message: "Error fetching templates",
      });
  
      await getAllQuestionTemplatesController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: false, message: "Error fetching templates" });
    });
  
    it("should return 500 and an error message on service error", async () => {
      const req = {
        query: { page: "1", pageSize: "10" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.getAllQuestionTemplates.mockRejectedValue(new Error("Service error"));
  
      await getAllQuestionTemplatesController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Question Template controller: updateQuestionTemplateController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully update a question template and return a success message", async () => {
      const req = {
        params: { templateID: "1" },
        body: { templateName: "Updated Template" },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Update question successfully",
        template: { TemplateID: "1", TemplateName: "Updated Template" },
      };
  
      questionTemplateService.updateQuestionTemplate.mockResolvedValue(mockResponse);
  
      await updateQuestionTemplateController(req, res);
  
      expect(questionTemplateService.updateQuestionTemplate).toHaveBeenCalledWith("1", req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if service returns an error", async () => {
      const req = {
        params: { templateID: "1" },
        body: { templateName: "Updated Template" },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.updateQuestionTemplate.mockResolvedValue({
        status: false,
        message: "Template not found",
      });
  
      await updateQuestionTemplateController(req, res);
  
      expect(questionTemplateService.updateQuestionTemplate).toHaveBeenCalledWith("1", req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: false, message: "Template not found" });
    });
  
    it("should return 500 and an error message on service error", async () => {
      const req = {
        params: { templateID: "1" },
        body: { templateName: "Updated Template" },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.updateQuestionTemplate.mockRejectedValue(new Error("Service error"));
  
      await updateQuestionTemplateController(req, res);
  
      expect(questionTemplateService.updateQuestionTemplate).toHaveBeenCalledWith("1", req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Question Template controller: deleteQuestionTemplateController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully delete a question template and return a success message", async () => {
      const req = {
        params: { templateID: "1" },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Template deleted successfully",
      };
  
      questionTemplateService.deleteQuestionTemplate.mockResolvedValue(mockResponse);
  
      await deleteQuestionTemplateController(req, res);
  
      expect(questionTemplateService.deleteQuestionTemplate).toHaveBeenCalledWith("1", req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the template is not found", async () => {
      const req = {
        params: { templateID: "1" },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.deleteQuestionTemplate.mockResolvedValue({
        status: false,
        message: "Template not found",
      });
  
      await deleteQuestionTemplateController(req, res);
  
      expect(questionTemplateService.deleteQuestionTemplate).toHaveBeenCalledWith("1", req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: false, message: "Template not found" });
    });
  
    it("should return 500 and an error message on service error", async () => {
      const req = {
        params: { templateID: "1" },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.deleteQuestionTemplate.mockRejectedValue(new Error("Service error"));
  
      await deleteQuestionTemplateController(req, res);
  
      expect(questionTemplateService.deleteQuestionTemplate).toHaveBeenCalledWith("1", req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Question Template controller: getQuestionTemplateController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully retrieve a question template by ID and return it", async () => {
      const req = {
        params: { templateId: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockTemplate = {
        TemplateID: "1",
        TemplateName: "Sample Template",
        SurveyType: {
          SurveyTypeID: "1",
          SurveyTypeName: "Type A",
        },
      };
  
      questionTemplateService.getQuestionTemplateById.mockResolvedValue({
        status: true,
        template: mockTemplate,
      });
  
      await getQuestionTemplateController(req, res);
  
      expect(questionTemplateService.getQuestionTemplateById).toHaveBeenCalledWith("1");
      expect(res.status).not.toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(mockTemplate);
    });
  
    it("should return 404 and an error message if the template is not found", async () => {
      const req = {
        params: { templateId: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.getQuestionTemplateById.mockResolvedValue({
        status: false,
        message: "Template not found",
      });
  
      await getQuestionTemplateController(req, res);
  
      expect(questionTemplateService.getQuestionTemplateById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Template not found" });
    });
  
    it("should return 500 and an error message on service error", async () => {
      const req = {
        params: { templateId: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.getQuestionTemplateById.mockRejectedValue(new Error("Service error"));
  
      await getQuestionTemplateController(req, res);
  
      expect(questionTemplateService.getQuestionTemplateById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Question Template controller: searchQuestionTemplatesController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should return 400 if the search term is not provided", async () => {
      const req = {
        query: {},
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await searchQuestionTemplatesController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Search term is required" });
    });
  
    it("should return the matching templates based on the search term", async () => {
      const req = {
        query: { searchTerm: "Survey" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockTemplates = [
        { TemplateID: "1", TemplateText: "Survey Template 1", SurveyType: { SurveyTypeID: "1", SurveyTypeName: "Type A" } },
        { TemplateID: "2", TemplateText: "Survey Template 2", SurveyType: { SurveyTypeID: "2", SurveyTypeName: "Type B" } }
      ];
  
      questionTemplateService.searchQuestionTemplates.mockResolvedValue({
        status: true,
        templates: mockTemplates,
      });
  
      await searchQuestionTemplatesController(req, res);
  
      expect(questionTemplateService.searchQuestionTemplates).toHaveBeenCalledWith("Survey");
      expect(res.status).not.toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(mockTemplates);
    });
  
    it("should return 404 if no templates match the search term", async () => {
      const req = {
        query: { searchTerm: "NonExistent" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.searchQuestionTemplates.mockResolvedValue({
        status: false,
        message: "No templates found",
      });
  
      await searchQuestionTemplatesController(req, res);
  
      expect(questionTemplateService.searchQuestionTemplates).toHaveBeenCalledWith("NonExistent");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No templates found" });
    });
  
    it("should return 500 and an error message on service error", async () => {
      const req = {
        query: { searchTerm: "Survey" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      questionTemplateService.searchQuestionTemplates.mockRejectedValue(new Error("Service error"));
  
      await searchQuestionTemplatesController(req, res);
  
      expect(questionTemplateService.searchQuestionTemplates).toHaveBeenCalledWith("Survey");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});