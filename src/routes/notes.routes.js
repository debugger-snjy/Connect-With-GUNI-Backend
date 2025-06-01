
// Importing the express Package
import { Router } from 'express';

// Create a router of the express
const notesRouter = Router()

// Importing the express-validator
import { body } from 'express-validator';
import { fetchAllNotes, addNote, deleteNote, updateNote } from '../controllers/notes.controller.js';
import { fetchUser } from '../middleware/auth.middleware.js';

// Route 1 : Fetching all the Notes of the User using GET Request "/fetchallnotes"
// Here, Login is Required ==> Middleware needed
notesRouter.get('/fetchallnotes', fetchUser, fetchAllNotes)

// Route 2 : Adding Notes in the database using POST Request "/addnote"
// Here, Login is Required ==> Middleware needed
notesRouter.post('/add', fetchUser, [
    body("title", "Title can't be Empty !").exists(),
    body("description", "Description can't be Empty !").exists(),
    body("description", "Description can't be Empty !").isLength({ min: 5 })
], addNote)

// Route 3 : Updating an existing Note in the database using PUT Request "/updatenote"
// Here, Login is Required ==> Middleware needed
// Also, the user could update his/her note only so for that we have to check for the user as well
notesRouter.put('/update/:id', fetchUser, [
    body("title", "Title can't be Empty !").notEmpty(),
    body("description", "Description can't be Empty !").notEmpty(),
    body("description", "Description should have minimum of 5 Letters !").isLength({ min: 5 })
], updateNote)

// Route 4 : Deleting an existing Note in the database using DELETE Request "/deletenote"
// Here, Login is Required ==> Middleware needed
// Also, the user could delete his/her note only so for that we have to check for the user as well
notesRouter.delete('/delete/:id', fetchUser, deleteNote);

export default notesRouter;