import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export async function connectDB() {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log('💾 Successfully connected to the SQLite database.');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            code TEXT,
            difficulty TEXT,
            topic TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('📊 Problems table is verified and ready.');
}

export { db };