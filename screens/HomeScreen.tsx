import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import AuthDialog from '../components/AuthenticationDialog';
import AdminToolsDialog from '../components/AdminToolsDialog';
import ExportConfirmationDialog from '../components/ExportConfirmationDialog';
import { exportDataToFile, importDataFromFile } from '../services/FileService';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Collectibles: undefined;
  DataEntry: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const [agent, setAgent] = useState('');
  const [area, setArea] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [authAction, setAuthAction] = useState<string | null>(null);
  const [isAdminToolsVisible, setAdminToolsVisible] = useState(false);
  const [isExportConfirmationVisible, setExportConfirmationVisible] = useState(false);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleStartCollection = () => {
    setAuthAction('agent');
    setDialogVisible(true);
  };

  const handleAdminTools = () => {
    setAuthAction('admin');
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  const handleDialogConfirm = (username: string, password: string) => {
    // Perform necessary actions based on authentication
    if (authAction === 'admin') {
      setAdminToolsVisible(true);
    } else if (authAction === 'agent') {
      navigation.navigate('DataEntry');
    }
    setDialogVisible(false);
  };

  const handleImport = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'text/plain',
      copyToCacheDirectory: true
    });

    const assets = result.assets;
    if (!assets) return;

    const file = assets[0];
    const txtFile = {
      name: file.name,
      uri: file.uri,
      mimetype: file.mimeType,
      size: file.size,
    };

    try {
      if (txtFile.mimetype === 'text/plain') {
        const content = await FileSystem.readAsStringAsync(txtFile.uri);
        console.log('File content:', content);

        const success = await importDataFromFile(content);
        if (success) {
          Alert.alert('Success', 'Collectibles Successfully Imported');
        } else {
          Alert.alert('Error', 'Failed to import data');
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to read file');
    }
  };

  const handleExport = async () => {
    try {
      const fileUri = await exportDataToFile();
      Alert.alert('Success', `Data exported to ${fileUri}`);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const confirmExport = async () => {
    setExportConfirmationVisible(false);
    handleExport();
  };

  const handleExportDialogClose = () => {
    setExportConfirmationVisible(false);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>EXTRA CASH LENDING CORP.</Text>
      <TextInput
        label="Agent"
        value={agent}
        onChangeText={setAgent}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Area"
        value={area}
        onChangeText={setArea}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Date of Collection"
        value={collectionDate}
        onChangeText={setCollectionDate}
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleStartCollection}
        style={styles.startButton}
        labelStyle={styles.startButtonText}
      >
        START COLLECTION
      </Button>
      <Button
        mode="outlined"
        onPress={handleAdminTools}
        style={styles.adminButton}
        labelStyle={styles.adminButtonText}
      >
        ADMIN TOOLS
      </Button>
      <AuthDialog 
        visible={isDialogVisible} 
        onClose={handleDialogClose} 
        onConfirm={handleDialogConfirm} 
        isAgentAuth={authAction === 'agent'} 
      />
      <AdminToolsDialog
        visible={isAdminToolsVisible}
        onClose={() => setAdminToolsVisible(false)}
        onImport={handleImport}
        onExport={() => setExportConfirmationVisible(true)}
      />
      <ExportConfirmationDialog
        visible={isExportConfirmationVisible}
        onConfirm={confirmExport}
        onCancel={() => setExportConfirmationVisible(false)}
        onClose={handleExportDialogClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBF4F6',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#0A154D',
  },
  input: {
    width: '80%',
    marginBottom: 15,
  },
  startButton: {
    width: '80%',
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: '#071952',
  },
  startButtonText: {
    color: '#FFF',
  },
  adminButton: {
    width: '80%',
    marginTop: 10,
    borderColor: '#071952',
    borderRadius: 5,
    borderWidth: 2,
  },
  adminButtonText: {
    color: '#071952',
  },
});

export default HomeScreen;
