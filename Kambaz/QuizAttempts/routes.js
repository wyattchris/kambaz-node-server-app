import QuizAttemptsDao from "./dao.js";
import QuizzesDao from "../Quizzes/dao.js";

export default function QuizAttemptsRoutes(app) {
    const quizzesDao = QuizzesDao();
    const dao = QuizAttemptsDao();

    const findAttemptsForCurrentUser = async (req, res) => {
        const { quizId } = req.params;
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const attempts = await dao.findAttemptsForStudent(quizId, currentUser._id);
        res.json(attempts);
    };

    const findAttemptById = async (req, res) => {
        const { attemptId } = req.params;
        const attempt = await dao.findAttemptById(attemptId);
        if (attempt) {
            res.json(attempt);
        } else {
            res.sendStatus(404);
        }
    };

    const createAttempt = async (req, res) => {
        const { quizId } = req.params;
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const quiz = await quizzesDao.findQuizById(quizId);
        if (!quiz) {
            res.sendStatus(404);
            return;
        }
        const attemptData = {
            ...req.body,
            startedAt: req.body.startedAt || new Date(),
        };
        const newAttempt = await dao.createAttempt(quiz, currentUser._id, attemptData);
        res.json(newAttempt);
    };

    app.get("/api/quizzes/:quizId/attempts/current", findAttemptsForCurrentUser);
    app.get("/api/attempts/:attemptId", findAttemptById);
    app.post("/api/quizzes/:quizId/attempts", createAttempt);
}

