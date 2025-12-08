import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
    const dao = QuizzesDao();

    const findQuizzesForCourse = async (req, res) => {
        const { courseId } = req.params;
        const quizzes = await dao.findQuizzesForCourse(courseId);
        res.json(quizzes);
    };

    const findQuizById = async (req, res) => {
        const { quizId } = req.params;
        const quiz = await dao.findQuizById(quizId);
        if (quiz) {
            res.json(quiz);
        } else {
            res.sendStatus(404);
        }
    };

    const createQuizForCourse = async (req, res) => {
        const { courseId } = req.params;
        const quiz = {
            ...req.body,
            course: courseId,
        };
        const newQuiz = await dao.createQuiz(courseId, quiz);
        res.json(newQuiz);
    };

    const updateQuiz = async (req, res) => {
        const { quizId } = req.params;
        const quiz = await dao.findQuizById(quizId);
        if (!quiz) {
            res.sendStatus(404);
            return;
        }
        const quizUpdates = req.body;
        const status = await dao.updateQuiz(quizId, quizUpdates);
        const updatedQuiz = await dao.findQuizById(quizId);
        res.json(updatedQuiz);
    };

    const deleteQuiz = async (req, res) => {
        const { quizId } = req.params;
        await dao.deleteQuiz(quizId);
        res.sendStatus(200);
    };

    const publishQuiz = async (req, res) => {
        const { quizId } = req.params;
        const quiz = await dao.findQuizById(quizId);
        if (!quiz) {
            res.sendStatus(404);
            return;
        }
        const { published } = req.body;
        await dao.publishQuiz(quizId, published);
        const updatedQuiz = await dao.findQuizById(quizId);
        res.json(updatedQuiz);
    };

    const getQuestionsForQuiz = async (req, res) => {
        const { quizId } = req.params;
        const quiz = await dao.findQuizById(quizId);
        if (quiz) {
            res.json(quiz.questions);
        } else {
            res.sendStatus(404);
        }
    };

    const addQuestionToQuiz = async (req, res) => {
        const { quizId } = req.params;
        const question = {
            ...req.body,
        };
        const newQuestion = await dao.addQuestion(quizId, question);
        res.json(newQuestion);
    };

    const updateQuestion = async (req, res) => {
        const { quizId, questionId } = req.params;
        const questionUpdates = req.body;
        const updatedQuestion = await dao.updateQuestion(quizId, questionId, questionUpdates);
        res.json(updatedQuestion);
    };

    const deleteQuestion = async (req, res) => {
        const { quizId, questionId } = req.params;
        await dao.deleteQuestion(quizId, questionId);
        res.sendStatus(200);
    };

    // Quiz routes
    app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
    app.get("/api/quizzes/:quizId", findQuizById);
    app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
    app.put("/api/quizzes/:quizId", updateQuiz);
    app.delete("/api/quizzes/:quizId", deleteQuiz);
    app.put("/api/quizzes/:quizId/publish", publishQuiz);

    // Question routes
    app.get("/api/quizzes/:quizId/questions", getQuestionsForQuiz);
    app.post("/api/quizzes/:quizId/questions", addQuestionToQuiz);
    app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
    app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
}

