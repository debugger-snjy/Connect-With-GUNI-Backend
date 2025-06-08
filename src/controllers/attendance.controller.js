import { validationResult } from "express-validator";
import Attendance from "../models/attendance.model.js";
import Students from "../models/student.model.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";
import ExcelJS from "exceljs";
import fs from "fs";
import { uploadOnCloudinaryFromBuffer } from "../utils/cloudinary.js";

// For Uploading Attendance - POST Request
// Full Route : /api/admin/attendance/upload
const uploadAttendance = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Attendance NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            msg = "Attendance Not Updated Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        if (req.file) {
            console.log(req.file.originalname)
            // Handle the uploaded file

            const fileBuffer = req.file.buffer;

            // Check if the File type is for an Excel file (xlsx or xls)
            let validExcelFile = false;
            if (isExcelFile(req.file.originalname)) {
                validExcelFile = true
            } else {
                msg = "File is in NOT Valid Format !"
                return res.status(400).json(new APIError(400, msg));
            }

            let incorrectFile = false;
            // Adding a more layer of validation : 

            if (validExcelFile) {

                const searchAttendanceRecord = await Attendance.find({
                    $and: [
                        { title: req.body.title },
                        { sem: req.body.sem }
                    ]
                })

                if (searchAttendanceRecord.length === 0) {
                    // Full Data :
                    let attendance_data = { "subject": req.body.subject, data: [] }
                    let dataOfSemester = req.body.sem;
                    // Create a new workbook
                    const workbook = new ExcelJS.Workbook();

                    // Load an Excel file (replace 'example.xlsx' with your file path)
                    // Using await as we want the result here and process them !
                    await workbook.xlsx.load(fileBuffer)
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
                                        let student_data = {}

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
                                console.log("Data : ");
                                console.log(attendance_data)
                            });
                        })
                        .catch(function (error) {
                            console.log('Error reading the Excel file:', error);
                        });

                    if (incorrectFile) {
                        msg = "File Data is in WRONG Format !";
                        return res.status(400).json(new APIError(400, msg));
                    }
                    else {

                        msg = "File Has Been Uploaded Successfully!"


                        const cloudinaryResponse = await uploadOnCloudinaryFromBuffer(fileBuffer, "Connect With GUNI/Attendance/" + Date.now.toString() + req.file.originalname)

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


                        // Adding the file record into the database
                        const newAttendance = new Attendance({
                            title: req.body.title,
                            file: cloudinaryResponse.secure_url,
                            sem: req.body.sem,
                            subject: req.body.subject,
                            uploadedBy: req.body.uploadedBy,
                        })

                        const attendanceSaved = await newAttendance.save()

                        if (attendanceSaved) {
                            console.log("Yes !")
                            msg = "Attendance is Uploaded Successfully !";
                        }
                        else {
                            console.log("No!")
                            msg = "Attendance is NOT Uploaded Successfully !";
                        }
                    }

                }
                else {
                    msg = "Attendance with Same Title Already Exists for Semester " + req.body.sem;
                    return res.status(409).json(new APIError(409, msg));
                }

                return res.json(new APIResponse(200, null, msg + (incorrectFile ? " Because File Data is in WRONG Format !" : "")));
            }
        }
        else {
            let error = "File is Missing !"
            msg = "File Has NOT Been Uploaded Successfully !"
            return res.status(400).json(new APIError(400, msg, error));
        }
    }
    catch (error) {
        // Handle other errors
        console.error('Error:', error.message);
        return res.status(500).json(new APIError(500, msg, 'Internal Server Error !'));
    }
}

// For Fetching Attendance - GET Request
// Full Route : /api/admin/attendance/fetch
const fetchAllAttendance = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Attendance Records has NOT Fetched Successfully";

    console.log("Fetching the Attendance")

    try {

        // Fetching all the Attendance Records
        const allAttendance = await Attendance.find({}).lean();

        if (allAttendance.length !== 0) {
            msg = "All Attendance Records has been Fetched Successfully"
            // Finding all the Subjects
            console.log(allAttendance)
        }

        return res.json(new APIResponse(200, allAttendance, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, "Internal Server Error !", error.message))
    }
}

// Helper function to check if file is Excel
function isExcelFile(filename) {
    return filename.endsWith('.xlsx') || filename.endsWith('.xls');
}

// Helper function to check if string is alphabetic
function isAlphaString(str) {
    return /^[a-zA-Z\s]+$/.test(str);
}

export { uploadAttendance, fetchAllAttendance };