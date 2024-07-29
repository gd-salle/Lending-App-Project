import * as SQLite from 'expo-sqlite';

const databaseName = 'eclc_20.db';

export const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName,{useNewConnection: true});
    console.log('Database opened successfully');

    // Check if tables already exist
    const tablesCheck = await db.getAllAsync(`
      SELECT name FROM sqlite_master WHERE type='table' AND name IN (
        'admin_accounts', 'consultant', 'period', 'collectibles'
      )
    `);
    console.log('Tables check result:', tablesCheck);
    if (tablesCheck.length === 4) {
      return db;
    }

    console.log('Creating tables...');
    // If tables do not exist, create them
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS admin_accounts (
        username TEXT NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS consultant (
        consultant_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL,
        admin_passcode TEXT NOT NULL,
        password TEXT NOT NULL,
        area TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS period (
        period_id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        isExported INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS collectibles (
        account_number INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        remaining_balance REAL NOT NULL,
        due_date TEXT NOT NULL,
        amount_paid REAL NOT NULL DEFAULT 0.00,
        daily_due REAL NOT NULL,
        is_printed INTEGER NOT NULL DEFAULT 0,
        period_id INTEGER NOT NULL REFERENCES period(period_id)
      );

      INSERT INTO admin_accounts (username, password) 
      SELECT 'admin', 'admin'
      WHERE NOT EXISTS (SELECT 1 FROM admin_accounts WHERE username = 'admin');
    `);

    console.log('Tables created successfully');
    return db;
  } catch (error) {
    console.error('Error creating/opening database:', error);
    throw error;
  }
};
// CREATE TABLE IF NOT EXISTS export_accounts (
//   account_number INTEGER PRIMARY KEY NOT NULL,
//   name TEXT NOT NULL,
//   remaining_balance REAL NOT NULL,
//   amount_paid REAL NOT NULL,
//   type TEXT NOT NULL,
//   cheque_nubmer TEXT NOT NULL DEFAULT 'N/A',
//   status TEXT NOT NULL DEFAULT 'Pending'
// );

// INSERT INTO consultant (name, password, area, date)
// SELECT 'admin', 'admin', 'Naga City',date('now', 'localtime')
// WHERE NOT EXISTS (SELECT 1 FROM consultant WHERE name = 'admin');

// INSERT OR IGNORE INTO accounts (account_number, name, remaining_balance, due_date, daily_due, status)
// VALUES (123456789, 'Jose Rizal', 2500.0, '2024-12-22', 50.0, 'Pending'),
//        (987654321, 'Juan Luna', 0.0, '2024-11-15', 75.0, 'Paid'),
//        (567891234, 'Andres Bonifacio', 1800.0, '2024-10-05', 45.0, 'Partial')
// ;