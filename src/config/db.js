import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null; // Veritabanı bağlantımızı tutacak değişken

export const connectDB = async () => {
    try {
        db = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });
        
        console.log('✅ SQLite bağlandı!');
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
        console.log('✅ Tablolar hazır!');
    } catch (error) {
        console.log("❌ Bağlantı hatası: ", error);
    }
};

// Diğer dosyalardan veritabanını çağırmak için bu fonksiyonu kullanacağız
export const getDB = () => db;