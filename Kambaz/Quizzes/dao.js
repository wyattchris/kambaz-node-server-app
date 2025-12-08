import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizzesDao() {
    function findQuizzesForCourse(courseId) {
        return model.find({ course: courseId });
    }

    function findQuizById(quizId) {
        return model.findById(quizId);
    }

    function createQuiz(courseId, quiz) {
        const newQuiz = {
            ...quiz,
            _id: uuidv4(),
            course: courseId,
            questions: quiz.questions || [],
        };
        if (newQuiz.questions.length > 0) {
            newQuiz.points = newQuiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
        } else {
            newQuiz.points = 0;
        }
        return model.create(newQuiz);
    }

    function updateQuiz(quizId, quizUpdates) {
        return model.updateOne({ _id: quizId }, { $set: quizUpdates });
    }

    function deleteQuiz(quizId) {
        return model.deleteOne({ _id: quizId });
    }

    function publishQuiz(quizId, published) {
        return model.updateOne({ _id: quizId }, { $set: { published } });
    }

    async function addQuestion(quizId, question) {
        const newQuestion = { ...question, _id: uuidv4() };
        const quiz = await model.findById(quizId);
        quiz.questions.push(newQuestion);
        quiz.points = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
        await quiz.save();
        return newQuestion;
    }

    async function updateQuestion(quizId, questionId, questionUpdates) {
        const quiz = await model.findById(quizId);
        const question = quiz.questions.id(questionId);
        Object.assign(question, questionUpdates);
        quiz.points = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
        await quiz.save();
        return question;
    }

    async function deleteQuestion(quizId, questionId) {
        const quiz = await model.findById(quizId);
        quiz.questions.pull({ _id: questionId });
        quiz.points = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
        await quiz.save();
        return quiz;
    }

    return {
        findQuizzesForCourse,
        findQuizById,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        publishQuiz,
        addQuestion,
        updateQuestion,
        deleteQuestion,
    };
}

