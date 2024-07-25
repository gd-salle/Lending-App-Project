import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AuthDialog from '../components/AuthenticationDialog';
import AdminToolsDialog from '../components/AdminToolsDialog';
import AccountCreationDialog from '../components/AccountCreationDialog';
import ExportConfirmationDialog from '../components/ExportConfirmationDialog';
import CollectionDateDialog from '../components/CollectionDateDialog';
import { handleImport } from '../services/FileService';
import { StackNavigationProp } from '@react-navigation/stack';
import { getConsultantInfo } from '../services/UserService';
import { fetchAllPeriods, fetchLatestPeriodDate } from '../services/CollectiblesService';

type RootStackParamList = {
  Home: undefined;
  Collectibles: undefined;
  DataEntry: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const [consultant, setConsultant] = useState('');
  const [area, setArea] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [authAction, setAuthAction] = useState<string | null>(null);
  const [isAdminToolsVisible, setAdminToolsVisible] = useState(false);
  const [isExportConfirmationVisible, setExportConfirmationVisible] = useState(false);
  const [isAccountCreationVisible, setAccountCreationVisible] = useState(false);
  const [isCollectionDateDialogVisible, setCollectionDateDialogVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchConsultantInfo = async () => {
      try {
        const consultantInfo = await getConsultantInfo();
        if (consultantInfo) {
          setConsultant(consultantInfo.name);
          setArea(consultantInfo.area);
        }
      } catch (error) {
        console.error('Failed to fetch consultant info:', error);
      }
    };

    const fetchAndSetLatestPeriodDate = async () => {
      try {
        const latestDate = await fetchLatestPeriodDate();
        if (latestDate) {
          setCollectionDate(latestDate);
        }
      } catch (error) {
        console.error('Failed to fetch latest period date:', error);
      }
    };

    fetchConsultantInfo();
    fetchAndSetLatestPeriodDate();
  }, []);

  const handleStartCollection = () => {
    setAuthAction('consultant');
    setDialogVisible(true);
  };

  const handleTest = async () => {
    try {
      const periodData = await fetchAllPeriods();
      console.log('Period Data:', periodData);
    } catch (error) {
      console.error('Error fetching period data:', error);
    }
  }
  
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
    } else if (authAction === 'consultant') {
      navigation.navigate('Collectibles');
    }
    setDialogVisible(false);
  };

  const handleExport = async () => {
    try {
      const fileUri = true;
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

  const handleAccountCreation = () => {
    setAdminToolsVisible(false);
    setTimeout(() => {
      setAccountCreationVisible(true);
    }, 300);
  };

  const handleAccountCreationClose = () => {
    setAccountCreationVisible(false);
  };

  const handleAccountCreationConfirm = (consultantName: string, area: string, username: string, password: string) => {
    // Handle account creation logic
    console.log('New Account:', { consultantName, area, username, password });
    setAccountCreationVisible(false);
  };

  const handleCollectionDateDialogClose = () => {
    setCollectionDateDialogVisible(false);
  };

  const handleCollectionDateDialogConfirm = (date: string) => {
    setCollectionDate(date);
    setCollectionDateDialogVisible(false);
    pendingAction();
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>EXTRA CASH LENDING CORP.</Text>
      <TextInput
        label="Consultant"
        value={consultant}
        onChangeText={setConsultant}
        mode="outlined"
        editable={false}
        style={styles.input}
      />
      <TextInput
        label="Area"
        value={area}
        onChangeText={setArea}
        mode="outlined"
        editable={false}
        style={styles.input}
      />
      <TextInput
        label="Date of Collection"
        value={collectionDate}
        onChangeText={setCollectionDate}
        mode="outlined"
        editable={false}
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
      <Button
        mode="outlined"
        onPress={handleTest}
        style={styles.adminButton}
        labelStyle={styles.adminButtonText}
      >
        TEST
      </Button>
      <AuthDialog 
        visible={isDialogVisible} 
        onClose={handleDialogClose} 
        onConfirm={handleDialogConfirm} 
        isConsultantAuth={authAction === 'consultant'} 
      />
      <AdminToolsDialog
        visible={isAdminToolsVisible}
        onClose={() => setAdminToolsVisible(false)}
        onImport={() => {
          setPendingAction(() => () => handleImport(collectionDate));
          setCollectionDateDialogVisible(true);
        }}
        onExport={() => setExportConfirmationVisible(true)}
        onCreateAccount={handleAccountCreation}
      />
      <AccountCreationDialog
        visible={isAccountCreationVisible}
        onClose={handleAccountCreationClose}
        onConfirm={handleAccountCreationConfirm}
      />
      <ExportConfirmationDialog
        visible={isExportConfirmationVisible}
        onConfirm={confirmExport}
        onCancel={() => setExportConfirmationVisible(false)}
        onClose={handleExportDialogClose}
      />
      <CollectionDateDialog
        visible={isCollectionDateDialogVisible}
        onClose={handleCollectionDateDialogClose}
        onConfirm={handleCollectionDateDialogConfirm}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  startButton: {
    width: '100%',
    backgroundColor: '#0A154D',
    borderRadius: 5,
    marginBottom: 10,
  },
  startButtonText: {
    color: '#FFF',
  },
  adminButton: {
    width: '100%',
    borderColor: '#0A154D',
    borderRadius: 5,
    marginBottom: 10,
  },
  adminButtonText: {
    color: '#0A154D',
  },
});
