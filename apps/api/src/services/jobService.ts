import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/http-error.js";

export class JobService {
  static async createJob(alumniId: string, data: any) {
    const job = await prisma.job.create({
      data: {
        alumniId,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        description: data.description,
        requiredSkills: data.requiredSkills || [],
        salaryRange: data.salaryRange,
        location: data.location,
        employmentType: data.employmentType,
        applyLink: data.applyLink,
        referralAvailable: data.referralAvailable || false,
        deadline: data.deadline
      },
      include: { alumni: true }
    });

    return job;
  }

  static async getJobs(
    page = 1,
    pageSize = 20,
    filters?: {
      employmentType?: string;
      location?: string;
      skills?: string[];
      search?: string;
      referralAvailable?: boolean;
    }
  ) {
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (filters?.employmentType) {
      where.employmentType = filters.employmentType;
    }
    if (filters?.location) {
      where.location = { contains: filters.location, mode: "insensitive" };
    }
    if (filters?.skills && filters.skills.length > 0) {
      where.requiredSkills = { hasSome: filters.skills };
    }
    if (filters?.search) {
      where.OR = [
        { companyName: { contains: filters.search, mode: "insensitive" } },
        { jobTitle: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } }
      ];
    }
    if (filters?.referralAvailable) {
      where.referralAvailable = true;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { alumni: true },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      prisma.job.count({ where })
    ]);

    return {
      data: jobs,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    };
  }

  static async getJobById(jobId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { alumni: true }
    });

    if (!job) {
      throw new HttpError(404, "Job not found");
    }

    return job;
  }

  static async updateJob(jobId: string, alumniId: string, data: any) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      throw new HttpError(404, "Job not found");
    }

    if (job.alumniId !== alumniId) {
      throw new HttpError(403, "Not authorized to update this job");
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: {
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        description: data.description,
        requiredSkills: data.requiredSkills,
        salaryRange: data.salaryRange,
        location: data.location,
        employmentType: data.employmentType,
        applyLink: data.applyLink,
        referralAvailable: data.referralAvailable,
        deadline: data.deadline
      },
      include: { alumni: true }
    });

    return updated;
  }

  static async deleteJob(jobId: string, alumniId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      throw new HttpError(404, "Job not found");
    }

    if (job.alumniId !== alumniId) {
      throw new HttpError(403, "Not authorized to delete this job");
    }

    await prisma.job.delete({ where: { id: jobId } });

    return { message: "Job deleted successfully" };
  }
}
