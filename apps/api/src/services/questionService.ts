import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/http-error.js";

export class QuestionService {
  static async createQuestion(studentId: string, data: any) {
    const question = await prisma.question.create({
      data: {
        studentId,
        title: data.title,
        body: data.body,
        tags: data.tags
      },
      include: { student: true, answers: { include: { user: true } } }
    });

    return question;
  }

  static async getQuestions(page = 1, pageSize = 20, search?: string, tags?: string[]) {
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { body: { contains: search, mode: "insensitive" } }
      ];
    }
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: { student: true, answers: { include: { user: true } } },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      prisma.question.count({ where })
    ]);

    return {
      data: questions,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) }
    };
  }

  static async getQuestionById(questionId: string) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        student: true,
        answers: {
          include: { user: true },
          orderBy: [{ accepted: "desc" }, { upvotes: "desc" }]
        }
      }
    });

    if (!question) {
      throw new HttpError(404, "Question not found");
    }

    return question;
  }

  static async createAnswer(questionId: string, userId: string, answerBody: string) {
    const question = await prisma.question.findUnique({ where: { id: questionId } });

    if (!question) {
      throw new HttpError(404, "Question not found");
    }

    const answer = await prisma.answer.create({
      data: {
        questionId,
        userId,
        answerBody
      },
      include: { user: true, question: true }
    });

    return answer;
  }

  static async upvoteAnswer(answerId: string, userId: string) {
    const answer = await prisma.answer.findUnique({ where: { id: answerId } });

    if (!answer) {
      throw new HttpError(404, "Answer not found");
    }

    const updated = await prisma.answer.update({
      where: { id: answerId },
      data: { upvotes: { increment: 1 } },
      include: { user: true }
    });

    return updated;
  }

  static async markAnswerAsAccepted(questionId: string, answerId: string, studentId: string) {
    const question = await prisma.question.findUnique({ where: { id: questionId } });

    if (!question) {
      throw new HttpError(404, "Question not found");
    }

    if (question.studentId !== studentId) {
      throw new HttpError(403, "Only question author can accept answers");
    }

    await prisma.answer.updateMany({ where: { questionId }, data: { accepted: false } });

    const answer = await prisma.answer.update({
      where: { id: answerId },
      data: { accepted: true },
      include: { user: true }
    });

    return answer;
  }
}
