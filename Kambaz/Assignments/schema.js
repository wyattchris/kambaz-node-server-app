import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
        _id: String,
        title: String,
        course: { type: String, ref: "CourseModel" },
        description: String,
        points: Number,
        availableFrom: Date,
        availableUntil: Date,
        due: Date,
},
    { collection: "assignments" }
);

export default assignmentSchema;

