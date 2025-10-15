import { Router } from "express";
import { db } from "../db";
import { userTypeTable } from "../db/schema";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const alluserTypeTable = await db.select().from(userTypeTable);
        res.json(alluserTypeTable);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
