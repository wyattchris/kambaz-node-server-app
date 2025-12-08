import QuizAttemptsDao from "./dao.js";

export default function QuizAttemptsRoutes(app) {
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
        const attemptData = {
            ...req.body,
            startedAt: req.body.startedAt || new Date(),
        };
        const newAttempt = await dao.createAttempt(quizId, currentUser._id, attemptData);
        res.json(newAttempt);
    };

    const updateAttempt = async (req, res) => {
        const { attemptId } = req.params;
        const updates = req.body;
        const status = await dao.updateAttempt(attemptId, updates);
        if (status.modifiedCount > 0) {
            if (updates.submittedAt) {
                await dao.calculateScore(attemptId);
            }
            const updatedAttempt = await dao.findAttemptById(attemptId);
            res.json(updatedAttempt);
        } else {
            res.sendStatus(404);
        }
    };

    app.get("/api/quizzes/:quizId/attempts/current", findAttemptsForCurrentUser);
    app.get("/api/attempts/:attemptId", findAttemptById);
    app.post("/api/quizzes/:quizId/attempts", createAttempt);
    app.put("/api/attempts/:attemptId", updateAttempt);
}

