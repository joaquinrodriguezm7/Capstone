import { Router } from "express";
import { db } from "../db";
import { preferenceTable } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get('/:id', async (req, res) => {
    const UserId = parseInt(req.params.id, 10);
    
    if (isNaN(UserId)) {
        return res.status(400).json({ error: 'ID Invalido' });
    }

    try {
        const preference = await db.select().from(preferenceTable).where(eq(preferenceTable.owner_id, UserId));

        if (preference.length === 0) {
            return res.status(404).json({ error: 'Preferencia no encontrada' });
        }

        res.json(preference[0]);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;