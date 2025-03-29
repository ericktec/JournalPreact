import { Router } from "express";
import { createJournal, getJournalById, getJournals, updateJournal } from "../controllers/journals";
import { isAuthenticated } from "../middlewares/authentication";

const router = Router();

router.get("/getJournals", isAuthenticated, getJournals);
router.post("/createJournal", isAuthenticated, createJournal);
router.get("/getJournal", isAuthenticated, getJournalById);
router.patch("/updateJournal", isAuthenticated, updateJournal);


export default router;