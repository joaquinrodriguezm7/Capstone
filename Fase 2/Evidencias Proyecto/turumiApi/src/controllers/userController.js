import { userTable } from '../db/schema.js';
import hashPassword from '../utils/hash.js';
import { db } from '../db.js';
import { eq } from "drizzle-orm";

export async function createUser(req, res, next) {
    try {
        const { email, password, user_type } = req.body;

        const hashedPass = await hashPassword(password);

        const [savedUser] = await db.insert(userTable).values({
            email,
            password: hashedPass,
            user_type,
            createdAt: new Date()
        }).returning({
            id_user: userTable.id_user,
            email: userTable.email,
            user_type: userTable.user_type,
            created_at: userTable.created_at
        });

        return res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: savedUser
        });

    } catch (error) {
        next(error);
    }
};

export async function updateUser(req, res, next) {
    try {
        const UserId = parseInt(req.params.id, 10);
        const { name, age, gender, phone_number} = req.body;

        const updates = { name, age, gender, phone_number };
        
        if (isNaN(UserId)) {
            return res.status(400).json({ error: 'Id Invalido'})
        }
        
        const [updateUser] = await db.update(userTable).set(updates).where(eq(userTable.id_user, UserId))
            .returning({
                id_user: userTable.id_user,
                name: userTable.name,
                age: userTable.age,
                gender: userTable.gender,
                phone_number: userTable.phone_number
            });
        
        res.status(200).json({ message: "Usuario actualizado exitosamente", user: updateUser});
    } catch (error) {
        next(error);
    }
};

export async function deleteUser(req, res, next) {
   try {
        const UserId = parseInt(req.params.id, 10);

        if (isNaN(UserId)) {
            return res.status(400).json({ error: 'Id Invalido'})
        }

        const existingUser = await db.select().from(userTable).where(eq(userTable.id_user, UserId))

        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        const user = await db.delete(userTable).where(eq(userTable.id_user, UserId));
        
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        next(error);
    }
};