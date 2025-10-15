import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../s3Client.js"
import { db } from "../db.js"
import { userPhotosTable } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import dotenv from 'dotenv';

dotenv.config();

export async function uploadPhoto(req, res, next){
    try {
        const UserId = req.user.id;

        if (!UserId) {
            return res.status(401).json({ message: "No se ha proporcionado ningún token" });
        }
        
        const files = req.files;

        if (!files){ 
            return res.status(400).json({ error: "No se recibio ningúna imagen" });
        }

        if (files.length > 6 ) {
            return res.status(400).json({ error: "Solo se permiten hasta 6 imágenes" });
        }

        const uploadedImages = [];

         for (const file of files) {
            const fileKey = `users/${UserId}/${Date.now()}_${file.originalname}`;

            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype
            };

            await s3.send(new PutObjectCommand(uploadParams));

            const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

            await db.insert(userPhotosTable).values({
                id_user: UserId,
                photo_key: fileKey,
                is_main: false
            });

            uploadedImages.push({ url });
        }

        res.status(201).json({ message: "Imágenes subida", images: uploadedImages});
    } catch (error) {
        next(error);
    }
};

export async function getPhoto(req, res, next){
    try {
        const UserId = req.user.id;

        if (!UserId) {
            return res.status(401).json({ message: "No se ha proporcionado ningún token" });
        }

        const photo = await db.select().from(userPhotosTable).where((eq(userPhotosTable.id_user, UserId)));
        if (!photo) {
            return res.status(404).json({ error: "No se encontró la foto" });
        }
        
        const photo_key = photo[0]["photo_key"]

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: photo_key,
        });

        const response = await s3.send(command);

        res.setHeader("Content-Type", response.ContentType);
        response.Body.pipe(res);
    } catch (error) {
        next(error);
    }
};

export async function deletePhoto(req, res, next) {
    try {
        const UserId = req.user.id;
        const photoId = parseInt(req.params.photoId, 10);

        if (!photoId) {
            return res.status(401).json({ message: "No se ha ingresado ID de imagen" });
        }

        const [photo] = await db.select().from(userPhotosTable).
            where(
                and(
                    eq(userPhotosTable.id_user_photos, photoId), eq(userPhotosTable.id_user, UserId)));


        if (!photo) {
            return res.status(404).json({ message: "No se ha encontrado la imagen" });
        }
        
        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: photo.photo_key,
        }))

        await db.delete(userPhotosTable)
            .where(eq(userPhotosTable.id_user_photos, photoId));

        res.status(200).json({ message: "Imagen eliminada correctamente" });
    } catch (error) {
        next(error);
    }
};