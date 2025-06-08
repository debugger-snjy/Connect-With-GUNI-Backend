import { Router } from "express";
import { body } from "express-validator";
import {
    uploadAnnouncement,
    fetchAllAnnouncements,
    fetchAnnouncementsBySemDivBatch,
    fetchAnnouncementsByAnnouncer,
    updateAnnouncement,
    deleteAnnouncement
} from "../controllers/announcement.controller.js";

const announcementRouter = Router();

// For Uploading Announcement - POST Request
// Full Route : /api/v1/announcement/upload/
announcementRouter.post('/upload/', [
    // Checking whether the field is available or not !!
    body("title", "Your Title is Required").exists(),
    body("description", "Your Description is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    // body("announcedBy", "Your AnnouncedBy is Required").exists(),
    // Checking other paramaters
], uploadAnnouncement);

// For Fetching All Announcement - GET Request
// Full Route : /api/v1/announcement/fetch/all
announcementRouter.get('/fetch/all', fetchAllAnnouncements);

// For Fetching Announcement By Semester - GET Request
// Full Route : /api/v1/announcement/fetch/sem/:sem/div/:div/batch/:batch
announcementRouter.get('/fetch/sem/:sem/div/:div/batch/:batch', fetchAnnouncementsBySemDivBatch);

// For Fetching Announcement By Announcer - GET Request
// Full Route : /api/v1/announcement/fetch/announcer/:announcedBy
announcementRouter.get('/fetch/announcer/:announcedBy', fetchAnnouncementsByAnnouncer);

// For Updating Announcement - PUT Request
// Full Route : /api/v1/announcement/update/:announcementId
announcementRouter.put('/update/:announcementId', [
    // Checking whether the field is available or not !!
    body("title", "Your Title is Required").exists(),
    body("description", "Your Description is Required").exists(),
    body("sem", "Your Sem is Required").exists(),
    body("division", "Your Division is Required").exists(),
    body("batch", "Your Batch is Required").exists(),
    // body("announcedBy", "Your AnnouncedBy is Required").exists(),
    // Checking other paramaters
], updateAnnouncement);

// For Deleting Announcement - DELETE Request
// Full Route : /api/v1/announcement/delete/:announcementId
announcementRouter.delete('/delete/:announcementId', deleteAnnouncement);

export default announcementRouter;
