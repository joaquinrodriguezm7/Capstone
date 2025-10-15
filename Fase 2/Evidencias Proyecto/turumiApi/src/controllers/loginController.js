import { eq } from 'drizzle-orm';
import { db } from '../db.js';
import { userTable } from '../db/schema.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"

export async function Login(req, res, next) {
    try {
        const { email, password } = req.body;

        const [user] = await db.select().from(userTable).where(eq(userTable.email, email));

        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const accessToken = generateAccessToken({ id: user.id_user, user_type: user.user_type });
        const refreshToken = generateRefreshToken({ id: user.id });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.status(200).json({ 
            message: "Login exitoso",
            user: { id: user.id_user, email: user.email, user_type: user.user_type }
        });
    } catch (error) {
        next(error);
    }
}