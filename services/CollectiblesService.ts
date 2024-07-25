import { openDatabase } from './Database';
// import * as SQLite from 'expo-sqlite';

interface Collectibles {
    account_number: number;
    name: string;
    remaining_balance: number;
    due_date: string;
    amount_paid: number;
    daily_due: number;
    is_printed: number;
    period_id: number;
}

interface Period {
  period_id: number;
  date: string;
  isExported: number;
}

export const fetchCollectibles = async (): Promise<Collectibles[]> => {
    try {
        const db = await openDatabase();
        const allRows = await db.getAllAsync('SELECT * FROM collectibles');

        // Map the rows from the database to your Collectibles interface
        const collectibles: Collectibles[] = allRows.map((row: any) => ({
            account_number: row.account_number,
            name: row.name,
            remaining_balance: row.remaining_balance,
            due_date: row.due_date,
            amount_paid: row.amount_paid,
            daily_due: row.daily_due,
            is_printed: row.is_printed,
            period_id: row.period_id,
        }));

        return collectibles;

    } catch (error) {
        console.error('Error fetching collectibles:', error);
        throw error;
    }
};

export const storePeriodDate = async (date: string) => {
    try {
      const db = await openDatabase();
      await db.runAsync(`
        INSERT INTO period (date, isExported)
        VALUES (?, 0)
      `, [date]);
      console.log('Date stored successfully:', date);
    } catch (error) {
      console.error('Error storing date:', error);
      throw error;
    }
};

export const fetchAllPeriods = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync(`
      SELECT * FROM period
    `);
    return result as Period[];
  } catch (error) {
    console.error('Error fetching period data:', error);
    throw error;
  }
}

export const fetchLatestPeriodID = async () => {
    try {
      const db = await openDatabase();
      const result = await db.getFirstAsync(`
        SELECT period_id FROM period
        ORDER BY period_id DESC
        LIMIT 1
      `);
      return result as Period;
    } catch (error) {
      console.error('Error fetching period data:', error);
      throw error;
    }
};

export const fetchLatestPeriodDate = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getFirstAsync<{ date: string }>(`
      SELECT date FROM period
      ORDER BY period_id DESC
      LIMIT 1
    `);
    return result ? result.date : null;
  } catch (error) {
    console.error('Error fetching latest period date:', error);
    throw error;
  }
};

export const fetchPeriodDateById = async (periodId: number) => {
  try {
    const db = await openDatabase();
    const result = await db.getFirstAsync<{ date: string }>(`
      SELECT date FROM period
      WHERE period_id = ?
    `, [periodId]);
    return result ? result.date : null;
  } catch (error) {
    console.error('Error fetching period date by ID:', error);
    throw error;
  }
};