import { eq } from 'drizzle-orm';
import { db } from "../db.js";
import { profileTable } from '../db/schema.js';

export async function getProfile(req, res, next) {
    try {
        const UserId = req.user.id;

        if (!UserId) {
            return res.status(401).json({ message: "No se ha proporcionado ningún token" });
        }

        const [preferences] = await db.select().from(profileTable).where(eq(profileTable.id_user, UserId));

        return res.status(200).json(preferences);
    } catch (error) {
        next(error);
    }
};

export async function createProfile(req, res, next) {
    try {
        const UserId = req.user.id;
 
        if (!UserId) {
            return res.status(401).json({ message: "No se ha proporcionado ningún token" });
        }

        const existingProfile = await db.select().from(profileTable).where(eq(profileTable.id_user, UserId));

        if (existingProfile.length > 0) {
            return res.status(400).json({ message: "Este usuario ya tiene un perfil" });
        }

        const createPayload = Object.fromEntries(
            Object.entries(req.body).filter(([_, value]) => value !== undefined)
        );

        const [savedProfile] = await db.insert(profileTable).values({ id_user: UserId, ...createPayload})
            .returning({
                id_user: profileTable.id_user,
                description: profileTable.description,
                smoker: profileTable.smoker,
                drinker: profileTable.drinker,
                pets: profileTable.pets,
                lifestyle_schedule: profileTable.lifestyle_schedule,
                occupation: profileTable.occupation,
                sociability: profileTable.sociability,
                id_comuna: profileTable.id_comuna
            });

        return res.status(201).json({ message: "Perfil creado correctamente", profile: savedProfile})
    } catch (error) {
        next(error);
    }
}

export async function updateProfile(req, res, next) {
    try {
        const UserId = req.user.id

        if (!UserId) {
            return res.status(401).json({ message: "No se ha proporcionado ningún token" });
        }
    
        const updatePayload = Object.fromEntries(
            Object.entries(req.body).filter(([_, value]) => value !== undefined)
        );
    
        const [updateProfile] = await db.update(profileTable).set(updatePayload).where(eq(profileTable.id_user, UserId))
            .returning({
                id_user: profileTable.id_user,
                description: profileTable.description,
                smoker: profileTable.smoker,
                drinker: profileTable.drinker,
                pets: profileTable.pets,
                lifestyle_schedule: profileTable.lifestyle_schedule,
                occupation: profileTable.occupation,
                sociability: profileTable.sociability
            });
        
        res.status(200).json({ message: "Perfil actualizado correctamente", profile: updateProfile})
    } catch (error) {
        next(error);
    }
};
