import { CorsOptions } from "cors"

const whiteList: Array<string> = [
    `https://127.0.0.1:${process.env.PORT}`,
    `https://localhost:${process.env.PORT}`,
    `https://localhost:5173`,
    `https://127.0.0.1:5173`,
    'https://192.168.50.85:5173',
    'localhost'
]

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if(!origin || whiteList.indexOf(origin) !== -1 ) callback(null,true);
        else callback(new Error("Not allowed by CORS"), false);
    },
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}

