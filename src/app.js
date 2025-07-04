// Importing the Express Package
import express from "express";

// Importing the cookieParse
import cookieParser from "cookie-parser";

// Importing the cors
import cors from "cors";

import { APIResponse } from "./utils/apiResponse.js"

import authRouter from "./routes/auth.routes.js";
import notesRouter from "./routes/notes.routes.js";
import studentRouter from "./routes/student.routes.js";
import facultyRouter from "./routes/faculty.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import adminRouter from "./routes/admin.routes.js";
import announcementRouter from "./routes/announcement.routes.js";
import feesRouter from "./routes/fees.routes.js";
import marksheetRouter from "./routes/marksheet.routes.js";
import recentAccessedRouter from "./routes/recentaccessed.routes.js";
import timetableRouter from "./routes/timetable.routes.js";
import materialRouter from "./routes/material.routes.js";
import attendanceRouter from "./routes/attendance.routes.js";
import axios from "axios";

// Creating an Express application
const app = express();

// Adding the cors in the application
// app.use(cors());
// we can add the options to the cors as well
app.use(cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true
}))

// This is for the Data that we get from Forms
// Earlier, when the Express was not able to take the json responses, 
// we use different packages like body-parser, But now in express, we use the in-built middleware of the express
// No need for body-parser now
app.use(express.json({
    limit: process.env.JSON_LIMIT
}))

// This is for the Data that we get from URLs
app.use(express.urlencoded({
    extended: true,
    limit: process.env.URL_LIMIT
}))

// This is used to perform CRUD operations on the client's browser cookies securely and only be done by the server
app.use(cookieParser())

// This is used to serve the data like images, pdfs on the home route
app.use(express.static("public"))

// --------------------------------------------------------------------------------------------------------------------
// Routes

app.use("/api/v1/user", authRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/subject", subjectRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/announcement", announcementRouter);
app.use("/api/v1/fees", feesRouter);
app.use("/api/v1/marksheet", marksheetRouter);
app.use("/api/v1/recentaccess", recentAccessedRouter);
app.use("/api/v1/timetable", timetableRouter);
app.use("/api/v1/material", materialRouter);
app.use("/api/v1/attendance", attendanceRouter);

// Adding the Heath or Live Status Route
app.get("/api/v1/connect-with-guni", (req, res) => {
    return res
        .status(200)
        .json(
            new APIResponse(200, {
                server: "OK"
            }, "All Things are Looking Good !!")
        )
});

app.get('/api/v1/download', async (req, res) => {
    const cloudinaryFileUrl = req.query.url; // full Cloudinary URL
    const filename = req.query.name || 'downloaded-file.mp4';

    console.log(filename)

    try {
        const fileResponse = await axios.get(cloudinaryFileUrl, {
            responseType: 'stream',
        });

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', fileResponse.headers['content-type']);

        fileResponse.data.pipe(res);
    } catch (error) {
        console.error('Download error:', error.message);
        res.status(500).send('Error downloading the file');
    }
});


// Exporting the app in default format - i.e, no need to use object destructuring while importing
export default app;