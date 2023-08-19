const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const projectsRouter = require('./projects.routes')
const tasksRouter = require('./tasks.routes')
// protocolos de datos que pueden viajar por http:
// * XML
// * JSON
// * protobuffers

router.use('/projects', isAuthenticated, projectsRouter)
router.use('/tasks', isAuthenticated, tasksRouter)

module.exports = router;
