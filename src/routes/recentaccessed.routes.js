import { Router } from "express";
import { body, validationResult } from "express-validator";
import { addRecentAccessed, fetchRecentAccessed } from "../controllers/recentaccessed.controller.js";
import { fetchUser } from "../middleware/auth.middleware.js";

const recentAccessedRouter = Router();

// For Adding Announcement - POST Request
// Full Route : /api/v1/recentaccessed/add
recentAccessedRouter.post('/add', fetchUser, [
    body("link", "Link can't be Empty !").exists(),
    body("description", "Description can't be Empty !").exists(),
    body("timestamp", "Timestamp can't be Empty !").exists()
], addRecentAccessed);

// For Fetching Recent Accessed - POST Request
// Full Route : /api/v1/recentaccessed/fetch
recentAccessedRouter.post('/fetch', fetchUser, fetchRecentAccessed);

export default recentAccessedRouter;
