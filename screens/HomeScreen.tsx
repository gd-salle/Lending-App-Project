import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import Button from '../components/Button';
import AuthDialog from '../components/AuthenticationDialog';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { exportDataToFile, importDataFromFile } from '../services/FileService';

const HomeScreen: React.FC = () => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [authAction, setAuthAction] = useState<string | null>(null);

  const handleOpenCollectibles = () => {
    // Handle opening collectibles
  };

  const handleImportData = () => {
    setAuthAction('import');
    setDialogVisible(true);
  };

  const handleExportData = () => {
    setAuthAction('export');
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  const handleDialogConfirm = async (username: string, password: string) => {
    if (authAction === 'import') {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
        copyToCacheDirectory: true
      });

      const assets = result.assets;
      if(!assets) return;
      
      const file = assets[0];
      
      const txtFile = {
        name: file.name,
        uri: file.uri,
        mimetype: file.mimeType,
        size: file.size,
      }
      console.log(result);
      try {
        if (txtFile.mimetype === 'text/plain') {
          const content = await FileSystem.readAsStringAsync(txtFile.uri);
          console.log('File content:', content);
  
          const success = await importDataFromFile(content);
          if (success) {
            Alert.alert('Success', 'Data imported successfully');
          } else {
            Alert.alert('Error', 'Failed to import data');
          }
        }
      } catch (e){
        console.log(e)
      }
    } else if (authAction === 'export') {


    }

    setAuthAction(null);
    setDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LENDING APP</Text>
      <Button title="OPEN COLLECTIBLES" onPress={handleOpenCollectibles} />
      <Button title="IMPORT DATA" onPress={handleImportData} />
      <Button title="EXPORT DATA" onPress={handleExportData} />
      <AuthDialog 
        visible={isDialogVisible} 
        onClose={handleDialogClose} 
        onConfirm={handleDialogConfirm} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
});

export default HomeScreen;
