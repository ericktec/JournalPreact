import express, { Express } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import https from "https";
dotenv.config();
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import {connectDatabase, closeDatabaseConnection} from "./db/dbClient";
import setupRoutes from "./routes/setupRoutes";
import cookieParser from "cookie-parser";


const app: Express = express();

// build-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.json());

app.use(cors(corsOptions));
// app.use(cors({
//     origin: "https://localhost:5173",
//     credentials: true,
//     allowedHeaders: 'Origin, Content-Type, X-Auth-Token, Set-Cookie, Authorization, Accept'

// }));

const port = process.env.PORT || 3000;
const appOptions = {
    key: fs.readFileSync(path.join(__dirname, "..", "credentials", "cert-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "credentials", "cert.pem"))
}


// Make sure db is connected
connectDatabase().catch(error => {
    console.error(error);
    process.exit(1);
});

// setup all the routes
setupRoutes(app);

const server = https.createServer(appOptions, app).listen(port, () => {
    console.log(`[Server]: Server is running at https://localhost:${port}`);
});


process.on("SIGINT", async () => {
    await closeDatabaseConnection();
    process.exit();
});