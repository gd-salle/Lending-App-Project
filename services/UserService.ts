import { openDatabase} from './Database';

export const getAdmin = async (username: string, password: string) => {
  try{
    const db = await openDatabase();
    const user = await db.getFirstAsync(
      'SELECT * FROM admin_accounts WHERE username = ? AND password = ?',
      [username, password]
    );
    return user;
  } catch(error){
    console.log('Error getting admin:', error);
    throw error;
  }
}
// Consultant Authentication
export const getConsultant = async (username: string, password: string) => {
  try {
    const db = await openDatabase();
    const user = await db.getFirstAsync(
      'SELECT * FROM consultant WHERE name = ? AND password = ?',
      [username, password]
    );
    return user;
  } catch (error) {
    console.error('Error in getConsultant:', error);
    throw error;
  }
};

interface Consultant {
  consultant_id: number;
  name: string;
  area: string;
}
// Get Consultant Information
export const getConsultantInfo = async ()=> {
  try {
    const db = await openDatabase();
    const result = await db.getFirstAsync<{ consultant_id: number, name: string, area: string }>(
      'SELECT consultant_id, name, area FROM consultant LIMIT 1'
    );

    if (result) {
      const consultantInfo: Consultant = {
        consultant_id: result.consultant_id,
        name: result.name,
        area: result.area,
      };
      return consultantInfo;
    }

    return null;
  } catch (error) {
    console.error('Error in getConsultantInfo:', error);
    throw error; // rethrowing the error for upper layers to handle
  }
};

// Add a new consultant to the database
export const addConsultant = async (name: string, username: string, admin_passcode: string, area: string) => {
  try {
    const db = await openDatabase();
    console.log('Database connection established for adding consultant');

    await db.runAsync(
      'INSERT INTO consultant (name, admin_passcode, password, area) VALUES (?, ?, ?, ?)',
      [name, username, admin_passcode, area]
    );

    console.log('Consultant added successfully');
  } catch (error) {
    console.error('Error adding consultant:', error);
    throw error; // rethrowing the error for upper layers to handle
  }
};
