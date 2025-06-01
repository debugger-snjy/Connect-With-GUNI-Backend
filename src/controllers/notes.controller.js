// Importing the Validation Result from express-validator
import { validationResult } from "express-validator";

// Importing the Notes Model
import Notes from "../models/notes.model.js";

// Importing the Async Promise Handler Utility
import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js";
import { APIResponse } from "../utils/apiResponse.js";
import { APIError } from "../utils/apiError.js";

// Fetching all the Notes of the User
const fetchAllNotes = asyncPromiseHandler(
    async (req, res) => {
        try {
            // Finding all the notes 
            // Also to be specific, we have to add the user in the parameter to find notes of only that user
            const notes = await Notes.find({ user: req.user.id });
            res.status(200).json(new APIResponse(200, notes, "Notes Fetched Successfully"));
        } catch (error) {
            return res.status(500).json(new APIError(500, "Internal Server Error !", error.message));
        }
    }
);

// Adding a Note in the database
const addNote = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "";

        try {
            console.log("Here, You can Add Note Here !")

            // Getting the Results after validations
            const errors = validationResult(req);

            // If we have errors, sending bad request with errors
            if (!errors.isEmpty()) {

                // Setting up the parameters
                msg = "Note Not Added Successfully"

                // sending the errors that are present
                return res.status(400).json(new APIError(400, msg, errors.array()));
            }

            // If no errors are present or found

            // Destructing Data from body
            const { title, description, tags } = req.body;

            // TODO : Add user id through Middleware (student/faculty)
            // Creating a Note 
            const note = new Notes({ title, description, tags, user: req.user.id })

            // Saving note in database
            const savedNote = await note.save();

            // Setting up the parameters
            msg = "Note Added Successfully"

            // returning the saved note Details
            return res.status(200).json(new APIResponse(200, savedNote, msg));
        }
        catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)

            // Setting up the parameters
            msg = "Note Not Added Successfully"
            return res.status(500).json(new APIError(500, msg, error.message));
        }

    }
);

// Updating an existing Note in the database
const updateNote = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "";

        try {
            // Getting the Results after validations
            const errors = validationResult(req);

            // If we have errors, sending bad request with errors
            if (!errors.isEmpty()) {

                // Setting up the parameters
                msg = "Note Not Updated Successfully"

                // sending the errors that are present
                return res.status(400).json(new APIError(400, msg, errors.array()));
            }

            // If no errors are present or found
            const { title, description, tags } = req.body;

            // Create a newNote Object with the new Updated Data 
            const newNote = {
                title: title,
                description: description,
                tags: tags
            }

            // Finding whether the same user who created note is updating or not

            // Finding the note from the database, whether the note exists or not
            // To access the key from the url, we use req.params.<key>
            // Here, we access the id from the url, we use req.params.id
            const note = await Notes.findById(req.params.id);

            // If that note doesn't exists, then returning the Bad Response
            if (!note) {

                // Setting up the parameters
                msg = "Note Not Updated Successfully"

                // return res.status(404).json({ msg: msg, error : "Note Not Found !"})
                return res.status(404).json(new APIError(404, msg, "Note Not Found !"));
            }

            // If note exists in database, then getting its user
            // and then comparing that with the user which has been logged in (From where we get this ?)
            // We will get the id of user which is logged in from the middle ware or from the fetchUser function
            // TODO : Create a user and middleware
            if (note.user.toString() !== req.user.id) {
                // the note don't belong to that user and should not have any right ot update
                // 401 - Unauthorized

                // Setting up the parameters
                msg = "Note Not Updated Successfully"

                // return res.status(401).json({ msg: msg, error : "Access Denied !"})
                return res.status(404).json(new APIError(401, msg, "Access Denied !"));
            }

            // If code is reached here, that's means the note is belong to the user which is logged in and also that note exists
            const updatedNote = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
            // Setting up the parameters
            msg = "Note Updated Successfully"
            return res.json(new APIResponse(200, updatedNote, msg));
        }
        catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)

            // Setting up the parameters
            msg = "Note Not Updated Successfully"

            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);

// Deleting an existing Note in the database
const deleteNote = asyncPromiseHandler(
    async (req, res) => {

        // Making a Variable to track the success or not
        let msg = "";

        try {// Finding whether the same user who created note is deleting or not

            // Finding the note from the database, whether the note exists or not
            // To access the key from the url, we use req.params.<key>
            // Here, we access the id from the url, we use req.params.id
            const note = await Notes.findById(req.params.id);

            // If that note doesn't exists, then returning the Bad Response
            if (!note) {

                // Setting up the parameters
                msg = "Note Not Deleted Successfully"

                return res.status(404).json(new APIError(404, msg, "Note Not Found !"));
                // return res.status(404).json("Note Not Found !");
            }

            // If note exists in database, then getting its user
            // and then comparing that with the user which has been logged in (From where we get this ?)
            // We will get the id of user which is logged in from the middle ware or from the fetchUser function
            // TODO : Add user and middleware
            if (note.user.toString() !== req.user.id) {
                // the note don't belong to that user and should not have any right ot update
                // 401 - Unauthorized

                // Setting up the parameters
                msg = "Note Not Deleted Successfully"

                return res.status(401).json(new APIError(401, msg, "Access Denied !"));
                // return res.status(404).json("Access Denied !");
            }

            // If code is reached here, that's means the note is belong to the user which is logged in and also that note exists
            const deletedNote = await Notes.findByIdAndDelete(req.params.id);

            // Setting up the parameters
            msg = "Note has been Deleted Successfully"

            return res.json(new APIResponse(200, deletedNote, msg));
        }
        catch (error) {
            console.log("Error Occured !")
            console.error("Error : ", error.message)

            // Setting up the parameters
            msg = "Note Not Deleted Successfully, Internal Server Error !"

            return res.status(500).json(new APIError(500, msg, error.message));
        }
    }
);

// Exporting the functions to use in the routes
export { fetchAllNotes, addNote, updateNote, deleteNote };