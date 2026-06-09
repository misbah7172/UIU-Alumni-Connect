import { HttpError } from "./http-error.js";

describe("HttpError", () => {
  it("keeps status, message, and details together", () => {
    const error = new HttpError(403, "Insufficient permissions", { role: "STUDENT" });

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("Insufficient permissions");
    expect(error.details).toEqual({ role: "STUDENT" });
  });
});
