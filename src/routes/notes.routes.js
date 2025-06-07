// Importing the express Package
import { Router } from 'express';

// Create a router of the express
const notesRouter = Router()

// Importing the express-validator
import { body } from 'express-validator';
import { fetchAllNotes, addNote, deleteNote, updateNote } from '../controllers/notes.controller.js';
import { fetchUser } from '../middleware/auth.middleware.js';

// For Fetching all the Notes of the User - GET Request (Login Required)
// Full Route : /api/v1/notes/fetch/all
notesRouter.get('/fetch/all', fetchUser, fetchAllNotes)

// For Adding Notes in the database - POST Request (Login Required)
// Full Route : /api/v1/notes/add
notesRouter.post('/add', fetchUser, [
    body("title", "Title can't be Empty !").exists(),
    body("description", "Description can't be Empty !").exists(),
    body("description", "Description can't be Empty !").isLength({ min: 5 })
], addNote)

// For Updating an existing Note - PUT Request (Login Required)
// Full Route : /api/v1/notes/update/:id
notesRouter.put('/update/:id', fetchUser, [
    body("title", "Title can't be Empty !").notEmpty(),
    body("description", "Description can't be Empty !").notEmpty(),
    body("description", "Description should have minimum of 5 Letters !").isLength({ min: 5 })
], updateNote)

// For Deleting an existing Note - DELETE Request (Login Required)
// Full Route : /api/v1/notes/delete/:id
notesRouter.delete('/delete/:id', fetchUser, deleteNote);

export default notesRouter;