// This file is used for Operations by Admin

// Importing the express Package
const express = require('express');

// Create a router of the express
const router = express.Router()

// Importing the Student schema from Student Mongoose Model
const Students = require("../models/Student");

// Importing the Subject schema from Subject Mongoose Model
const Subjects = require("../models/Subject");

// Importing the Faculty schema from Faculty Mongoose Model
const Faculties = require("../models/Faculty");

// Importing the Material schema from Material Mongoose Model
const Material = require("../models/Material");

// Importing the notes schema from User Mongoose Model
const Notes = require("../models/Notes");

const Timetable = require("../models/Timetable")

const Marksheet = require("../models/Marksheet")

// Importing the express-validator
const { body, validationResult } = require('express-validator');

// Getting the Middle ware
const fetchUser = require('../middleware/fetchUserId');
const RecentAccessed = require('../models/RecentAccessed');
const Fees = require('../models/Fees');
const Announcement = require('../models/Announcement');

// ===========================================================================================================================================================================
// ----- STUDENT INFO ROUTES ---------- STUDENT INFO ROUTES ---------- STUDENT INFO ROUTES ---------- STUDENT INFO ROUTES ---------- STUDENT INFO ROUTES ---------- STUDENT IN
// ===========================================================================================================================================================================

// For Fetching Student - GET Request
// We get the Id From the cookies or session variables
// Full Route : /api/student/fetch/info
router.get('/fetch/info/', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Student Record has NOT Fetched Successfully";

    try {
        // Finding all the Students 
        const student = await Students.find({ _id: req.body.id });

        if (student.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Student Record has been Fetched Successfully"

            // Printing the Student
            console.log(student)
        }

        return res.json({ status: status, msg: msg, student: student });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// ===========================================================================================================================================================================
// ----- FETCH FACULTY ROUTES ---------- FETCH FACULTY ROUTES ---------- FETCH FACULTY ROUTES ---------- FETCH FACULTY ROUTES ---------- FETCH FACULTY ROUTES ---------- FETCH
// ===========================================================================================================================================================================

// For Fetching Faculty - GET Request
// Full Route : /api/student/fetch/allfaculties
router.get('/fetch/allfaculties', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Faculties Record has NOT Fetched Successfully";

    try {

        // Finding all the Faculties
        const faculties = await Faculties.find()
        let neccessaryFacultyData = {}

        if (faculties.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Faculties Record has been Fetched Successfully"

            // Printing the Faculties 
            console.log(faculties)

            neccessaryFacultyData = faculties.map(faculty => ({
                name: faculty.name,
                phone: faculty.phone,
                email: faculty.email,
                dept: faculty.dept,
                designation: faculty.designation,
                gender: faculty.gender,
                id: faculty.facultyId,
                cabinLocation: faculty.cabinLocation
            }));

            return res.json({ status: status, msg: msg, faculties: neccessaryFacultyData });
        }
        else {

            status = "success";
            msg = "No Faculty Records Found !!"

            return res.json({ status: status, msg: msg });
        }

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// ===========================================================================================================================================================================
// ----- FETCH TIMETABLE ---------- FETCH TIMETABLE ---------- FETCH TIMETABLE ---------- FETCH TIMETABLE ---------- FETCH TIMETABLE ---------- FETCH TIMETABLE ---------- FET
// ===========================================================================================================================================================================

router.post('/fetch/timetable', [

    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("batch", "Your Batch is Required").exists(),

    // Checking other paramaters

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Timetable has NOT Fetched Successfully";

    try {
        // Finding all the Fees 
        const semesterTimetable = await Timetable.find({ sem: req.body.sem, batch: req.body.batch, division: req.body.division });

        if (semesterTimetable.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Timetable has been Fetched Successfully"

            // Finding all the Fees 
            console.log(semesterTimetable)
        }

        return res.json({ status: status, msg: msg, timetable: semesterTimetable });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// ===========================================================================================================================================================================
// ----- FETCH SUBJECT ROUTES ---------- FETCH SUBJECT ROUTES ---------- FETCH SUBJECT ROUTES ---------- FETCH SUBJECT ROUTES ---------- FETCH SUBJECT ROUTES ---------- FETCH
// ===========================================================================================================================================================================

// For Fetching Subject - GET Request
// Full Route : /api/student/fetch/allsubjects
router.get('/fetch/allsubjects', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Semester Subject has NOT Fetched Successfully";

    try {
        // Finding all the Subjects 
        const allSemSubject = await Subjects.find({ sem: req.body.sem });

        if (allSemSubject.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Semester Subject has been Fetched Successfully"

            // Finding all the Subjects 
            console.log(allSemSubject)
        }

        return res.json({ status: status, msg: msg, semesterSubjects: allSemSubject });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// ===========================================================================================================================================================================
// ----- FETCH FACULTY ROUTES ---------- FETCH FACULTY ROUTES ---------- FETCH FACULTY ROUTES ---------- FETCH FACULTY ROUTES ---------- FETCH FACULTY ROUTES ---------- FETCH
// ===========================================================================================================================================================================

// For Fetching Subject Material Files - POST Request
// Full Route : /pai/student/fetch/material/:subjectname
router.post('/fetch/material/:subjectname', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Subject Material has NOT Fetched Successfully";

    // console.log("Request Parameters : Sem - ",req.body," Subject - ",req.params.subjectname)

    try {
        // Finding all the Subjects
        const allSubjectMaterial = await Material.find({ sem: req.body.sem, subject: req.params.subjectname });

        if (allSubjectMaterial.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Subject Material has been Fetched Successfully"

            // Finding all the Subjects 
            console.log(allSubjectMaterial)
        }

        return res.json({ status: status, msg: msg, subjectMaterial: allSubjectMaterial });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// ===========================================================================================================================================================================
// ----- NOTES ROUTES ---------- NOTES ROUTES ---------- NOTES ROUTES ---------- NOTES ROUTES ---------- NOTES ROUTES ---------- NOTES ROUTES ---------- NOTES ROUTES --------
// ===========================================================================================================================================================================

// Route 1 : Fetching all the Notes of the User using GET Request "/api/notes/notes/fetchallnotes"
// Here, Login is Required ==> Middleware needed
router.get('/notes/fetchallnotes', fetchUser, async (req, res) => {

    // Making a Variable to track the success or not
    let status = "";
    let msg = "";

    // TODO : fetching it by user id (student/faculty)
    try {
        // Finding all the notes 
        // Also to be specific, we have to add the user in the parameter to find notes of only that user
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// Route 2 : Adding Notes in the database using POST Request "/api/student/notes/addnote"
// Here, Login is Required ==> Middleware needed
router.post('/notes/addnote', fetchUser, [
    body("title", "Title can't be Empty !").exists(),
    body("description", "Description can't be Empty !").exists(),
    body("description", "Description can't be Empty !").isLength({ min: 5 })
], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "";
    let msg = "";

    try {
        console.log("Here, You can Add Note Here !")

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Note Not Added Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
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
        status = "success";
        msg = "Note Added Successfully"

        // returning the saved note Details
        return res.status(200).json({ status: status, msg: msg, savedNote })
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Note Not Added Successfully"
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }

})

// Route 3 : Updating an existing Note in the database using PUT Request "/api/notes/notes/updatenote"
// Here, Login is Required ==> Middleware needed
// Also, the user could update his/her note only so for that we have to check for the user as well
router.put('/notes/updatenote/:id', fetchUser, [
    body("title", "Title can't be Empty !").notEmpty(),
    body("description", "Description can't be Empty !").notEmpty(),
    body("description", "Description should have minimum of 5 Letters !").isLength({ min: 5 })
], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "";
    let msg = "";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Note Not Updated Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
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
            status = "failed";
            msg = "Note Not Updated Successfully"

            // return res.status(404).json({ status: status, msg: msg, error : "Note Not Found !"})
            return res.status(404).json({ status: status, msg: msg, error: "Note Not Found !" });
        }

        // If note exists in database, then getting its user
        // and then comparing that with the user which has been logged in (From where we get this ?)
        // We will get the id of user which is logged in from the middle ware or from the fetchUser function
        // TODO : Create a user and middleware
        if (note.user.toString() !== req.user.id) {
            // the note don't belong to that user and should not have any right ot update
            // 401 - Unauthorized

            // Setting up the parameters
            status = "failed";
            msg = "Note Not Updated Successfully"

            // return res.status(401).json({ status: status, msg: msg, error : "Access Denied !"})
            return res.status(404).json({ status: status, msg: msg, error: "Access Denied !" });

        }

        // If code is reached here, that's means the note is belong to the user which is logged in and also that note exists
        const updatedNote = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        // Setting up the parameters
        status = "success";
        msg = "Note Updated Successfully"
        return res.json({ status: status, msg: msg, updatedNote });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Note Not Updated Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// Route 4 : Deleting an existing Note in the database using DELETE Request "/api/notes/notes/deletenote"
// Here, Login is Required ==> Middleware needed
// Also, the user could delete his/her note only so for that we have to check for the user as well
router.delete('/notes/deletenote/:id', fetchUser, async (req, res) => {

    // Making a Variable to track the success or not
    let status = "";
    let msg = "";

    try {// Finding whether the same user who created note is deleting or not

        // Finding the note from the database, whether the note exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const note = await Notes.findById(req.params.id);

        // If that note doesn't exists, then returning the Bad Response
        if (!note) {

            // Setting up the parameters
            status = "failed";
            msg = "Note Not Deleted Successfully"

            return res.status(404).json({ status: status, msg: msg, error: "Note Not Found !" })
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
            status = "failed";
            msg = "Note Not Deleted Successfully"

            return res.status(401).json({ status: status, msg: msg, error: "Access Denied !" })
            // return res.status(404).json("Access Denied !");

        }

        // If code is reached here, that's means the note is belong to the user which is logged in and also that note exists
        const deletedNote = await Notes.findByIdAndDelete(req.params.id);

        // Setting up the parameters
        status = "success";
        msg = "Note has been Deleted Successfully"

        return res.json({ status: status, msg: msg, note: deletedNote });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Note Not Deleted Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// ===========================================================================================================================================================================
// ----- RECENT ACTITIVITY ROUTES ---------- RECENT ACTITIVITY ROUTES ---------- RECENT ACTITIVITY ROUTES ---------- RECENT ACTITIVITY ROUTES ---------- RECENT ACTITIVITY ROU
// ===========================================================================================================================================================================

// For Adding Announcement - POST Request
// Full Route : /api/student/recentaccessed/add
router.post('/recentaccessed/add', fetchUser, [
    body("link", "Link can't be Empty !").exists(),
    body("description", "Description can't be Empty !").exists(),
    body("timestamp", "Timestamp can't be Empty !").exists()
], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "";
    let msg = "";

    try {
        console.log("Here, You can Add Note Here !")

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Recent Accessed Not Added Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found

        const RecentAccessedUser = await RecentAccessed.find({ user: req.user.id })
        const { link, description, timestamp } = req.body

        if (RecentAccessedUser.length != 0) {

            console.log("Data exists")

            // Getting the data from the record
            console.log(RecentAccessedUser)
            console.log(RecentAccessedUser[0].recentData)
            let recentData = RecentAccessedUser[0].recentData.push({ link: link, description: description, timestamp: timestamp })

            console.log(recentData)
            console.log(RecentAccessedUser[0].recentData)

            const updatedRecentAccessed = await RecentAccessed.findByIdAndUpdate(RecentAccessedUser[0]._id, { $set: { "recentData": RecentAccessedUser[0].recentData } }, { new: true })

            if (updatedRecentAccessed) {
                console.log("Record Updated !")

                // Setting up the parameters
                status = "success";
                msg = "Recent Accessed Updated Successfully"

                // returning the saved note Details
                return res.status(200).json({ status: status, msg: msg, recentAccessed: updatedRecentAccessed })
            }
        }

        else {

            console.log("Data Doesn't exists")

            // Destructing Data from body
            const { link, description, timestamp } = req.body;

            // TODO : Add user id through Middleware (student/faculty)
            // Creating a recentAccessed
            const recentAccessed = new RecentAccessed({ user: req.user.id, recentData: { link, description, timestamp } })

            // Saving recentAccessed in database
            const savedRecentAccessed = await recentAccessed.save();

            // Setting up the parameters
            status = "success";
            msg = "Recent Accessed Added Successfully"

            // returning the saved note Details
            return res.status(200).json({ status: status, msg: msg, recentAccessed: savedRecentAccessed })
        }
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Recent Accessed Not Added Successfully"
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// For Fetching Recent Accessed - POST Request
// Full Route : /api/student/recentaccessed/fetch
router.post('/recentaccessed/fetch', fetchUser, async (req, res) => {

    // Making a Variable to track the success or not
    let status = "";
    let msg = "";

    try {
        console.log("Here, You can Add Note Here !")

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Recent Accessed Not Added Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found

        const RecentAccessedUser = await RecentAccessed.find({ user: req.user.id })

        if (RecentAccessedUser.length > 0) {
            // Setting up the parameters
            status = "success";
            msg = "Recent Accessed Fetched Successfully"

            // returning the saved note Details
            return res.status(200).json({ status: status, msg: msg, recentAccessed: RecentAccessedUser })
        }
        else {
            // Setting up the parameters
            status = "failed";
            msg = "Recent Accessed Not Fetched"

            // returning the saved note Details
            return res.status(400).json({ status: status, msg: msg, recentAccessed: "No Records Found !!" })
        }
    }

    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Recent Accessed NOT Fetched Successfully"
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// ===========================================================================================================================================================================
// ----- ANNOUNCEMENT ROUTES ---------- ANNOUNCEMENT ROUTES ---------- ANNOUNCEMENT ROUTES ---------- ANNOUNCEMENT ROUTES ---------- ANNOUNCEMENT ROUTES ---------- ANNOUNCEME
// ===========================================================================================================================================================================

// For Fetching All Announcement - GET Request
// Full Route : /api/student/fetch/announcement/all
router.get('/fetch/allannouncement', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Announcements has NOT Fetched Successfully";

    try {

        const client = new MongoClient("mongodb://127.0.0.1:27017/ConnectWithGUNI", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const databaseObject = client.db('ConnectWithGUNI');
        const collection = databaseObject.collection("announcements");

        // Use the find method to retrieve all records
        const cursor = collection.find();

        // Convert the cursor to an array of documents
        const allAnnouncement = await cursor.toArray();

        if (allAnnouncement.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Announcements has been Fetched Successfully"

            // Finding all the Announcements
            console.log(allAnnouncement)
        }

        return res.json({ status: status, msg: msg, announcements: allAnnouncement });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching Announcement By Semester - GET Request
// Full Route : /api/student/fetch/announcement/sem/:sem
router.get('/fetch/announcement/sem/:sem/div/:div/batch/:batch', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Semester Announcements has NOT Fetched Successfully";

    try {
        // Finding all the Announcements 
        const announcements = await Announcement.find({
            $and: [
                { $or: [{ announcementBatch: req.params.batch }, { announcementBatch: "all" }] },
                { $or: [{ announcementDivision: req.params.div }, { announcementDivision: "all" }] },
                { $or: [{ announcementSem: req.params.sem }, { announcementSem: "all" }] },
            ]
        });

        if (announcements.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Semester Announcements has been Fetched Successfully"

            // Finding all the Announcements 
            console.log(announcements)
        }

        return res.json({ status: status, msg: msg, announcements: announcements });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching Announcement By Announcer - GET Request
// Full Route : /api/student/fetch/announcement/sem/:sem
router.get('/fetch/announcement/:announcedBy', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Announcements has NOT Fetched Successfully";

    try {
        // Finding all the Announcements
        const announcements = await Announcement.find({ announcementBy: req.params.announcedBy });

        if (announcements.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Announcements has been Fetched Successfully"

            // Finding all the Announcements 
            console.log(announcements)
        }

        return res.json({ status: status, msg: msg, announcements: announcements });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// ===========================================================================================================================================================================
// ----- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES
// ===========================================================================================================================================================================

// For Fetching Fees - GET Request
// Full Route : /api/admin/fetch/fees/:id
router.get('/fetch/fees/:id', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Fees Record has NOT Fetched Successfully";

    try {
        // Finding all the Subjects 
        const feesData = await Fees.find({ _id: req.params.id });

        if (feesData.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Fees Record has been Fetched Successfully"

            // Printing all the fees Data
            console.log(feesData)

        }

        return res.json({ status: status, msg: msg, feesData });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching Fees By Semester - GET Request
// Full Route : /api/admin/fetch/fees/sem/:sem/enroll/:enroll
router.get('/fetch/fees/sem/:sem/enroll/:enroll', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Fees Receipts of Student has NOT Fetched Successfully";

    try {
        // Finding all the Fees 
        const allSemFees = await Fees.find({
            $and: [
                { feesSem: req.params.sem },
                { feesEnroll: req.params.enroll }
            ]
        });

        if (allSemFees.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Fees Receipts of Student has been Fetched Successfully"

            // Finding all the Fees 
            console.log(allSemFees)
        }

        return res.json({ status: status, msg: msg, studentFees: allSemFees });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// ===========================================================================================================================================================================
// ----- MARKSHEET ROUTES ---------- MARKSHEET ROUTES ---------- MARKSHEET ROUTES ---------- MARKSHEET ROUTES ---------- MARKSHEET ROUTES ---------- MARKSHEET ROUTES --------
// ===========================================================================================================================================================================

// For Fetching Marksheet By Semester - GET Request
// Full Route : /api/admin/fetch/marksheet/sem/:sem
router.get('/fetch/marksheet/sem/:sem/enroll/:enroll', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Semester Marksheets has NOT Fetched Successfully";

    try {
        // Finding all the Marksheet 
        const allSemMarksheet = await Marksheet.find({
            $and: [
                { marksheetSem: req.params.sem },
                { marksheetEnroll: req.params.enroll }
            ]
        });

        if (allSemMarksheet.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Semester Marksheets has been Fetched Successfully"

            // Finding all the Marksheet 
            console.log(allSemMarksheet)

            return res.json({ status: status, msg: msg, studentMarksheet: allSemMarksheet });

        }
        else {
            // Setting up the parameters
            status = "failed";
            msg = "No Marksheets Records Found"

            return res.json({ status: status, msg: msg, studentMarksheet: allSemMarksheet });

        }

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// ===========================================================================================================================================================================
// ----- ALL SUBJECT ROUTES ---------- ALL SUBJECT ROUTES ---------- ALL SUBJECT ROUTES ---------- ALL SUBJECT ROUTES ---------- ALL SUBJECT ROUTES ---------- ALL SUBJECT ROU
// ===========================================================================================================================================================================

// For Fetching Subject - GET Request
// Full Route : /api/admin/fetch/allsemsubjects/:sem
router.get('/fetch/allsemsubjects/:sem', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Semester Subject has NOT Fetched Successfully";

    try {
        // Finding all the Subjects 
        const allSemSubject = await Subjects.find({ sem: req.params.sem });

        if (allSemSubject.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Semester Subject has been Fetched Successfully"

            // Finding all the Subjects 
            console.log(allSemSubject)
        }

        return res.json({ status: status, msg: msg, semesterSubjects: allSemSubject });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// Exporting the Router Variable as StudentRouter
module.exports = router;