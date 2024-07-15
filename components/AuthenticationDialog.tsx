import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { getUser } from '../services/UserService';

interface AuthDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (username: string, password: string) => void;
  isAgentAuth: boolean;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ visible, onClose, onConfirm, isAgentAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!visible) {
      setUsername('');
      setPassword('');
    }
  }, [visible]);

  const handleConfirm = async () => {
    const user = await getUser(username, password);
    if (user) {
      onConfirm(username, password);
      setUsername('');
      setPassword('');
      onClose();
    } else {
      Alert.alert('Authentication Failed', 'Invalid username or password');
      setPassword('');
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.titleContainer}>
            <View style={styles.verticalLine} />
            <Text style={styles.title}>
              {isAgentAuth ? 'This action requires an Agent Authentication' : 'This action requires an Admin Authentication'}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            CONFIRM
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    width: 350,
    padding: 20,
    backgroundColor: '#EBF4F6',
    borderRadius: 10,
    alignItems: 'flex-start',
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  verticalLine: {
    width: 10,
    height: '100%',
    backgroundColor: '#0A154D',
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A154D',
    flexShrink: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#0A154D',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
  },
});

export default AuthDialog;
