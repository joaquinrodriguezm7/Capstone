import { Router } from "express";
import { db } from "../db";
import { usersTable } from "../db/schema";
const router = Router();
router.get('/', async (req, res) => {
    try {
        const allUsers = await db.select().from(usersTable);
        res.json(allUsers);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;
//# sourceMappingURL=users.js.map