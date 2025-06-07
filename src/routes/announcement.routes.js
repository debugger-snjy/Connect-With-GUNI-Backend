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

announcementRouter.post('/upload/announcement/', [
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
// Full Route : /api/admin/fetch/announcement/all
announcementRouter.get('/fetch/allannouncement', fetchAllAnnouncements);

// For Fetching Announcement By Semester - GET Request
// Full Route : /api/admin/fetch/announcement/sem/:sem
announcementRouter.get('/fetch/announcement/sem/:sem/div/:div/batch/:batch', fetchAnnouncementsBySemDivBatch);

// For Fetching Announcement By Announcer - GET Request
// Full Route : /api/admin/fetch/announcement/:announcedBy
announcementRouter.get('/fetch/announcement/:announcedBy', fetchAnnouncementsByAnnouncer);

// For Updating Announcement - PUT Request
// Full Route : /api/admin/update/announcement/:announcementId
announcementRouter.put('/update/announcement/:announcementId', [
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
// Full Route : /api/admin/delete/announcement/:announcementId
announcementRouter.delete('/delete/announcement/:announcementId', deleteAnnouncement);

export default announcementRouter;