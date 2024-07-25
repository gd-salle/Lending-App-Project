import { openDatabase } from "./Database";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { fetchLatestPeriodID } from './CollectiblesService';

// Function to insert collectibles data into the database
export const insertCollectiblesIntoDatabase = async (entry: { [key: string]: string }) => {
  try {
    const db = await openDatabase();
    const { account_number, name, remaining_balance, due_date, amount_paid, daily_due, is_printed, period_id } = entry;
    await db.runAsync(
      'INSERT OR IGNORE INTO collectibles (account_number, name, remaining_balance, due_date, amount_paid, daily_due, is_printed, period_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [account_number, name, parseFloat(remaining_balance), due_date, parseFloat(amount_paid), parseFloat(daily_due), is_printed, period_id]
    );
  } catch (error) {
    console.error('Error inserting account data into the database:', error);
  }
};

// Function to handle import of CSV file
export const handleImport = async (selectedCollectionDate: string) => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'text/comma-separated-values',
    copyToCacheDirectory: true
  });
  const assets = result.assets;
  if (!assets) return;

  const file = assets[0];
  const csvFile = {
    name: file.name,
    uri: file.uri,
    mimetype: file.mimeType,
    size: file.size,
  }

  // if (csvFile.mimetype === 'text/comma-separated-values') return;
  try {
    const content = await FileSystem.readAsStringAsync(csvFile.uri);
    await processCSVContent(content, selectedCollectionDate);
  } catch (e) {
    console.log(e);
    Alert.alert('Error', 'Failed to read file');
  }
};

const processCSVContent = async (content: string, selectedCollectionDate: string) => {
  const requiredHeaders = [
    'account_number', 'name', 'remaining_balance', 'due_date',
    'amount_paid', 'daily_due', 'is_printed', 'period_id'
  ];

  const rows = content.split('\n').map(row => row.trim()).filter(row => row.length > 0);
  if (rows.length < 2) {
    Alert.alert('Error', 'The CSV file is empty or does not contain enough data.');
    return;
  }

  const headers = rows[0].split(',').map(header => header.trim());
  
  // Verify that the headers contain all required headers
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    Alert.alert('Error', `Invalid CSV format. Missing headers: ${missingHeaders.join(', ')}`);
    return;
  }

  const data = rows.slice(1).map(row => {
    const values = row.split(',').map(value => value.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {} as { [key: string]: string });
  });

  const latestPeriod = await fetchLatestPeriodID();
  const latestPeriodID = latestPeriod.period_id;

  for (const entry of data) {
    if (entry['period_id'] === '0') {
      entry['period_id'] = latestPeriodID.toString();
    }
    await insertCollectiblesIntoDatabase(entry);
  }

  Alert.alert('Success', 'Collectibles Successfully Imported');
};

