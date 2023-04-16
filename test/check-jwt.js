const http = require("http");
const jwt = require("jsonwebtoken");
const { checkJwt } = require("./checkJwt");

// Mock the express request and response objects
const req = {
  headers: {
    authorization: "Bearer mockToken",
  },
};

const res = {
  sendStatus: jest.fn(),
};

// Mock the JWT_SECRET environment variable
process.env.JWT_SECRET = "mockSecret";

describe("checkJwt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() if the JWT is valid", async () => {
    // Mock the jwt.verify function to return a user object
    jwt.verify = jest.fn().mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 123 });
    });

    const next = jest.fn();
    await checkJwt(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "mockToken",
      "mockSecret",
      { algorithms: ["HS256"] },
      expect.any(Function)
    );

    expect(req.user).toEqual({ id: 123 });
    expect(next).toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it("should return 401 if the Authorization header is missing", async () => {
    const next = jest.fn();
    req.headers.authorization = undefined;

    await checkJwt(req, res, next);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(http.StatusUnauthorized);
  });

  it("should return 401 if the Authorization header has an invalid prefix", async () => {
    const next = jest.fn();
    req.headers.authorization = "invalidPrefix mockToken";

    await checkJwt(req, res, next);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(http.StatusUnauthorized);
  });

  it("should return 403 if the JWT is invalid", async () => {
    // Mock the jwt.verify function to return an error
    jwt.verify = jest.fn().mockImplementation((token, secret, options, callback) => {
      const err = new Error("JWT verification failed");
      callback(err, null);
    });

    const next = jest.fn();
    await checkJwt(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "mockToken",
      "mockSecret",
      { algorithms: ["HS256"] },
      expect.any(Function)
    );

    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(http.StatusForbidden);
  });

  it("should return 500 if the JWT_SECRET environment variable is not set", async () => {
    // Unset the JWT_SECRET environment variable
    delete process.env.JWT_SECRET;

    const next = jest.fn();
    await checkJwt(req, res, next);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(http.StatusInternalServerError);
  });
});
