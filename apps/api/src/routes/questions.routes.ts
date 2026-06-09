import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { QuestionService } from "../services/questionService.js";
import { createAnswerSchema, createQuestionSchema, paginationSchema } from "../validation/schemas.js";

export const questionRouter = Router();

questionRouter.get("/", async (req, res, next) => {
  try {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const search = req.query.search as string | undefined;
    const tags = Array.isArray(req.query.tags) ? (req.query.tags as string[]) : req.query.tags ? [req.query.tags as string] : undefined;
    const result = await QuestionService.getQuestions(page, pageSize, search, tags);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

questionRouter.get("/:questionId", async (req, res, next) => {
  try {
    const question = await QuestionService.getQuestionById(String(req.params.questionId));
    res.json({ question });
  } catch (error) {
    next(error);
  }
});

questionRouter.post("/", requireAuth, validateBody(createQuestionSchema), async (req, res, next) => {
  try {
    const question = await QuestionService.createQuestion(req.user!.id, req.body);
    res.status(201).json({ question });
  } catch (error) {
    next(error);
  }
});

questionRouter.post("/:questionId/answers", requireAuth, validateBody(createAnswerSchema), async (req, res, next) => {
  try {
    const answer = await QuestionService.createAnswer(String(req.params.questionId), req.user!.id, req.body.answerBody);
    res.status(201).json({ answer });
  } catch (error) {
    next(error);
  }
});

questionRouter.post("/:answerId/upvote", requireAuth, async (req, res, next) => {
  try {
    const answer = await QuestionService.upvoteAnswer(String(req.params.answerId), req.user!.id);
    res.json({ answer });
  } catch (error) {
    next(error);
  }
});

questionRouter.patch("/:questionId/answers/:answerId/accept", requireAuth, async (req, res, next) => {
  try {
    const answer = await QuestionService.markAnswerAsAccepted(String(req.params.questionId), String(req.params.answerId), req.user!.id);
    res.json({ answer });
  } catch (error) {
    next(error);
  }
});
