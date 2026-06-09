import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/http-error.js";

export class UserService {
  static async getUserById(userId: string) {
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

  static async listAlumni(page = 1, pageSize = 20, department?: string) {
    const skip = (page - 1) * pageSize;

    const where: any = {
      role: { in: ["ALUMNI", "RECRUITER"] },
      verified: true
    };

    if (department) {
      where.department = department;
    }

    const [alumni, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { alumniProfile: true },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      prisma.user.count({ where })
    ]);

    return {
      data: alumni,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    };
  }

  static async updateProfile(userId: string, data: any) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        bio: data.bio,
        profileImage: data.profileImage,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        skills: data.skills || undefined
      },
      include: {
        studentProfile: true,
        alumniProfile: true
      }
    });

    if (data.resumeUrl || data.portfolioUrl) {
      await prisma.studentProfile.upsert({
        where: { userId },
        create: {
          userId,
          resumeUrl: data.resumeUrl,
          portfolioUrl: data.portfolioUrl
        },
        update: {
          resumeUrl: data.resumeUrl,
          portfolioUrl: data.portfolioUrl
        }
      });
    }

    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        alumniProfile: true
      }
    });
  }

  static async getStudentsBySkills(skills: string[], limit = 20) {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        skills: {
          hasSome: skills
        }
      },
      include: { studentProfile: true },
      take: limit
    });

    return students;
  }

  static async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const [answerCount, questionCount] = await Promise.all([
      prisma.answer.count({ where: { userId } }),
      prisma.question.count({ where: { studentId: userId } })
    ]);

    return {
      userId,
      reputationPoints: user.reputationPoints,
      questionsAsked: questionCount,
      answersGiven: answerCount,
      verified: user.verified
    };
  }
}
