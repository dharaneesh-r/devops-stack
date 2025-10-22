const {
  postRegister,
  getRegister,
} = require("../controller/RegisterController");
const Register = require("../model/RegisterModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock dependencies
jest.mock("../model/RegisterModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../utils/WinstonLogger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe("Register Controller", () => {
  let res, req, next;

  beforeEach(() => {
    req = {};
    next = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------
  // Test postRegister
  // -----------------------------
  test("postRegister → should fail if mandatory fields are missing", async () => {
    req.body = { firstname: "John" }; // missing other fields

    await postRegister(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Mandatory fields are missing",
    });
  });

  test("postRegister → should create a new user successfully", async () => {
    req.body = {
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      password: "password123",
    };

    Register.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword");
    Register.create.mockResolvedValue({ _id: "1", email: req.body.email });
    jwt.sign.mockReturnValue("jwtToken");

    await postRegister(req, res, next);

    expect(Register.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 12);
    expect(Register.create).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "jwtToken",
      expect.any(Object)
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: "created",
      message: "User registered successfully",
      token: "jwtToken",
    });
  });

  // -----------------------------
  // Test getRegister
  // -----------------------------
  test("getRegister → should return all records", async () => {
    const mockData = [{ firstname: "John" }];
    Register.find.mockResolvedValue(mockData);

    await getRegister(req, res);

    expect(Register.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Got All the records",
      data: mockData,
    });
  });
});
