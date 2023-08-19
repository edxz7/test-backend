const mongoose = require('mongoose');
const Project = require('../models/Project.model');
const Task = require('../models/Task.model')

const getAllProjects = async (req, res, next) => {
    try {
        const projects = await Project
        .find()
        .populate('tasks')
        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json(error)
    }
} 


const createProject = async (req, res, next) => {
    const { title, description } = req.body;
    try {
        const newProject = await Project.create({title, description, tasks: []})
        res.status(201).json(newProject)
    } catch (error) {
        res.status(500).json(error)
    }
}


const getOneProject = async (req, res, next) => {
    const { projectsId } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(projectsId)) {
            res.status(400).json({ message: 'El id que mandaste no es valido'})
            return
        }
        const project = await Project.findById(projectsId)
        .populate('tasks')

        res.status(200).json(project)
    } catch (error) {
        res.status(500).json(error)
    }
}
// postgresDB es de tipo SQL (structure query language) 
// OracleDB es de tipo SQL,
// MySQL 
// El ORM (que es el equivalente a el ODM que usamos para Mongo) mas
// popular para node se llama TypeORM
const updateProject = async (req, res, next) => {
    const { projectsId } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(projectsId)) {
            res.status(400).json({ message: 'El id que mandaste no es valido'})
            return
        }
        const updatedProject = await Project.findByIdAndUpdate(projectsId, req.body, { new: true} )        
        res.status(200).json(updatedProject)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteProject = async (req, res, next) => {
    const { projectsId } = req.params;    
    try {
        if(!mongoose.Types.ObjectId.isValid(projectsId)) {
            res.status(400).json({ message: 'El id que mandaste no es valido'})
            return
        }

        // const tasks = (await Project.findById(projectsId)).tasks

        const tasks = (await Project.findByIdAndRemove(projectsId)).tasks
        console.log('tasks: ',tasks);
        for (const taskId of tasks) {
            await Task.findByIdAndRemove(taskId)
        }
        res.status(200).json({ message: `El proyecto con id ${projectsId} fue eliminado con exito` })
    } catch (error) {
        res.status(500).json(error)
    }}


module.exports = {
    getAllProjects,
    createProject,
    getOneProject,
    updateProject,
    deleteProject
};