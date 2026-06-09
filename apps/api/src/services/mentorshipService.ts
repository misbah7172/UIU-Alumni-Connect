import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/http-error.js";

export class MentorshipService {
  static async getMentors(page = 1, pageSize = 20, search?: string) {
    const skip = (page - 1) * pageSize;
    const where: any = {
      alumniProfile: { is: { mentorshipAvailable: true } },
      verified: true
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { skills: { has: search } },
        { alumniProfile: { is: { company: { contains: search, mode: "insensitive" } } } },
        { alumniProfile: { is: { position: { contains: search, mode: "insensitive" } } } }
      ];
    }

    const [mentors, total] = await Promise.all([
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
      data: mentors,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) }
    };
  }

  static async bookSession(studentId: string, mentorId: string, meetingTime: Date) {
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId },
      include: { alumniProfile: true }
    });

    if (!mentor || !mentor.alumniProfile?.mentorshipAvailable) {
      throw new HttpError(400, "Mentor not available");
    }

    const session = await prisma.mentorshipSession.create({
      data: {
        studentId,
        mentorId,
        meetingTime,
        status: "PENDING"
      },
      include: { mentor: true, student: true }
    });

    return session;
  }

  static async getUserSessions(userId: string, role: "STUDENT" | "ALUMNI", page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;

    const where: any = role === "STUDENT" ? { studentId: userId } : { mentorId: userId };

    const [sessions, total] = await Promise.all([
      prisma.mentorshipSession.findMany({
        where,
        include: { mentor: true, student: true },
        skip,
        take: pageSize,
        orderBy: { meetingTime: "asc" }
      }),
      prisma.mentorshipSession.count({ where })
    ]);

    return {
      data: sessions,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) }
    };
  }

  static async updateSessionStatus(sessionId: string, userId: string, status: "ACCEPTED" | "REJECTED" | "COMPLETED") {
    const session = await prisma.mentorshipSession.findUnique({ where: { id: sessionId } });

    if (!session) {
      throw new HttpError(404, "Session not found");
    }

    if (session.mentorId !== userId) {
      throw new HttpError(403, "Only mentor can update session status");
    }

    const updated = await prisma.mentorshipSession.update({
      where: { id: sessionId },
      data: { status },
      include: { mentor: true, student: true }
    });

    return updated;
  }
}
