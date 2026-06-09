import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export interface AuthUser {
  id: string;
  email: string;
  role: "STUDENT" | "ALUMNI" | "ADMIN" | "RECRUITER";
}

export class AuthService {
  static generateJWT(user: AuthUser): string {
    return jwt.sign(user, env.JWT_SECRET, { expiresIn: "7d" });
  }

  static async register(
    email: string,
    password: string,
    name: string,
    role: "STUDENT" | "ALUMNI" | "RECRUITER" = "STUDENT",
    department?: string,
    batch?: string
  ): Promise<{ user: any; token: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new HttpError(409, "User with this email already exists");
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        department,
        batch,
        verified: role === "RECRUITER" ? true : false
      }
    });

    // Create profile based on role
    if (role === "STUDENT") {
      await prisma.studentProfile.create({
        data: { userId: user.id }
      });
    } else if (role === "ALUMNI" || role === "RECRUITER") {
      await prisma.alumniProfile.create({
        data: { userId: user.id }
      });
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = this.generateJWT(authUser);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        batch: user.batch,
        verified: user.verified
      },
      token
    };
  }

  static async login(email: string): Promise<{ user: any; token: string }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new HttpError(401, "Invalid email or user not found");
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = this.generateJWT(authUser);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        batch: user.batch,
        verified: user.verified,
        reputationPoints: user.reputationPoints,
        profileImage: user.profileImage
      },
      token
    };
  }

  static async validateToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
      return decoded;
    } catch {
      throw new HttpError(401, "Invalid or expired token");
    }
  }

  static async getUserById(userId: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        alumniProfile: true
      }
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return user;
  }

  static async updateProfile(userId: string, data: any): Promise<any> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        bio: data.bio,
        profileImage: data.profileImage,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        skills: data.skills
      },
      include: {
        studentProfile: true,
        alumniProfile: true
      }
    });

    return user;
  }
}
