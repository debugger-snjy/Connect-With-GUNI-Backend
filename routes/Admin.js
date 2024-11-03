// This file is used for Operations by Admin

// Importing the express Package
const express = require('express');

// Create a router of the express
const router = express.Router()

// Importing the Admin schema from Admin Mongoose Model
const Admin = require("../models/Admin");

// Importing the Student schema from Student Mongoose Model
const Students = require("../models/Student");

// Importing the Subject schema from Subject Mongoose Model
const Subjects = require("../models/Subject");

// Importing the Faculty schema from Faculty Mongoose Model
const Faculties = require("../models/Faculty");

// Importing the Timetable schema from Timetable Mongoose Model
const Timetable = require("../models/Timetable");

// Importing the Announcement schema from Announcement Mongoose Model
const Announcement = require("../models/Announcement");

const Fees = require('../models/Fees');
const Marksheet = require('../models/Marksheet');
const Material = require('../models/Material');


// Importing the express-validator
const { body, validationResult } = require('express-validator');

// For Creating Database and Accesssing Collection from the database
const { MongoClient, ObjectId } = require('mongodb');

// Importing the xlsx Module for Excel File Handling
const ExcelJS = require('exceljs');
const xlsx = require('xlsx');

const multer = require('multer');

// Importing the File System
const fs = require('fs');
const path = require('path');

// Using the Middle Ware
const fetchUser = require('../middleware/fetchUserId');
const RecentAccessed = require('../models/RecentAccessed');
const Attendance = require('../models/Attendance');
const Faculty = require('../models/Faculty');
const Notes = require('../models/Notes');

// Function to check for the string is a text or not
function isAlphaString(input) {
    // Define a regular expression pattern for the date format
    const alphaPattern = /^[a-zA-Z ]+$/;

    // Use the test() method to check if the input string matches the pattern
    return alphaPattern.test(input);
}

// Function to check the extension of the Uploaded file
function isExcelFile(filePath) {
    const ext = path.extname(filePath);

    // Check if the file extension is .xlsx (case-insensitive)
    return ext.toLowerCase() === '.xlsx';
}

function getFileTypeFromExtension(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'tiff':
        case 'svg':
            return 'image';
        case 'pdf':
            return 'pdf';
        case 'xls':
        case 'xlsx':
            return 'excel';
        case 'doc':
        case 'docx':
            return 'doc';
        case 'mp3':
        case 'wav':
            return 'audio';
        // Add more extensions and types as needed.
        default:
            return 'unknown';
    }
}

// Set up storage for uploaded files for Attendance
const attendanceStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        const folderPath = path.join(__dirname, '../Attendance Uploads');

        fs.mkdir(folderPath, (err) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    console.log('The folder already exists.');
                } else {
                    console.error(`Error creating the folder: ${err}`);
                }
            } else {
                console.log('Folder created successfully.');
            }
        });

        cb(null, 'Attendance Uploads/');

    },
    filename: (req, file, cb) => {

        //TODO : Want to add the faculty or admin name before the filename and make it more proper
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create the multer instance for Attendance
const attendance_upload = multer({ storage: attendanceStorage });

// Set up storage for uploaded files for Attendance
const MaterialStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        let folderPath = "";

        folderPath = path.join(__dirname, '../Materials Uploads');

        fs.mkdir(folderPath, (err) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    console.log('The folder already exists.');
                } else {
                    console.error(`Error creating the folder: ${err}`);
                }
            } else {
                console.log('Folder created successfully.');
            }
        });

        folderPath = path.join(__dirname, '../Materials Uploads/' + req.body.uploadername);

        fs.mkdir(folderPath, (err) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    console.log('The folder already exists.');
                } else {
                    console.error(`Error creating the folder: ${err}`);
                }
            } else {
                console.log('Folder created successfully.');
            }
        });

        folderPath = path.join(__dirname, '../Materials Uploads/' + req.body.uploadername + '/Sem' + req.body.sem.toString());

        fs.mkdir(folderPath, (err) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    console.log('The folder already exists.');
                } else {
                    console.error(`Error creating the folder: ${err}`);
                }
            } else {
                console.log('Folder created successfully.');
            }
        });

        cb(null, 'Materials Uploads' + '/' + req.body.uploadername + '/' + 'Sem' + req.body.sem.toString() + '/');

    },
    filename: (req, file, cb) => {

        //TODO : Want to add the faculty or admin name before the filename and make it more proper
        cb(null, file.originalname);
    }
});

// Create the multer instance for Attendance
const material_upload = multer({ storage: MaterialStorage });

// =======================================================================================================================================================
// ----- ADMIN ROUTES ---------- ADMIN ROUTES ---------- ADMIN ROUTES ---------- ADMIN ROUTES ---------- ADMIN ROUTES ---------- ADMIN ROUTES ---------- 
// =======================================================================================================================================================

// For Adding Admin - POST Request
// Full Route : /api/admin/add/admin
router.post('/add/admin', [

    // Checking whether the field is available or not !!
    body("role", "Your Role is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("gender", "Your Gender is Required").exists(),
    body("phone", "Your Phone is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Admin Record has NOT Added Successfully";

    try {

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Admin Not Added Successfully !"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no Errors are found !!
        const { role, name, password, email, gender, phone } = req.body;

        // Create a new admin document
        const admin = new Admin({
            role,
            name,
            password,
            email,
            gender,
            phone
            // Add more fields here
        });

        // Save the admin document to the database
        // If saved successfully
        if (await admin.save()) {

            // Setting up the parameters
            status = "success";
            msg = "Admin Record has been Added Successfully"

            // Printing all the admin 
            console.log(admin)
        }

        return res.json({ status: status, msg: msg, admin: admin });
    }
    catch (error) {

        if (error.code === 11000) {
            // Duplicate key error (e.g., unique index violation)
            console.error('Duplicate key error:', error.message);
            res.status(500).json({ error: 'Record Already Exists !' });
        } else {
            // Handle other errors
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error !' });
        }
    }
});

// For Fetching Admin - GET Request
// Full Route : /api/admin/fetch/admin/:id
router.get('/fetch/admin/:id', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Admin Record has NOT Fetched Successfully";

    try {
        // Finding all the Admin 
        const admin = await Admin.find({ _id: req.params.id });

        if (admin.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Admin Record has been Fetched Successfully"

            // Printing the admin
            console.log(admin)
        }

        return res.json({ status: status, msg: msg, admin: admin });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching All Admin - GET Request
// Full Route : /api/admin/fetch/alladmin
router.get('/fetch/alladmin', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "No Admin Records Found !";

    try {

        const client = new MongoClient("mongodb://127.0.0.1:27017/ConnectWithGUNI", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const databaseObject = client.db('ConnectWithGUNI');
        const collection = databaseObject.collection("admins");

        // Use the find method to retrieve all records
        const cursor = collection.find();

        // Convert the cursor to an array of documents
        const allAdmin = await cursor.toArray();

        if (allAdmin.length !== 0) {

            // Setting up the parameters
            status = "success";
            msg = "All Admin Record has been Fetched Successfully"

            // Finding all the Admin 
            console.log(allAdmin)
        }

        return res.json({ status: status, msg: msg, admins: allAdmin });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Deleting Admin - DEL Request
// Full Route : /api/admin/delete/admin/:id
router.delete('/delete/admin/:id', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Admin Record Not Found";

    try {

        // Finding the admin from the database, whether the admin exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const admin = await Admin.findById(req.params.id);

        // If that Admin doesn't exists, then returning the Bad Response
        if (!admin) {

            // Setting up the parameters
            status = "failed";
            msg = "Admin Record Not Found"

            return res.status(404).json({ status: status, msg: msg, error: "Admin Record Not Found !" })
        }

        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);

        // Setting up the parameters
        status = "success";
        msg = "Admin Record has been Deleted Successfully"

        return res.json({ status: status, msg: msg, admin: deletedAdmin });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Admin Record Not Deleted Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// For Updating Admin - PUT Request
// Full Route : /api/admin/update/admin/:id
router.put('/update/admin/:id', [

    // Checking whether the field is available or not !!
    body("role", "Your Role is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("gender", "Your Gender is Required").exists(),
    body("phone", "Your Phone is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Admin Record Not Updated Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Admin Record Not Updated Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { role, name, password, email, gender, phone } = req.body;

        // Create a newAdmin Object with the new Updated Data 
        const newAdmin = {
            role,
            name,
            password,
            email,
            gender,
            phone
        }

        // Finding the admin from the database, whether the admin exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const admin = await Admin.findById(req.params.id);

        // If that admin doesn't exists, then returning the Bad Response
        if (!admin) {

            // Setting up the parameters
            status = "failed";
            msg = "Admin Record Not Updated Successfully"

            return res.status(404).json({ status: status, msg: msg, error: "Admin Record Not Found !" });
        }

        // If code is reached here, that's means the admin is belong to the user which is logged in and also that admin exists
        const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, { $set: newAdmin }, { new: true });
        // Setting up the parameters
        status = "success";
        msg = "Admin Record Updated Successfully"
        return res.json({ status: status, msg: msg, updatedAdmin });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Admin Record Not Updated Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// =======================================================================================================================================================
// ----- STUDENT ROUTES ---------- STUDENT ROUTES ---------- STUDENT ROUTES ---------- STUDENT ROUTES ---------- STUDENT ROUTES ---------- STUDENT ROUTES 
// =======================================================================================================================================================

// For Adding Student - POST Request
// Full Route : /api/admin/add/student
router.post('/add/student', [

    // Checking whether the field is available or not !!
    body("enrollNo", "Your Enrollnment Number is Required").exists(),
    body("sem", "Your Semester is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("phone", "Your Phone is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("role", "Your role is Required").exists(),
    body("gender", "Your Gender is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),
    body("sem", "Your Semester is Invalid").toInt().isNumeric(),

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Student Record has NOT Added Successfully";

    try {

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Student Not Added Successfully !"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no Errors are found !!
        const { enrollNo, batch, division, sem, role, phone, name, password, email, date, gender } = req.body;

        // Create a new student document
        // Adding the Subject IDs to the student record
        const student = new Students({
            enrollNo,
            batch,
            sem,
            division,
            phone,
            name,
            password,
            role,
            email,
            date,
            gender,
            // subjectIds,
            // materialData,
            // Add more fields here
        });

        // Save the student document to the database
        // If saved successfully
        if (await student.save()) {

            // Setting up the parameters
            status = "success";
            msg = "Student Record has been Added Successfully"

            // Printing all the Students 
            console.log(student)
        }

        return res.json({ status: status, msg: msg, student: student });
    }
    catch (error) {

        if (error.code === 11000) {
            // Duplicate key error (e.g., unique index violation)
            console.error('Duplicate key error:', error.message);
            res.status(500).json({ error: 'Record Already Exists !' });
        } else {
            // Handle other errors
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error !' });
        }
    }
});

// For Fetching Student - GET Request
// Full Route : /api/admin/fetch/student/:id
router.get('/fetch/student/:id', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Student Record has NOT Fetched Successfully";

    try {
        // Finding all the Students 
        const student = await Students.find({ _id: req.params.id });

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

// For Fetching All Semester Student - GET Request
// Full Route : /api/admin/fetch/allsemstudent/:sem
router.get('/fetch/allsemstudent/:sem', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Student Record has NOT Fetched Successfully";

    try {
        // Finding all the Students 
        const student = await Students.find({ sem: req.params.sem });

        if (student.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Student Record has been Fetched Successfully"

            // Printing all the Semester Students 
            console.log(student)
        }

        return res.json({ status: status, msg: msg, student: student });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching All Class Student - GET Request
// Full Route : /api/admin/fetch/allclassstudent/:class
router.get('/fetch/allclassstudent/:division', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Student Record has NOT Fetched Successfully";

    try {
        // Finding all the Students 
        const student = await Students.find({ division: req.params.division });

        if (student.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Student Record has been Fetched Successfully"

            // Printing all the Semester Students 
            console.log(student)
        }

        return res.json({ status: status, msg: msg, student: student });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching All Students - GET Request
// Full Route : /api/admin/fetch/allstudents
router.get('/fetch/allstudents', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "No Student Records Found !";

    try {

        const client = new MongoClient("mongodb://127.0.0.1:27017/ConnectWithGUNI", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const databaseObject = client.db('ConnectWithGUNI');
        const collection = databaseObject.collection("students");

        // Use the find method to retrieve all records
        const cursor = collection.find();

        // Convert the cursor to an array of documents
        const allStudents = await cursor.toArray();

        if (allStudents.length !== 0) {

            // Setting up the parameters
            status = "success";
            msg = "All Students Record has been Fetched Successfully"

            // Finding all the Students 
            console.log(allStudents)
        }

        return res.json({ status: status, msg: msg, students: allStudents });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Deleting Student - DEL Request
// Full Route : /api/admin/delete/student/:id
router.delete('/delete/student/:id', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Student Record Not Found";

    try {

        // Finding the student from the database, whether the student exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const student = await Students.findById(req.params.id);

        // If that Student doesn't exists, then returning the Bad Response
        if (!student) {

            // Setting up the parameters
            status = "failed";
            msg = "Student Record Not Found"

            return res.status(404).json({ status: status, msg: msg, error: "Student Record Not Found !" })
            // return res.status(404).json("Student Record Not Found !");
        }

        const deletedStudent = await Students.findByIdAndDelete(req.params.id);

        // Setting up the parameters
        status = "success";
        msg = "Student Record has been Deleted Successfully"

        return res.json({ status: status, msg: msg, student: deletedStudent });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Student Record Not Deleted Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// For Updating Student - PUT Request
// Full Route : /api/admin/update/student/:id
router.put('/update/student/:id', [

    // Checking whether the field is available or not !!
    body("enrollNo", "Your Enrollnment Number is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    body("sem", "Your Semester is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("phone", "Your Phone is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("gender", "Your Gender is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),
    body("sem", "Your Semester is Invalid").toInt().isNumeric(),

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Student Record Not Updated Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Student Record Not Updated Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { enrollNo, batch, sem, division, phone, name, password, email, date, gender } = req.body;

        // Create a newStudent Object with the new Updated Data 
        const newStudent = {
            enrollNo,
            batch,
            sem,
            phone,
            name,
            password,
            division,
            email,
            date,
            gender,
        }

        // Finding the student from the database, whether the student exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const student = await Students.findById(req.params.id);

        // If that student doesn't exists, then returning the Bad Response
        if (!student) {

            // Setting up the parameters
            status = "failed";
            msg = "Student Record Not Updated Successfully"

            return res.status(404).json({ status: status, msg: msg, error: "Student Record Not Found !" });
        }

        // If code is reached here, that's means the student is belong to the user which is logged in and also that student exists
        const updatedStudent = await Students.findByIdAndUpdate(req.params.id, { $set: newStudent }, { new: true });
        // Setting up the parameters
        status = "success";
        msg = "Student Record Updated Successfully"
        return res.json({ status: status, msg: msg, updatedStudent });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Student Record Not Updated Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// =======================================================================================================================================================
// ----- FACULTY ROUTES ---------- FACULTY ROUTES ---------- FACULTY ROUTES ---------- FACULTY ROUTES ---------- FACULTY ROUTES ---------- FACULTY ROUTES 
// =======================================================================================================================================================

// Add Faculty Operation
// For Adding Faculty - POST Request
// Full Route : /api/admin/add/faculty
router.post('/add/faculty', [

    // Checking whether the field is available or not !!

    body("facultyId", "Your Faculty Id is Required").exists(),
    body("phone", "Your Phone is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("role", "Your Role is Required").exists(),
    body("gender", "Your Gender is Required").exists(),
    body("designation", "Your Designation is Required").exists(),
    body("dept", "Your Department is Required").exists(),
    body("cabinLocation", "Your Cabin Location is Required").exists(),
    body("facultyShortForm", "Your Faculty Short Name is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Faculty Not Added Successfully";

    try {

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Faculty Not Added Successfully !"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no Errors are found !!
        const { facultyId, phone, name, password, role, cabinLocation, email, date, gender, designation, dept, subjectTeachingShortForm, facultyShortForm } = req.body;

        const searchFaculty = await Faculties.find({ facultyId, email, facultyShortForm })

        if (searchFaculty.length === 0) {
            // Create a new faculty document
            const newFaculty = new Faculties({
                facultyId,
                phone,
                name,
                password,
                email,
                role,
                date,
                gender,
                designation,
                dept,
                cabinLocation,
                facultyShortForm
                // Add more fields here
            });

            // Save the faculty document to the database
            // If saved successfully !
            if (await newFaculty.save()) {

                // Setting up the parameters
                status = "success";
                msg = "Faculty Record has been Added Successfully"

                // Printing the Faculty Details
                console.log(newFaculty)

                return res.json({ status: status, msg: msg, faculty: newFaculty });
            }

        }
        else {
            // Setting up the parameters
            status = "failed";
            msg = "Faculty Record with Paramters Exits"

            return res.json({ status: status, msg: msg });
        }

    }
    catch (error) {

        if (error.code === 11000) {
            // Duplicate key error (e.g., unique index violation)
            console.error('Duplicate key error:', error.message);
            res.status(500).json({ error: 'Record Already Exists !' });
        } else {
            // Handle other errors
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error !' });
        }
    }
});

// For Fetching Faculty - GET Request
// Full Route : /api/admin/fetch/faculty/:id
router.get('/fetch/faculty/:id', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Faculty Record has NOT Fetched Successfully";

    try {
        // Finding all the Faculties
        const faculty = await Faculties.find({ _id: req.params.id });

        if (faculty.length !== 0) {

            // Setting up the parameters
            status = "success";
            msg = "Faculty Record has been Fetched Successfully"

            // Printing the Faculty 
            console.log(faculty)

        }

        return res.json({ status: status, msg: msg, faculty: faculty });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching Faculty - GET Request
// Full Route : /api/admin/fetch/departmentfaculty
router.get('/fetch/departmentfaculty/:dept', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Faculty Record has NOT Fetched Successfully";

    try {

        // Finding all the Faculties
        const faculty = await Faculties.find({ dept: req.params.dept })

        if (faculty.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Faculty Record has been Fetched Successfully"

            // Printing the Faculty 
            console.log(faculty)
        }

        return res.json({ status: status, msg: msg, faculty: faculty });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching Faculty - GET Request
// Full Route : /api/admin/fetch/allfaculties
router.get('/fetch/allfaculties', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Faculties Record has NOT Fetched Successfully";

    try {

        // Finding all the Faculties
        const faculties = await Faculties.find()

        if (faculties.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Faculties Record has been Fetched Successfully"

            // Printing the Faculties 
            console.log(faculties)
        }

        return res.json({ status: status, msg: msg, faculties: faculties });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Deleting Student - DEL Request
// Full Route : /api/admin/delete/student/:id
router.delete('/delete/faculty/:id', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Faculty Record NOT Found !";

    try {

        // Finding the faculty from the database, whether the faculty exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const faculty = await Faculties.findById(req.params.id);

        // If that Faculties doesn't exists, then returning the Bad Response
        if (!faculty) {

            // Setting up the parameters
            status = "failed";
            msg = "Faculty Record Not Found"

            return res.status(404).json({ status: status, msg: msg, error: "Faculty Record Not Found !" })
        }

        const deletedFaculty = await Faculties.findByIdAndDelete(req.params.id);

        // Setting up the parameters
        status = "success";
        msg = "Faculty Record has been Deleted Successfully"

        return res.json({ status: status, msg: msg, facultydeleted: deletedFaculty });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Faculty Record Not Deleted Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Adding Faculty - POST Request
// Full Route : /api/admin/add/faculty
router.put('/update/faculty/:id', [

    // Checking whether the field is available or not !!

    body("facultyId", "Your Faculty Id is Required").exists(),
    body("phone", "Your Phone is Required").exists(),
    body("name", "Your Name is Required").exists(),
    body("password", "Your Password is Required").exists(),
    body("email", "Your Email is Required").exists(),
    body("gender", "Your Gender is Required").exists(),
    body("designation", "Your Designation is Required").exists(),
    body("cabinLocation", "Your cabinLocation is Required").exists(),
    body("dept", "Your Department is Required").exists(),

    // Checking other paramaters
    body("phone", "Phone Number should of 10 digits").isLength({ min: 10, max: 10 }),
    body("email", "Email ID is Invalid").isEmail(),

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Faculty Record Not Updated Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Faculty Record Not Updated Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { facultyId, phone, name, password, role, cabinLocation, email, date, gender, designation, dept, subjectTeachingShortForm, facultyShortForm } = req.body;

        // Create a newFaculty Object with the new Updated Data 
        const newFaculty = {
            facultyId,
            phone,
            name,
            password,
            email,
            role,
            date,
            gender,
            designation,
            dept,
            cabinLocation,
            facultyShortForm
            // Add more fields here
        };

        // Finding the faculty from the database, whether the faculty exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const faculty = await Faculties.findById(req.params.id);

        // If that subject doesn't exists, then returning the Bad Response
        if (!faculty) {

            // Setting up the parameters
            status = "failed";
            msg = "Faculty Record Not Updated Successfully"

            return res.status(404).json({ status: status, msg: msg, error: "Faculty Record Not Found !" });
        }

        // If code is reached here, that's means the subject is belong to the user which is logged in and also that subject exists
        const updatedFaculty = await Faculties.findByIdAndUpdate(req.params.id, { $set: newFaculty }, { new: true });
        // Setting up the parameters
        status = "success";
        msg = "Faculty Record Updated Successfully"
        return res.json({ status: status, msg: msg, updatedFaculty });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Faculty Not Updated Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// =======================================================================================================================================================
// ----- SUBJECT ROUTES ---------- SUBJECT ROUTES ---------- SUBJECT ROUTES ---------- SUBJECT ROUTES ---------- SUBJECT ROUTES ---------- SUBJECT ROUTES 
// =======================================================================================================================================================

// For Adding Subject - POST Request
// Full Route : /api/admin/add/subject
router.post('/add/subject', [

    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("subjectName", "Your Subject Name is Required").exists(),
    body("subjectCode", "Your Subject Code is Required").exists(),
    body("subjectShortForm", "Your Subject Short Form is Required").exists(),
    body("faculties", "Faculties is Required").exists(),

    // Checking other paramaters

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Subject NOT Added Successfully";

    try {

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Subject Not Added Successfully !"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no Errors are found !!
        let { sem, subjectName, subjectCode, subjectShortForm, faculties } = req.body;

        faculties = faculties.split(",")

        const findSubject = await Subjects.find({ subjectCode })

        if (findSubject.length == 0) {
            // Create a new subject document
            const subject = new Subjects({
                sem,
                subjectCode,
                subjectName,
                subjectShortForm,
                faculties
                // Add more fields here
            });

            // Save the subject document to the database
            if (await subject.save()) {

                // Setting up the parameters
                status = "success";
                msg = "Subject has been Added Successfully"

                // Finding all the Students 
                console.log(subject)
            }

            return res.json({ status: status, msg: msg, subject: subject });

        }
        else {
            status = "failed";
            msg = "Subject is Already Exists";
        }

        return res.json({ status: status, msg: msg });

    }
    catch (error) {

        if (error.code === 11000) {
            // Duplicate key error (e.g., unique index violation)
            console.error('Duplicate key error:', error.message);
            res.status(500).json({ error: 'Subject Record Already Exists !' });
        } else {
            // Handle other errors
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error !' });
        }
    }
});

// For Fetching Subject - GET Request
// Full Route : /api/admin/fetch/subject/:id
router.get('/fetch/subject/:id', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Subject has NOT Fetched Successfully";

    try {
        // Finding all the Subjects 
        const subject = await Subjects.find({ _id: req.params.id });

        if (subject.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Subject has been Fetched Successfully"

            // Finding all the Subjects 
            console.log(subject)

        }

        return res.json({ status: status, msg: msg, subject: subject });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching All Subjects - GET Request
// Full Route : /api/admin/fetch/allsubjects
router.get('/fetch/allsubjects', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Subjects has NOT Fetched Successfully";

    try {

        const client = new MongoClient("mongodb://127.0.0.1:27017/ConnectWithGUNI", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const databaseObject = client.db('ConnectWithGUNI');
        const collection = databaseObject.collection("subjects");

        // Use the find method to retrieve all records
        const cursor = collection.find();

        // Convert the cursor to an array of documents
        const allSubjects = await cursor.toArray();

        if (allSubjects.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Subjects has been Fetched Successfully"

            // Finding all the Subjects
            console.log(allSubjects)
        }

        return res.json({ status: status, msg: msg, subjects: allSubjects });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

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

// For Deleting Subject - DEL Request
// Full Route : /api/admin/delete/subject/:id
router.delete('/delete/subject/:id', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Subject has NOT Deleted Successfully";

    try {

        // Finding the subject from the database, whether the subject exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const subject = await Subjects.findById(req.params.id);

        // If that subject doesn't exists, then returning the Bad Response
        if (!subject) {

            // Setting up the parameters
            status = "failed";
            msg = "Subject Record Not Found"

            return res.status(404).json({ status: status, msg: msg, error: "Subject Record Not Found !" })
            // return res.status(404).json("subject Record Not Found !");
        }

        const deletedSubject = await Subjects.findByIdAndDelete(req.params.id);

        if (deletedSubject.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Subject has been Deleted Successfully"

        }

        return res.json({ status: status, msg: msg, subjectdeleted: deletedSubject });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Subject Not Deleted Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// For Updating Subject - PUT Request
// Full Route : /api/admin/update/subject/:id
router.put('/update/subject/:id', [

    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("subjectName", "Your Subject Name is Required").exists(),
    body("subjectCode", "Your Subject Code is Required").exists(),
    body("subjectShortForm", "Your Subject Short Form is Required").exists(),

    // Checking other paramaters

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Subject NOT Updated Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Subject Not Updated Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { sem, subjectName, subjectCode, subjectShortForm, subjectLectures } = req.body;

        // Create a newSubject Object with the new Updated Data 
        const newSubject = {
            sem,
            subjectName,
            subjectCode,
            subjectShortForm,
            subjectLectures
        }

        // Finding the subject from the database, whether the subject exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const subject = await Subjects.findById(req.params.id);

        // If that subject doesn't exists, then returning the Bad Response
        if (!subject) {

            // Setting up the parameters
            status = "failed";
            msg = "Subject Not Updated Successfully"

            return res.status(404).json({ status: status, msg: msg, error: "Subject Not Found !" });
        }

        // If code is reached here, that's means the subject is belong to the user which is logged in and also that subject exists
        const updatedSubject = await Subjects.findByIdAndUpdate(req.params.id, { $set: newSubject }, { new: true });

        if (updatedSubject.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Subject Updated Successfully"

        }

        return res.json({ status: status, msg: msg, updatedSubject });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Subject Not Updated Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// ===========================================================================================================================================================================
// ----- TIMETABLE ROUTES ---------- TIMETABLE ROUTES ---------- TIMETABLE ROUTES ---------- TIMETABLE ROUTES ---------- TIMETABLE ROUTES ---------- TIMETABLE ROUTES --------
// ===========================================================================================================================================================================

// ! NOTE : We have to upload timetable daywise for each batch using form
// TODO : Review and Edit after Fronthand !!
// For Updating Subject - PUT Request
// Full Route : /api/admin/upload/timetable

// TODO : Remaining !
router.post('/upload/timetable', [

    // Checking whether the field is available or not !!
    body("sem", "Your Sem is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("data", "Your Data is Required").exists(),

    // Checking other paramaters

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Timetable NOT Updated Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Subject Not Updated Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { sem, batch, division, data } = req.body;

        const newTimetable = new Timetable({
            sem,
            batch,
            division,
            data
        })

        // Save the Timetable document to the database
        // If saved successfully
        if (await newTimetable.save()) {

            // Setting up the parameters
            status = "success";
            msg = "Timetable has been Added Successfully"

            // Printing all the timetable 
            console.log(newTimetable)

            return res.json({ status: status, msg: msg, timetable: newTimetable });

        }
        else {
            msg = "Timetable has NOT Added Successfully"
            return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !" })

        }

    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Subject Not Updated Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

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

router.get('/fetch/alltimetables', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Timetable has NOT Fetched Successfully";

    try {
        // Finding all the Fees 
        const semesterTimetable = await Timetable.find({});

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

router.put('/edit/timetable/:timetableId', [

    // Checking whether the field is available or not !!

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Timetable NOT Updated Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Timetable Not Updated Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        console.log("Data from API : ", req.body.allData)
        const { sem, batch, division, data } = req.body.allData;

        // Fetching Marksheet Data :
        const timetableData = await Timetable.find({ _id: req.params.timetableId })

        console.log("API View : ", timetableData)

        if (timetableData) {
            console.log("Record Found")

            // Updating the Record : 
            const updatedTimetableData = await Timetable.findByIdAndUpdate(req.params.timetableId, {
                $set: {
                    sem,
                    batch,
                    division,
                    data
                }
            }, { new: true });

            if (updatedTimetableData) {
                // console.log("Done")
                // Setting up the parameters
                status = "success";
                msg = "Timetable has been Updated Successfully"
            }
            else {
                // console.log("Not Done")
                // Setting up the parameters
                status = "failed";
                msg = "Timetable has NOT Updated Successfully"
            }

            return res.json({ status: status, msg: msg, Timetable: updatedTimetableData });

        }
        else {
            console.log("Record NOT Found")
            // Setting up the parameters
            status = "failed";
            msg = "Timetable has NOT Found"
        }

        return res.json({ status: status, msg: msg });

    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Subject Not Updated Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

router.delete("/delete/timetable/:timetableId", async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Timetable has NOT Deleted Successfully";

    try {

        // Finding the subject from the database, whether the subject exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const timetable = await Timetable.findById(req.params.timetableId);

        // If that subject doesn't exists, then returning the Bad Response
        if (!timetable) {

            // Setting up the parameters
            status = "failed";
            msg = "Timetable Record Not Found"

            return res.status(404).json({ status: status, msg: msg, error: "Timetable Record Not Found !" })
        }

        const deletedTimetable = await Timetable.findByIdAndDelete(req.params.timetableId);

        if (deletedTimetable.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Timetable has been Deleted Successfully"

        }

        return res.json({ status: status, msg: msg, timetabledeleted: deletedTimetable });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Timetable Not Deleted Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// ===========================================================================================================================================================================
// ----- MATERIAL ROUTES ---------- MATERIAL ROUTES ---------- MATERIAL ROUTES ---------- MATERIAL ROUTES ---------- MATERIAL ROUTES ---------- MATERIAL ROUTES ---------- MAT  
// ===========================================================================================================================================================================

// For Uploading the Material :
router.post('/materials/upload', material_upload.single('file'), [

    // Checking whether the field is available or not !!
    body("sem", "Your Semester is Missing").exists(),
    body("subject", "Your Subject is Missing").exists(),
    body("uploadername", "Uploader Name is Missing").exists(),

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Material NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Material Not Uploaded Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        if (req.file) {

            console.log(req.file.filename.toString())
            // Handle the uploaded file

            const uploadfilename = path.join(__dirname, '../Materials Uploads/' + req.body.uploadername.toLowerCase() + '/Sem' + req.body.sem.toString() + '/' + req.file.filename.toString());

            console.log(uploadfilename)
            console.log("Test 1")

            // Use fs.access to check if the file exists
            await fs.access(uploadfilename, fs.constants.F_OK, async (err) => {
                if (err) {
                    console.log("Test 2")
                    console.error('File does not exist');
                    status = "failed";
                    msg = "Material is Not Uploaded !";
                    return res.json({ status: status, msg: msg });
                } else {
                    console.log("Test 3")
                    console.log('File exists');

                    const searchMaterial = await Material.find({ subject: req.body.subject, title: req.file.filename.toString(), sem: req.body.sem })
                    console.log("Test 4")

                    console.log("Search : ", searchMaterial)

                    if (searchMaterial.length === 0) {
                        console.log("Test 5")
                        const newMaterial = new Material({
                            subject: req.body.subject,
                            title: req.file.filename.toString(),
                            file: uploadfilename,
                            uploadedBy: req.body.uploadername,
                            sem: req.body.sem,
                            type: getFileTypeFromExtension(req.file.filename.toString())
                        })
                        console.log("Test 6")
                        const materialSaved = newMaterial.save()
                        if (materialSaved) {
                            console.log("Yes !")
                            status = "success";
                            msg = "Material is Uploaded Successfully !";

                        }
                        else {
                            console.log("No!")
                            status = "failed";
                            msg = "Material is NOT Uploaded Successfully !";
                        }
                        console.log("Test 7")
                        return res.json({ status: status, msg: msg });
                    }
                    else {
                        // Setting up the parameters
                        status = "failed";
                        msg = "File is already Uploaded !"
                        console.log("Test 8")
                        return res.json({ status: status, msg: msg });
                    }

                }
            });
        }
        else {
            let error = "File is Missing !"
            msg = "File Has NOT Been Uploaded Successfully !"
            return res.json({ status: status, msg: msg, error: error });
        }
    }
    catch (error) {
        // Handle other errors
        console.error('Error:', error.message);
        res.status(500).json({ status: status, msg: msg, error: 'Internal Server Error !' });
    }

});

router.get('/fetch/allmaterials', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Materials has NOT Fetched Successfully";

    try {

        const client = new MongoClient("mongodb://127.0.0.1:27017/ConnectWithGUNI", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const databaseObject = client.db('ConnectWithGUNI');
        const collection = databaseObject.collection("materials");

        // Use the find method to retrieve all records
        const cursor = collection.find();

        // Convert the cursor to an array of documents
        const allMaterials = await cursor.toArray();

        if (allMaterials.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Materials has been Fetched Successfully"

            // Finding all the Subjects
            console.log(allMaterials)
        }

        return res.json({ status: status, msg: msg, materials: allMaterials });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

router.delete('/delete/material/:materialid', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Material has NOT Deleted Successfully";

    try {

        // Finding the subject from the database, whether the subject exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const material = await Material.findById(req.params.materialid);

        // If that subject doesn't exists, then returning the Bad Response
        if (!material) {

            // Setting up the parameters
            status = "failed";
            msg = "Material Record Not Found"

            return res.status(404).json({ status: status, msg: msg, error: "Material Record Not Found !" })
        }

        const deletedMaterial = await Material.findByIdAndDelete(req.params.materialid);

        if (deletedMaterial.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Material has been Deleted Successfully"

        }

        return res.json({ status: status, msg: msg, materialdeleted: deletedMaterial });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Material Not Deleted Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// ===========================================================================================================================================================================
// ----- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES ---------- ATTENDANCE ROUTES --
// ===========================================================================================================================================================================

// For Uploading Attendance - POST Request
// Full Route : /api/admin/attendance/upload
router.post('/attendance/upload', attendance_upload.single('file'), [

    // Checking whether the field is available or not !!
    body("sem", "Your Semester is Missing").exists(),
    body("subject", "Your Subject is Missing").exists(),
    body("title", "Your Title is Missing").exists(),
    body("uploadedBy", "Your UploadedBy is Missing").exists(),

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Attendance NOT Uploaded Successfully";

    try {

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Attendance Not Updated Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        if (req.file) {

            console.log(req.file.filename.toString())
            // Handle the uploaded file

            const uploadfilename = "F:\\Ganpat University\\GUNI Sem7\\Capstone Project III\\ConnectWithGUNI - Project\\Backend" + "\\Attendance Uploads\\" + req.file.filename.toString()

            // Check if the File type is for an Excel file (xlsx or xls)
            if (isExcelFile(req.file.filename.toString().toLowerCase())) {
                validExcelFile = true
            } else {
                validExcelFile = false
                status = "failed";
                msg = "File is in NOT Valid Format !"
                return res.json({ status: status, msg: msg });
            }

            let incorrectFile = false;
            // Adding a more layer of validation : 

            if (validExcelFile) {

                // Full Data :
                let attendance_data = { "subject": req.body.subject, data: [] }
                let dataOfSemester = req.body.sem;
                // Create a new workbook
                const workbook = new ExcelJS.Workbook();

                // Load an Excel file (replace 'example.xlsx' with your file path)
                // Using await as we want the result here and process them !
                await workbook.xlsx.readFile(uploadfilename)
                    .then(async function () {

                        var count = 0;
                        // Get the number of sheets in the Excel file
                        workbook.eachSheet(sheet => {

                            var headers = []
                            // Use the workbook and its sheets here

                            const worksheet = workbook.getWorksheet(sheet.name); // Get the first worksheet
                            worksheet.eachRow(async function (row, rowNumber) {
                                // console.log(`Row ${rowNumber}: ${JSON.stringify(row.values.slice(1))}`);

                                let enrollLoc = 0;

                                // Got the Data Here !
                                if (rowNumber == 1) {
                                    for (let index = 0; index < row.values.slice(1).length; index++) {

                                        var element = row.values.slice(1)[index];

                                        if (!element) {
                                            console.log("Not Element !!")
                                            incorrectFile = true;
                                            break;
                                        }
                                        else {
                                            if (isAlphaString(element.toString())) {
                                                if (element.toString() == "Enrollnment Number") {
                                                    headers.push("enroll")
                                                }
                                                else if (element.toString() == "Attendance") {
                                                    headers.push("attendance")
                                                }
                                                else {
                                                    headers.push(element)
                                                }
                                                enrollLoc = index
                                            }
                                            else {
                                                let date = new Date(element)
                                                let formattedDate = date.getDate() + "/" + parseInt(date.getMonth() + 1) + "/" + date.getFullYear()
                                                headers.push(formattedDate)
                                            }
                                        }

                                    }
                                    // console.log(headers);
                                }
                                else if (!incorrectFile) {

                                    let data = row.values.slice(1);
                                    student_data = {}

                                    for (let i = 0; i < headers.length; i++) {

                                        if (headers[i] == "attendance") {
                                            student_data[headers[i]] = data[i].result;
                                        }
                                        else {
                                            student_data[headers[i]] = data[i];

                                        }
                                    }
                                    attendance_data.data.push(student_data)
                                    console.log(student_data)
                                }
                            });
                            console.log(attendance_data)
                        });
                    })
                    .catch(function (error) {
                        console.log('Error reading the Excel file:', error);
                    });

                if (incorrectFile) {

                    await fs.rm(uploadfilename, (err) => {
                        console.log("Removing !")
                        if (err) {
                            console.log("Remove Error")
                            status = "failed";
                            msg = "Error Deleting Your Wrong Formatted File From Database !"
                        }
                        else {
                            console.log("Remove Errorless")
                            status = "failed";
                            msg = "File Data is in WRONG Format !"
                        }
                        console.log("Removed")
                    })
                }
                else {

                    status = "success";
                    msg = "File Has Been Uploaded Successfully!"

                    console.log("Reading Completed !")

                    console.log(attendance_data)
                    console.log(attendance_data.data[0]["enroll"])
                    console.log(attendance_data.data[1]["enroll"])

                    // Saving the Data into the Database
                    console.log("Data : ")
                    for (let index = 0; index < attendance_data.data.length; index++) {
                        const stud_data = attendance_data.data[index];
                        const subject = attendance_data.subject.toString()
                        console.log(subject)

                        // Getting the Enrollnment Number and add the data accordingly
                        const stud_enroll = stud_data["enroll"]

                        // Finding that enrollment number
                        // Making a Variable to track the success or not
                        let status = "failed";
                        let msg = "Student Record has NOT Found !";

                        try {
                            // Finding all the Students 
                            const student = await Students.find({ "enrollNo": stud_enroll, "sem": parseInt(dataOfSemester) });

                            // If Student Record Found
                            if (student.length !== 0) {
                                console.log(stud_enroll, ": Found")

                                var stud_attendance_data = {}
                                var student_final_attendance_data = {}

                                for (const date in stud_data) {
                                    if (date !== 'enroll' && (stud_data[date] === 'P' || stud_data[date] === 'A')) {
                                        stud_attendance_data[date] = stud_data[date];
                                    }
                                    else if (date == 'attendance') {
                                        stud_attendance_data[date] = stud_data[date];
                                    }
                                }

                                // console.log(stud_attendance_data);

                                student_final_attendance_data[subject] = stud_attendance_data;
                                console.log(student_final_attendance_data)
                                // console.log("Done1")

                                let newAttendance = student_final_attendance_data[subject]
                                console.log("newAttendance : ", newAttendance)

                                let oldAttendance = {}
                                let final_attendance = {}
                                let otherSubjectAttendance = {}

                                // console.log("Done2")
                                if (student[0].attendanceData[0]) {
                                    for (const key in student[0].attendanceData[0]) {
                                        if (key === subject) {
                                            oldAttendance = student[0].attendanceData[0][subject]
                                            console.log("oldAttendance : ", oldAttendance)
                                        }
                                        else {
                                            otherSubjectAttendance[key] = student[0].attendanceData[0][key]
                                        }
                                    }
                                }
                                // console.log("Done3")
                                // console.log("Done4")

                                if (oldAttendance) {
                                    final_attendance[subject] = { ...oldAttendance, ...newAttendance }
                                }
                                else {
                                    final_attendance[subject] = { ...newAttendance }
                                }

                                // console.log("Done5")

                                // Merging all the attendances together
                                let allAttendances = { ...otherSubjectAttendance, ...final_attendance }

                                // If code is reached here, that's means the student is belong to the user which is logged in and also that student exists
                                const updatedStudent = await Students.findByIdAndUpdate(student[0]._id, { $set: { attendanceData: [allAttendances] } }, { new: true });

                                if (updatedStudent) {
                                    // console.log("Done")
                                }

                            }
                            else {
                                console.log(stud_enroll, ": Not Found")
                            }

                        } catch (error) {
                            console.log("Error Occured Saving the Data!")
                            console.error("Error : ", error.message)
                        }

                    }

                    const searchAttendanceRecord = await Attendance.find({
                        $and: [
                            { title: req.body.title },
                            { sem: req.body.sem }
                        ]
                    })

                    if (searchAttendanceRecord.length === 0) {
                        // Adding the file record into the database
                        const newAttendance = new Attendance({
                            title: req.body.title,
                            file: uploadfilename,
                            sem: req.body.sem,
                            subject: req.body.subject,
                            uploadedBy: req.body.uploadedBy,
                        })

                        const attendanceSaved = await newAttendance.save()

                        if (attendanceSaved) {
                            console.log("Yes !")
                            status = "success";
                            msg = "Attendance is Uploaded Successfully !";
                        }
                        else {
                            console.log("No!")
                            status = "failed";
                            msg = "Attendance is NOT Uploaded Successfully !";
                        }
                    }
                    else {
                        status = "failed";
                        msg = "Attendance with Same Title Already Exists for Semester " + req.body.sem;
                    }


                }
            }
            console.log("Checking !")
            return res.json({ status: status, msg: msg + (incorrectFile ? " Because File Data is in WRONG Format !" : "") });
        }
        else {
            let error = "File is Missing !"
            msg = "File Has NOT Been Uploaded Successfully !"
            return res.json({ status: status, msg: msg, error: error });
        }
    }
    catch (error) {
        // Handle other errors
        console.error('Error:', error.message);

        res.status(500).json({ status: status, msg: msg, error: 'Internal Server Error !' });
    }

});

router.get('/attendance/fetch', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Attendance Records has NOT Fetched Successfully";

    console.log("Fetching the Attendance")

    try {

        const client = new MongoClient("mongodb://127.0.0.1:27017/ConnectWithGUNI", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const databaseObject = client.db('ConnectWithGUNI');
        const collection = databaseObject.collection("attendances");

        // Use the find method to retrieve all records
        const cursor = collection.find();

        // Convert the cursor to an array of documents
        const allAttendance = await cursor.toArray();

        if (allAttendance.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Attendance Records has been Fetched Successfully"

            // Finding all the Subjects
            console.log(allAttendance)
        }

        return res.json({ status: status, msg: msg, attendance: allAttendance });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// ===========================================================================================================================================================================
// ----- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES ROUTES ---------- FEES
// ===========================================================================================================================================================================

// For Uploading Fees - POST Request
// Full Route : /api/admin/upload/fees/
router.post('/upload/fees/', [

    // Checking whether the field is available or not !!
    body("id", "Your Id is Required").exists(),
    body("date", "Your Date is Required").exists(),
    body("mode", "Your Mode is Required").exists(),
    body("amount", "Your Amount is Required").exists(),
    body("title", "Your Title is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("enroll", "Your Enrollment Number is Required").exists(),

    // Checking other paramaters

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Fees Record has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Fees Record has NOT Uploaded Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { id, date, mode, amount, title, sem, enroll } = req.body;

        const searchFees = await Fees.find({ feesTitle: title })

        if (searchFees.length === 0) {

            // Create a newFees Object with the new Updated Data 
            const newFees = new Fees({
                feesId: id,
                feesDate: date,
                feesMode: mode,
                feesAmount: amount,
                feesTitle: title,
                feesSem: sem,
                feesEnroll: enroll,
            });

            const feesRecord = await newFees.save()

            // Setting up the parameters
            status = "success";
            msg = "Fees Record has been Uploaded Successfully"

            return res.json({ status: status, msg: msg, fees: newFees });

        }
        else {
            // Setting up the parameters
            status = "failed";
            msg = "Fees With Same Title Exists !"

            return res.json({ status: status, msg: msg });

        }


    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Fees Record has Not Uploaded Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

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

// For Fetching All Fees - GET Request
// Full Route : /api/admin/fetch/fees/all
router.get('/fetch/allfees', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Fees Records has NOT Fetched Successfully";

    console.log("Fetching the Fees")

    try {

        const client = new MongoClient("mongodb://127.0.0.1:27017/ConnectWithGUNI", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const databaseObject = client.db('ConnectWithGUNI');
        const collection = databaseObject.collection("fees");

        // Use the find method to retrieve all records
        const cursor = collection.find();

        // Convert the cursor to an array of documents
        const allFees = await cursor.toArray();

        if (allFees.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Fees Records has been Fetched Successfully"

            // Finding all the Subjects
            console.log(allFees)
        }

        return res.json({ status: status, msg: msg, fees: allFees });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching Fees By Semester - GET Request
// Full Route : /api/admin/fetch/fees/sem/:sem
router.get('/fetch/fees/sem/:sem', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Semester Fees Records has NOT Fetched Successfully";

    try {
        // Finding all the Fees 
        const allSemFees = await Fees.find({ feesSem: req.params.sem });

        if (allSemFees.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Semester Fees Records has been Fetched Successfully"

            // Finding all the Fees 
            console.log(allSemFees)
        }

        return res.json({ status: status, msg: msg, semesterFees: allSemFees });

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

// For Updating Fees - PUT Request
// Full Route : /api/admin/update/fees/:feesId
router.put('/update/fees/:feesId', [

    // Checking whether the field is available or not !!
    body("date", "Your Date is Required").exists(),
    body("mode", "Your Mode is Required").exists(),
    body("amount", "Your Amount is Required").exists(),
    body("title", "Your Title is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("enroll", "Your Enrollment Number is Required").exists(),

    // Checking other paramaters

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Fees Record has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Fees Record NOT Uploaded Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { date, mode, amount, title, sem, enroll } = req.body;

        // Fetching Fees Data :
        const feesData = await Fees.find({ feesId: req.params.feesId })

        if (feesData) {
            console.log("Record Found")

            // Updating the Record : 
            const updatedFeesData = await Fees.findByIdAndUpdate(feesData[0]._id, { $set: { feesDate: date, feesMode: mode, feesAmount: amount, feesTitle: title, feesSem: sem, feesEnroll: enroll } }, { new: true });

            if (updatedFeesData) {
                // console.log("Done")
                // Setting up the parameters
                status = "success";
                msg = "Fees Record has been Updated Successfully"
            }
            else {
                // console.log("Not Done")
                // Setting up the parameters
                status = "failed";
                msg = "Fees Record has NOT Updated Successfully"
            }

            return res.json({ status: status, msg: msg, fees: updatedFeesData });

        }
        else {
            console.log("Record NOT Found")
            // Setting up the parameters
            status = "failed";
            msg = "Fees Record has NOT Found"
        }

        return res.json({ status: status, msg: msg });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Fees Record Not Updated"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// For Deleting Fees - DELETE Request
// Full Route : /api/admin/delete/fees/:feesId
router.delete('/delete/fees/:feesId', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Fees Record NOT Deleted Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Fees Record NOT Deleted Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        const feesRecord = await Fees.findOneAndDelete({ feesId: req.params.feesId })

        if (feesRecord) {
            status = "success";
            msg = "Fees Record has been Deleted Successfully";
        }
        else {
            status = "failed";
            msg = "Fees Record has NOT Deleted Successfully";
        }

        return res.json({ status: status, msg: msg, fees: feesRecord });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Fees Record Not Deleted"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// ===========================================================================================================================================================================
// ----- MARKSHEETS ROUTES ---------- MARKSHEETS ROUTES ---------- MARKSHEETS ROUTES ---------- MARKSHEETS ROUTES ---------- MARKSHEETS ROUTES ---------- MARKSHEETS ROUTES --
// ===========================================================================================================================================================================

// For Uploading Marksheet - POST Request
// Full Route : /api/admin/upload/marksheet/
router.post('/upload/marksheet/', [

    // Checking whether the field is available or not !!
    body("date", "Your Date is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("enroll", "Your Enrollment Number is Required").exists(),
    body("result", "Your Result is Required").exists(),
    body("grade", "Your Grade is Required").exists(),
    body("data", "Your Data is Required").exists(),

    // Checking other paramaters

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Marksheet has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Marksheet has NOT Uploaded Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { title, sem, result, grade, data, enroll, date } = req.body;

        // Checking for the existing Record : 
        const searchedMarksheet = await Marksheet.find({
            $and: [
                { "marksheetSem": sem },
                { "marksheetEnroll": enroll },
            ]
        })

        if (searchedMarksheet.length === 0) {

            // Create a newMarksheet Object with the new Updated Data 
            const newMarksheet = new Marksheet({
                marksheetEnroll: enroll,
                marksheetSem: sem,
                marksheetDate: date,
                marksheetResult: result,
                marksheetGrade: grade,
                marksheetData: data,
            });

            const marksheetRecord = await newMarksheet.save()

            // Save the Marksheet document to the database
            if (marksheetRecord) {

                // Setting up the parameters
                status = "success";
                msg = "Marksheet has been Uploaded Successfully"

                // Finding all the Students 
                console.log(newMarksheet)

            }

            return res.json({ status: status, msg: msg, marksheet: newMarksheet });
        }
        else {
            status = "failed";
            msg = "Marksheet already Exists !";
            return res.json({ status: status, msg: msg });
        }

    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Marksheet has Not Uploaded Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// For Fetching Marksheet - GET Request
// Full Route : /api/admin/fetch/marksheet/:id
router.get('/fetch/marksheet/:id', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Marksheet has NOT Fetched Successfully";

    try {
        // Finding all the Marksheets 
        const marksheetData = await Marksheet.find({ _id: req.params.id });

        if (marksheetData.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "Marksheet has been Fetched Successfully"

            // Printing all the marksheet Data
            console.log(marksheetData)

        }

        return res.json({ status: status, msg: msg, marksheetData });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching All Marksheet= - GET Request
// Full Route : /api/admin/fetch/marksheet/all
router.get('/fetch/allmarksheet', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Marksheets has NOT Fetched Successfully";

    try {

        const client = new MongoClient("mongodb://127.0.0.1:27017/ConnectWithGUNI", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const databaseObject = client.db('ConnectWithGUNI');
        const collection = databaseObject.collection("marksheets");

        // Use the find method to retrieve all records
        const cursor = collection.find();

        // Convert the cursor to an array of documents
        const allMarksheet = await cursor.toArray();

        if (allMarksheet.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Marksheets has been Fetched Successfully"

            // Finding all the Marksheets
            console.log(allMarksheet)
        }

        return res.json({ status: status, msg: msg, marksheet: allMarksheet });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Fetching Marksheet By Semester - GET Request
// Full Route : /api/admin/fetch/marksheet/sem/:sem
router.get('/fetch/marksheet/sem/:sem', async (req, res) => {
    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "All Semester Marksheets has NOT Fetched Successfully";

    try {
        // Finding all the Marksheet 
        const allSemMarksheet = await Marksheet.find({ marksheetSem: req.params.sem });

        if (allSemMarksheet.length !== 0) {
            // Setting up the parameters
            status = "success";
            msg = "All Semester Marksheets has been Fetched Successfully"

            // Finding all the Marksheet 
            console.log(allSemMarksheet)
        }

        return res.json({ status: status, msg: msg, semesterMarksheet: allSemMarksheet });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

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
        }

        return res.json({ status: status, msg: msg, semesterMarksheet: allSemMarksheet });

    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
});

// For Updating Marksheet - PUT Request
// Full Route : /api/admin/update/marksheet/:marksheetId
router.put('/update/marksheet/:marksheetId', [

    // Checking whether the field is available or not !!
    // Checking other paramaters

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Marksheet has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Marksheet NOT Uploaded Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { sem, result, grade, data, enroll, date } = req.body;

        // Fetching Marksheet Data :
        const marksheetData = await Marksheet.find({ _id: req.params.marksheetId })

        console.log(marksheetData)

        if (marksheetData) {
            console.log("Record Found")

            // Updating the Record : 
            const updatedMarksheetData = await Marksheet.findByIdAndUpdate(marksheetData[0]._id, {
                $set: {
                    marksheetEnroll: enroll,
                    marksheetSem: sem,
                    marksheetDate: date,
                    marksheetResult: result,
                    marksheetGrade: grade,
                    marksheetData: data,
                }
            }, { new: true });

            if (updatedMarksheetData) {
                // console.log("Done")
                // Setting up the parameters
                status = "success";
                msg = "Marksheet has been Updated Successfully"
            }
            else {
                // console.log("Not Done")
                // Setting up the parameters
                status = "failed";
                msg = "Marksheet has NOT Updated Successfully"
            }

            return res.json({ status: status, msg: msg, marksheet: updatedMarksheetData });

        }
        else {
            console.log("Record NOT Found")
            // Setting up the parameters
            status = "failed";
            msg = "Marksheet has NOT Found"
        }

        return res.json({ status: status, msg: msg });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Marksheet Not Updated"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// For Deleting Marksheet - DELETE Request
// Full Route : /api/admin/delete/marksheet/:marksheetId
router.delete('/delete/marksheet/:marksheetId', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Marksheet NOT Deleted Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Marksheet NOT Uploaded Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        const marksheetRecord = await Marksheet.findOneAndDelete({ _id: req.params.marksheetId })

        if (marksheetRecord) {
            status = "success";
            msg = "Marksheet has been Deleted Successfully";
        }
        else {
            status = "failed";
            msg = "Marksheet has NOT Deleted Successfully";
        }

        return res.json({ status: status, msg: msg, deletedMarksheet: marksheetRecord });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Marksheet Record Not Updated"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

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

// Route 2 : Adding Notes in the database using POST Request "/api/notes/addnote"
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
// Full Route : /api/admin/recentaccessed/add
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
// Full Route : /api/admin/recentaccessed/fetch
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
// ----- ANNOUNCEMENTS ROUTES ---------- ANNOUNCEMENTS ROUTES ---------- ANNOUNCEMENTS ROUTES ---------- ANNOUNCEMENTS ROUTES ---------- ANNOUNCEMENTS ROUTES ---------- ANNOU
// ===========================================================================================================================================================================

// For Uploading Announcement - POST Request
// Full Route : /api/admin/upload/announcement/
router.post('/upload/announcement/', [

    // Checking whether the field is available or not !!
    body("title", "Your Title is Required").exists(),
    body("description", "Your Description is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    // body("announcedBy", "Your AnnouncedBy is Required").exists(),

    // Checking other paramaters

], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Announcement has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Announcement has NOT Uploaded Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { title, description, sem, division, batch, links, announcedBy } = req.body;

        // Create a newAnnouncement Object with the new Updated Data 
        const newAnnouncement = new Announcement({
            announcementTitle: title,
            announcementDescription: description,
            announcementSem: sem,
            announcementDivision: division,
            announcementBatch: batch,
            announcementBy: announcedBy,
            additionalLinks: links
        });

        const announcementRecord = await newAnnouncement.save()

        // Save the Announcement document to the database
        if (announcementRecord) {

            // Setting up the parameters
            status = "success";
            msg = "Announcement has been Uploaded Successfully"

            // Finding all the Students 
            console.log(newAnnouncement)

        }

        return res.json({ status: status, msg: msg, announcement: newAnnouncement });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Announcement has Not Uploaded Successfully"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// For Fetching All Announcement - GET Request
// Full Route : /api/admin/fetch/announcement/all
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
// Full Route : /api/admin/fetch/announcement/sem/:sem
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
// Full Route : /api/admin/fetch/announcement/sem/:sem
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

// For Updating Announcement - PUT Request
// Full Route : /api/admin/update/announcement/:announcementId
router.put('/update/announcement/:announcementId', [

    // Checking whether the field is available or not !!
    body("title", "Your Title is Required").exists(),
    body("description", "Your Description is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    // body("announcedBy", "Your AnnouncedBy is Required").exists(),

    // Checking other paramaters


], async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Announcement has NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Announcement NOT Uploaded Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        // If no errors are present or found
        const { title, description, sem, division, batch, links, announcedBy } = req.body;

        // Fetching Announcement Data :
        const announcementData = await Announcement.find({ _id: req.params.announcementId })

        console.log(announcementData)

        if (announcementData) {
            console.log("Record Found")

            // Updating the Record : 
            const updatedAnnouncementData = await Announcement.findByIdAndUpdate(announcementData[0]._id, {
                $set: {
                    announcementTitle: title,
                    announcementDescription: description,
                    announcementSem: sem,
                    announcementDivision: division,
                    announcementBatch: batch,
                    announcementBy: announcedBy,
                    additionalLinks: links
                }
            }, { new: true });

            if (updatedAnnouncementData) {
                // console.log("Done")
                // Setting up the parameters
                status = "success";
                msg = "Announcement has been Updated Successfully"
            }
            else {
                // console.log("Not Done")
                // Setting up the parameters
                status = "failed";
                msg = "Announcement has NOT Updated Successfully"
            }

            return res.json({ status: status, msg: msg, announcement: updatedAnnouncementData });

        }
        else {
            console.log("Record NOT Found")
            // Setting up the parameters
            status = "failed";
            msg = "Announcement has NOT Found"
        }

        return res.json({ status: status, msg: msg });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Announcement Not Updated"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

// For Deleting Announcement - DELETE Request
// Full Route : /api/admin/delete/announcement/:announcementId
router.delete('/delete/announcement/:announcementId', async (req, res) => {

    // Making a Variable to track the success or not
    let status = "failed";
    let msg = "Announcement NOT Deleted Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {

            // Setting up the parameters
            status = "failed";
            msg = "Announcement NOT Uploaded Successfully"

            // sending the errors that are present
            return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        }

        const AnnouncementRecord = await Announcement.findOneAndDelete({ _id: req.params.announcementId })

        if (AnnouncementRecord) {
            status = "success";
            msg = "Announcement has been Deleted Successfully";
        }
        else {
            status = "failed";
            msg = "Announcement has NOT Deleted Successfully";
        }

        return res.json({ status: status, msg: msg, deletedAnnouncement: AnnouncementRecord });
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)

        // Setting up the parameters
        status = "failed";
        msg = "Announcement Record Not Updated"

        return res.status(500).json({ status: status, msg: msg, error: "Internal Server Error !", description: error.message })
    }
})

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


module.exports = router;