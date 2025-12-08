import mongoose from "mongoose";
import { QUESTION_TYPE_VALUES } from "./constants.js";

const questionSchema = new mongoose.Schema({
    _id: String,
    title: String,
    points: Number,
    question: String, 
    type: {
        type: String,
        enum: QUESTION_TYPE_VALUES,
        required: true,
    },
    choices: [{ // For Multiple Choice
        _id: String,
        text: String,
        isCorrect: Boolean,
    }],
    correctAnswer: Boolean, // For True/False
    possibleAnswers: [String], // For Fill in the Blank (case-insensitive)
}, { _id: false });

// Main Quiz schema
const quizSchema = new mongoose.Schema({
    _id: String,
    title: String,
    description: String, 
    course: { type: String, ref: "CourseModel" },
    published: { type: Boolean, default: false },
    points: { type: Number, default: 0 }, // Sum of all question points, auto-calculated
    
    // Quiz Configuration
    quizType: {
        type: String,
        enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
        default: "Graded Quiz",
    },
    assignmentGroup: {
        type: String,
        enum: ["Quizzes", "Exams", "Assignments", "Project"],
        default: "Quizzes",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: String, // "Immediately", "After Due Date", "Never", etc.
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    
    dueDate: Date,
    availableDate: Date,
    availableUntilDate: Date,
    
    questions: [questionSchema],
}, { collection: "quizzes" });

export default quizSchema;

