import { Application } from "express";
import authenticationRouter from "./authentication";
import userRouter from "./users"
import journalRouter from "./journals";


export default function setupRoutes(app: Application) {
    app.use("/authentication", authenticationRouter);
    app.use("/users", userRouter);
    app.use("/journals", journalRouter);
}