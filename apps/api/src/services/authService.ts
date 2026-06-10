import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { firebaseAdminAuth } from "../config/firebase-admin.js";
import { HttpError } from "../utils/http-error.js";

export interface AuthUser {
  id: string;
  email: string;
  role: "STUDENT" | "ALUMNI" | "ADMIN" | "RECRUITER";
}

export class AuthService {
  static readonly allowedEmailDomain = "uiu.ac.bd";

  static generateJWT(user: AuthUser): string {
    return jwt.sign(user, env.JWT_SECRET, { expiresIn: "7d" });
  }

  static isAllowedEmail(email: string) {
    return email.toLowerCase().endsWith(`@${this.allowedEmailDomain}`);
  }

  static async loginWithFirebase(idToken: string): Promise<{ user: any; token: string }> {
    const decoded = await firebaseAdminAuth.verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase();

    if (!email || !decoded.email_verified) {
      throw new HttpError(401, "A verified Google email is required");
    }

    if (!this.isAllowedEmail(email)) {
      throw new HttpError(403, `Only ${this.allowedEmailDomain} emails are allowed`);
    }

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: decoded.name || email.split("@")[0],
        profileImage: decoded.picture,
        role: "STUDENT",
        verified: true,
        studentProfile: {
          create: {}
        }
      },
      update: {
        name: decoded.name || undefined,
        profileImage: decoded.picture || undefined,
        verified: true
      }
    });

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
