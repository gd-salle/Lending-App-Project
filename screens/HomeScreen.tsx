import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Button from '../components/Button';
import AuthDialog from '../components/AuthenticationDialog';

const HomeScreen: React.FC = () => {
  const [isDialogVisible, setDialogVisible] = useState(false);

  const handleOpenCollectibles = () => {
    // Handle opening collectibles
  };

  const handleImportData = () => {
    setDialogVisible(true);
  };

  const handleExportData = () => {
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  const handleDialogConfirm = (username: string, password: string) => {
    // Handle user authentication
    console.log(`Username: ${username}, Password: ${password}`);
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
