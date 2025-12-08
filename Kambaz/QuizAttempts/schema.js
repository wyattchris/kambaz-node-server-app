import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: String, 
    // Multiple Choice: String (the choice _id that the student selected)
    // True/False: Boolean
    // Fill in the Blank: String
    answer: mongoose.Schema.Types.Mixed, 
    // Calculated when the attempt is submitted by the backend
    isCorrect: Boolean,
    pointsEarned: Number,
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    student: { type: String, ref: "UserModel" },
    attemptNumber: Number, 
    startedAt: Date,
    submittedAt: Date,
    score: Number, 
    totalPoints: Number,
    answers: [answerSchema],
}, { collection: "quizAttempts" });

export default quizAttemptSchema;

