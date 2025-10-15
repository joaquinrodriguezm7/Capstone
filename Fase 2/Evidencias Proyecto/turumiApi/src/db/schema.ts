import { integer, pgTable, varchar, serial, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const match_status_enum = pgEnum("match_status", ["cancelled", "pending", "matched"]);

export const userTable = pgTable("user", {
    id_user: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({length: 100}).notNull().unique(),
    password: varchar({length: 255}).notNull(),
    name: varchar({length: 100}),
    age: integer(),
    gender: varchar({length: 10}), //Masculino, Femenino, Otro,
    phone_number: varchar({ length: 11 }).unique(),
    user_type: varchar({length: 20}).notNull().references(() => userTypeTable.type), // admin, user_w_housing, user_wo_housing
    created_at: timestamp().notNull().defaultNow() // fecha de creacion del usuario
})

export const userTypeTable= pgTable("user_type", {
    id_user_type: serial().primaryKey(),
    type: varchar({length: 20}).notNull().unique()// admin, user_w_housing, user_wo_housing
})

export const userPhotosTable= pgTable("user_photos", {
    id_user_photos: serial().primaryKey(),
    id_user: integer().notNull().references(() => userTable.id_user),
    photo_key: varchar({length: 200}).notNull(), // URL de la foto del usuario
    is_main: boolean().notNull() // Indica si es la foto principal del usuario
})

export const housingTable = pgTable("housing", {
    id_housing: serial().primaryKey(),
    id_user: integer().notNull().references(() => userTable.id_user),
    address: varchar({length: 200}).notNull(),
    city: varchar({length: 100}).notNull(),
    rent: integer().notNull(),
    size: integer().notNull(), // en metros cuadrados
    available_room: integer().notNull(),
    pets_allowed: boolean().notNull(), // 0 = no, 1 = si
    smoking_allowed: boolean().notNull(), // 0 = no, 1 = si
    created_at: timestamp().notNull() // fecha de creación de la tabla de la vivienda
})

export const housingPhotosTable = pgTable("housing_photos", {
    id_housing_photos: serial().primaryKey(),
    id_housing: integer().notNull().references(() => housingTable.id_housing),
    photo_url: varchar({length: 200}).notNull(), // URL de la foto de la vivienda
    is_main: boolean().notNull() // Indica si es la foto principal de la vivienda
})

export const profileTable = pgTable("profile", {
    id_profile: serial().primaryKey(),
    id_user: integer().notNull().references(() => userTable.id_user).unique(),
    description: varchar({length: 100}),
    smoker: varchar({length: 25}), // 
    drinker: varchar({length: 25}), // 
    pets: integer(),
    lifestyle_schedule: varchar({length: 25}),
    occupation: varchar({length: 30}),
    sociability: varchar({length: 25}),
    id_comuna: integer().notNull().references(() => comunaTable.id_comuna)
})

export const preferenceTable = pgTable("preference", {
    id_preferences: serial().primaryKey(),
    owner_id: integer().notNull().references(() => userTable.id_user),
    preferred_gender: varchar({length: 10}).notNull(), //Masculino, Femenino, Indistinto
    min_age: integer(),
    max_age: integer(),
    min_rent: integer().notNull(),
    max_rent: integer().notNull(),
    min_km_radius: integer().notNull().default(1),
    max_km_radius: integer().notNull().default(180),
    created_at: timestamp().defaultNow()
})

export const regionTable = pgTable("region", {
    id_region: serial().primaryKey(),
    region: varchar({length: 80}).notNull()
})

export const comunaTable = pgTable("comuna", {
    id_comuna: serial().primaryKey(),
    id_region: integer().notNull().references(() => regionTable.id_region),
    comuna: varchar({length: 80}).notNull()
})

export const matchTable = pgTable("match", {
    id: serial().primaryKey(),
    from_id_user: integer().notNull().references(() => userTable.id_user),
    to_id_user: integer().notNull().references(() => userTable.id_user),
    match_status: match_status_enum("match_status").default("pending").notNull(),
    created_at: timestamp().defaultNow(),
    matched_at: timestamp("matchedAt")
})