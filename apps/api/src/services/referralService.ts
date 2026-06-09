import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/http-error.js";

export class ReferralService {
  static async requestReferral(studentId: string, alumniId: string, jobId: string, message: string) {
    const referral = await prisma.referral.create({
      data: {
        studentId,
        alumniId,
        jobId,
        message,
        status: "PENDING"
      },
      include: { student: true, alumni: true, job: true }
    });

    return referral;
  }

  static async getReferralsSent(studentId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;

    const [referrals, total] = await Promise.all([
      prisma.referral.findMany({
        where: { studentId },
        include: { alumni: true, job: true },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      prisma.referral.count({ where: { studentId } })
    ]);

    return {
      data: referrals,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) }
    };
  }

  static async getReferralsReceived(alumniId: string, page = 1, pageSize = 20, status?: string) {
    const skip = (page - 1) * pageSize;

    const where: any = { alumniId };
    if (status) where.status = status;

    const [referrals, total] = await Promise.all([
      prisma.referral.findMany({
        where,
        include: { student: true, job: true },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      prisma.referral.count({ where })
    ]);

    return {
      data: referrals,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) }
    };
  }

  static async updateReferralStatus(referralId: string, alumniId: string, status: "ACCEPTED" | "REJECTED") {
    const referral = await prisma.referral.findUnique({ where: { id: referralId } });

    if (!referral) {
      throw new HttpError(404, "Referral not found");
    }

    if (referral.alumniId !== alumniId) {
      throw new HttpError(403, "Not authorized to update this referral");
    }

    const updated = await prisma.referral.update({
      where: { id: referralId },
      data: { status },
      include: { student: true, alumni: true }
    });

    return updated;
  }
}
