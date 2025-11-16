import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);

    const enrollUserInCourse = (req, res) => {
        const { userId, courseId } = req.body;
        const enrollment = dao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    };

    const unenrollUserFromCourse = (req, res) => {
        const { enrollmentId } = req.params;
        dao.unenrollUserFromCourse(enrollmentId);
        res.sendStatus(200);
    };

    const findEnrollmentsByUser = (req, res) => {
        const { userId } = req.params;
        const enrollments = dao.findEnrollmentsByUser(userId);
        res.json(enrollments);
    };

    app.post("/api/enrollments", enrollUserInCourse);
    app.delete("/api/enrollments/:enrollmentId", unenrollUserFromCourse);
    app.get("/api/users/:userId/enrollments", findEnrollmentsByUser);
}

