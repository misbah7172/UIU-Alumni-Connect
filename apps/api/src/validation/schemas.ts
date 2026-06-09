import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20)
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  profileImage: z.string().url().optional(),
  resumeUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  skills: z.array(z.string()).optional()
});

export const createJobSchema = z.object({
  companyName: z.string().min(2),
  jobTitle: z.string().min(3),
  description: z.string().min(20),
  requiredSkills: z.array(z.string().min(1)).default([]),
  salaryRange: z.string().optional(),
  location: z.string().min(2),
  employmentType: z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME", "CONTRACT"]),
  applyLink: z.string().url().optional(),
  referralAvailable: z.boolean().default(false),
  deadline: z.coerce.date().optional()
});

export const createQuestionSchema = z.object({
  title: z.string().min(10),
  body: z.string().min(20),
  tags: z.array(z.string().min(1)).min(1)
});

export const createAnswerSchema = z.object({
  answerBody: z.string().min(20)
});

export const referralRequestSchema = z.object({
  alumniId: z.string().uuid(),
  jobId: z.string().uuid(),
  message: z.string().min(20).max(1000)
});

export const mentorshipRequestSchema = z.object({
  mentorId: z.string().uuid(),
  meetingTime: z.coerce.date()
});
