import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: String, 
    // MC: String (the choice _id that the student selected)
    // T/F: Boolean answer
    // FIB: String answer
    answer: mongoose.Schema.Types.Mixed, 
    // calculated when the attempt is submitted by the backend
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

