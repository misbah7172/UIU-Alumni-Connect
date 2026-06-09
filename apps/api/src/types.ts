export type Role = "STUDENT" | "ALUMNI" | "ADMIN" | "RECRUITER";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
