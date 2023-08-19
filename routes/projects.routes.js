// resolucion de dependencias

// AMD
// UMD
// common js
// los keywords import y export ESM o ES Modules

const { Router } = require('express');
const { 
    getAllProjects,
    createProject,
    getOneProject,
    updateProject,
    deleteProject 
} = require('../controllers/projects.controller');

const router = Router();

// /api/projects
router.get('/', getAllProjects)
router.post('/', createProject)

// /api/projects/projectsId
router.get('/:projectsId', getOneProject)
router.put('/:projectsId', updateProject)
router.delete('/:projectsId', deleteProject)



module.exports = router