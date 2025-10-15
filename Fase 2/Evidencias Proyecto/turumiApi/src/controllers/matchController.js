import { db } from "../db.js";
import { matchTable } from "../db/schema.js";
import { eq, and, or } from "drizzle-orm";

export async function createMatch(req, res, next) {
    const UserId = req.user.id;

    if (!UserId) {
        return res.status(401).json({ message: "No se ha proporcionado ningún token" });
    }

    const targetUserId = Number(req.body.targetUserId);

    if (!targetUserId) {
        return res.status(401).json({ message: "No se ha proporcionado usuario objetivo para el match" });
    }

    if (targetUserId === UserId) {
        return res.status(400).json({ message: "No puedes hacer match contigo mismo" });
    }

    try {
        const existing = await db.select().from(matchTable).where(
            or(
                and(eq(matchTable.from_id_user, UserId), eq(matchTable.to_id_user, targetUserId)),
                and(eq(matchTable.from_id_user, targetUserId), eq(matchTable.to_id_user, UserId))
            )
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Ya existe un like o match entre estos usuarios" });
        }

        const [savedMatch] = await db.insert(matchTable).values({
            from_id_user: UserId,
            to_id_user: targetUserId,
            status: "pending"
        }).returning({
            from_id_user: matchTable.from_id_user,
            target_id_user: matchTable.to_id_user,
            match_status: matchTable.match_status
        });

        return res.status(201).json({ message: "Match creado exitosamente", match: savedMatch });
    } catch (error) {
        next(error);
    }
};

export async function getMatch(req, res, next) {
    const UserId = req.user.id;

    if (!UserId) {
        return res.status(401).json({ message: "No se ha proporcionado ningún token" });
    }

    try{
        const matches = await db.select().from(matchTable).where
            (or(
                eq(matchTable.from_id_user, UserId), 
                eq(matchTable.to_id_user, UserId))
            );

        return res.status(200).json({ "matches": matches });
    } catch(error) {
        next(error);
    }
};

export async function updateMatch(req, res, next) {
    const UserId = req.user.id;
    const matchId = Number(req.body.matchId);
    const like = req.body.like;

    if (!UserId) {
        return res.status(401).json({ message: "No se ha proporcionado ningún token" });
    }

    if (!matchId || like === undefined) {
        return res.status(400).json({ message: "Faltan datos para actualizar el match (matchId o like)" });
    }

    try {
        const [matchExists] = await db.select().from(matchTable).where(
                and(
                    eq(matchTable.id, matchId),
                    or(
                        eq(matchTable.from_id_user, UserId),
                        eq(matchTable.to_id_user, UserId)
                    )
                )
            );


        if (!matchExists) {
            return res.status(400).json({ message: "No existe match pendiente entre estos usuarios" });
        }

        if(matchExists.match_status==="matched") {
            return res.status(409).json({ message: "Ya existe match entre estos usuarios" });
        }

        if(matchExists.to_id_user !== UserId) {
            return res.status(400).json({ message: "El usuario que da match no es el correcto" });
        }

        const newMatchStatus = like ? "matched" : "cancelled";

        const [updatedMatch] = await db.update(matchTable).set({match_status:newMatchStatus, matched_at: new Date()}).where(
                and(eq(matchTable.id, matchId), eq(matchTable.to_id_user, UserId))
            ).returning({
                id: matchTable.id,
                from_id_user: matchTable.from_id_user,
                target_id_user: matchTable.to_id_user,
                match_status: matchTable.match_status,
                matched_at: matchTable.matched_at
            });

        return res.status(200).json({ message: "Match actualizado correctamente", match: updatedMatch });
    } catch (error) {
        next(error);
    }
};