import * as SQLite from 'expo-sqlite';

const databaseName = 'lendingApp.db';

export const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(databaseName);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );
    INSERT INTO users (username, password) 
    SELECT 'admin', 'admin'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
  `);

  return db;
};
