import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import quizModel from "../Quizzes/model.js";
import { QUESTION_TYPES } from "../Quizzes/constants.js";

export default function QuizAttemptsDao() {
    function findAttemptsForStudent(quizId, studentId) {
        return model.find({ quiz: quizId, student: studentId }).sort({ attemptNumber: -1 });
    }

    function findAttemptById(attemptId) {
        return model.findById(attemptId);
    }

    async function createAttempt(quizId, studentId, attemptData) {
        const quiz = await quizModel.findById(quizId);
        const existingAttempts = await model.find({ quiz: quizId, student: studentId });
        const nextAttemptNumber = existingAttempts.length + 1;

        const newAttempt = {
            _id: uuidv4(),
            quiz: quizId,
            student: studentId,
            attemptNumber: nextAttemptNumber,
            startedAt: attemptData.startedAt || new Date(),
            submittedAt: attemptData.submittedAt || null,
            score: 0,
            totalPoints: quiz.points,
            answers: attemptData.answers || [],
        };

        if (newAttempt.submittedAt) {
            newAttempt.score = calculateScoreForAttempt(newAttempt, quiz);
        }

        return model.create(newAttempt);
    }

    async function updateAttempt(attemptId, updates) {
        const attempt = await model.findById(attemptId);
        
        if (updates.submittedAt && !attempt.submittedAt) {
            const quiz = await quizModel.findById(attempt.quiz);
            const updatedAttempt = { ...attempt.toObject(), ...updates };
            updates.score = calculateScoreForAttempt(updatedAttempt, quiz);
            updates.answers = updatedAttempt.answers;
        }

        return model.updateOne({ _id: attemptId }, { $set: updates });
    }

    async function calculateScore(attemptId) {
        const attempt = await model.findById(attemptId);
        const quiz = await quizModel.findById(attempt.quiz);
        const attemptObj = attempt.toObject();
        const score = calculateScoreForAttempt(attemptObj, quiz);
        await model.updateOne(
            { _id: attemptId },
            { $set: { score, answers: attemptObj.answers } }
        );
        return score;
    }

    function calculateScoreForAttempt(attempt, quiz) {
        let totalScore = 0;

        attempt.answers.forEach((answer) => {
            const question = quiz.questions.id(answer.questionId);
            if (!question) return;

            let isCorrect = false;
            let pointsEarned = 0;

            switch (question.type) {
                case QUESTION_TYPES.MULTIPLE_CHOICE:
                    const choice = question.choices.id(answer.answer);
                    isCorrect = choice && choice.isCorrect;
                    break;
                case QUESTION_TYPES.TRUE_FALSE:
                    isCorrect = answer.answer === question.correctAnswer;
                    break;
                case QUESTION_TYPES.FILL_IN_BLANK:
                    const studentAnswer = String(answer.answer).trim().toLowerCase();
                    isCorrect = question.possibleAnswers.some(
                        (correctAnswer) => correctAnswer.trim().toLowerCase() === studentAnswer
                    );
                    break;
            }

            if (isCorrect) {
                pointsEarned = question.points || 0;
            }

            answer.isCorrect = isCorrect;
            answer.pointsEarned = pointsEarned;
            totalScore += pointsEarned;
        });

        return totalScore;
    }

    return {
        findAttemptsForStudent,
        findAttemptById,
        createAttempt,
        updateAttempt,
        calculateScore,
    };
}

