import { openDatabase } from './Database';

// User Authentication
export const getUser = async (username: string, password: string) => {
  const db = await openDatabase();
  const user = await db.getFirstAsync(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password]
  );
  return user;
};
