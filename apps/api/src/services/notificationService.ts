import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/http-error.js";

export class NotificationService {
  static async createNotification(userId: string, type: string, message: string, relatedId?: string) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: type as any,
        message,
        readStatus: false
      }
    });

    return notification;
  }

  static async getUserNotifications(userId: string, page = 1, pageSize = 20, unreadOnly = false) {
    const skip = (page - 1) * pageSize;

    const where: any = { userId };
    if (unreadOnly) where.readStatus = false;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      prisma.notification.count({ where })
    ]);

    return {
      data: notifications,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) }
    };
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });

    if (!notification || notification.userId !== userId) {
      throw new HttpError(404, "Notification not found");
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { readStatus: true }
    });

    return updated;
  }

  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, readStatus: false },
      data: { readStatus: true }
    });

    return { message: "All notifications marked as read" };
  }

  static async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });

    if (!notification || notification.userId !== userId) {
      throw new HttpError(404, "Notification not found");
    }

    await prisma.notification.delete({ where: { id: notificationId } });

    return { message: "Notification deleted" };
  }
}

export class AdminService {
  static async verifyUser(userId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { verified: true }
    });

    return user;
  }

  static async getAnalytics() {
    const [totalUsers, totalJobs, totalQuestions, totalReferrals] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.question.count(),
      prisma.referral.count()
    ]);

    const roleBreakdown = await prisma.user.groupBy({
      by: ["role"],
      _count: true
    });

    return {
      totalUsers,
      totalJobs,
      totalQuestions,
      totalReferrals,
      roleBreakdown
    };
  }
}
