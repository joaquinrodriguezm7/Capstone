import { Router } from "express";
import { db } from "../db";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { createUser, deleteUser, updateUser } from "../controllers/userController";
import { createUserValidators, updateUserValidators } from "../validators/userValidator";
import validate from "../middleware/validate";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const allUsers = await db.select().from(userTable);
        res.json(allUsers);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    const UserId = parseInt(req.params.id, 10);

    if (isNaN(UserId)) {
        return res.status(400).json({ error: 'ID Invalido' });
    }

    try {
        const user = await db.select().from(userTable).where(eq(userTable.id_user, UserId));

        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user[0]);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', createUserValidators, validate, createUser);

router.put('/:id', updateUserValidators, validate, updateUser);

router.delete('/:id', deleteUser);

export default router;