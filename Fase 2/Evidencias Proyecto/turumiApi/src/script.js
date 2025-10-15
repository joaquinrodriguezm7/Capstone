import dotenv from "dotenv";
dotenv.config();

import { db } from "./db.js";
import { userTable } from "./db/schema.js";
import { eq } from "drizzle-orm";
import hashPassword from "./utils/hash.js";

async function resetPasswords() {
  try {
    const users = await db.select().from(userTable);

    for (const user of users) {
      const hashed = await hashPassword("12345678");

      await db
        .update(userTable)
        .set({ password: hashed })
        .where(eq(userTable.id_user, user.id_user));

      console.log(`Password reseteada y hasheada para: ${user.email}`);
    }

    console.log("✅ Todas las contraseñas fueron actualizadas correctamente.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al actualizar las contraseñas:", error);
    process.exit(1);
  }
}

resetPasswords();
