import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app) {
    const dao = AssignmentsDao();

    const findAssignmentsForCourse = async (req, res) => {
        const { courseId } = req.params;
        const assignments = await dao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    };

    const findAllAssignments = async (req, res) => {
        const assignments = await dao.findAllAssignments();
        res.json(assignments);
    };

    const findAssignmentById = async (req, res) => {
        const { assignmentId } = req.params;
        const assignment = await dao.findAssignmentById(assignmentId);
        if (assignment) {
            res.json(assignment);
        } else {
            res.sendStatus(404);
        }
    };

    const createAssignmentForCourse = async (req, res) => {
        const { courseId } = req.params;
        const assignment = {
            ...req.body,
            course: courseId,
        };
        const newAssignment = await dao.createAssignment(assignment);
        res.json(newAssignment);
    };

    const deleteAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        await dao.deleteAssignment(assignmentId);
        res.sendStatus(200);
    };

    const updateAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
        if (status.modifiedCount > 0) {
            const updatedAssignment = await dao.findAssignmentById(assignmentId);
            res.json(updatedAssignment);
        } else {
            res.sendStatus(404);
        }
    };

    app.get("/api/assignments", findAllAssignments);
    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.get("/api/assignments/:assignmentId", findAssignmentById);
    app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
    app.put("/api/assignments/:assignmentId", updateAssignment);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
}

