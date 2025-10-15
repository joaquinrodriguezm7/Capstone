import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export function generateAccessToken(payload) {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    );
}

export function generateRefreshToken(payload) {
    return jwt.sign(
        payload, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: "7d" }
    );
}