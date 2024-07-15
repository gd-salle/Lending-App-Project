import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface AdminToolsDialogProps {
  visible: boolean;
  onClose: () => void;
  onImport: () => void;
  onExport: () => void;
}

const AdminToolsDialog: React.FC<AdminToolsDialogProps> = ({
  visible,
  onClose,
  onImport,
  onExport,
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.titleContainer}>
            <View style={styles.verticalLine}/>
            <Text style={styles.title}>Admin Tools</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Button
            mode="contained"
            onPress={onImport}
            style={styles.importButton}
            labelStyle={styles.buttonText}
          >
            IMPORT COLLECTIBLES
          </Button>
          <Button
            mode="outlined"
            onPress={onExport}
            style={styles.exportButton}
            labelStyle={styles.buttonTextOutlined}
          >
            EXPORT COLLECTIONS
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
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A154D',
    flexShrink: 1,
  },
  verticalLine: {
    width: 10,
    height: '100%',
    backgroundColor: '#0A154D',
    marginRight: 10,
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  importButton: {
    width: '100%',
    backgroundColor: '#0A154D',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  exportButton: {
    width: '100%',
    borderColor: '#0A154D',
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
  },
  buttonTextOutlined: {
    color: '#0A154D',
  },
});

export default AdminToolsDialog;
