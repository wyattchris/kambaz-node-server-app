import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
    function enrollUserInCourse(userId, courseId) {
        const { enrollments } = db;
        const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
        enrollments.push(newEnrollment);
        return newEnrollment;
    }

    function unenrollUserFromCourse(enrollmentId) {
        const { enrollments } = db;
        const index = enrollments.findIndex((e) => e._id === enrollmentId);
        if (index !== -1) {
            enrollments.splice(index, 1);
        }
    }

    function findEnrollmentsByUser(userId) {
        const { enrollments } = db;
        return enrollments.filter((e) => e.user === userId);
    }

    return {
        enrollUserInCourse,
        unenrollUserFromCourse,
        findEnrollmentsByUser,
    };
}

