import "dotenv/config";
import express from "express";
// import cors from "cors";
// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favouriteTable } from "./db/schema.js";
import { eq, and } from "drizzle-orm";
const app = express();

// app.use(cors());
app.use(express.json());

// const db = drizzle(postgres(process.env.DATABASE_URL));

app.post('/api/favourites', async (req, res) => {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;
        if (!userId || !recipeId || !title || !image || !cookTime || !servings) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const result = await db.insert(favouriteTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings,
        })
            .returning();
        return res.status(201).json({ message: "Favourite added successfully", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

app.delete('/api/favourites/:userId/:recipeId', async (req, res) => {
    try {
        const { userId, recipeId } = req.params;
        const result = await db.delete(favouriteTable).where(and(eq(favouriteTable.userId, userId), eq(favouriteTable.recipeId, parseInt(recipeId))));
        return res.status(200).json({ message: "Favourite deleted successfully", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

app.get('/api/favourites/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db.select().from(favouriteTable).where(eq(favouriteTable.userId, userId));
        return res.status(200).json({ message: "Favourites fetched successfully", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
});