import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import WarningConfirmationDialog from './WarningConfirmationDialog';

interface ConfirmationDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ visible, onConfirm, onCancel, onClose }) => {
  const [warningVisible, setWarningVisible] = useState(false);

  const handleConfirm = () => {
    setWarningVisible(true);
  };

  const handleWarningConfirm = () => {
    setWarningVisible(false);
    onConfirm();
  };

  const handleWarningCancel = () => {
    setWarningVisible(false);
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
      >
        <View style={styles.container}>
          <View style={styles.dialog}>
            <View style={styles.titleContainer}>
              <View style={styles.verticalLine} />
              <Text style={styles.title}>Do you wish to continue?</Text>
            </View>
            <Text style={styles.subtitle}>
              Please review the information carefully before proceeding.
              Once submitted, this data cannot be modified.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                <Text style={styles.buttonTextConfirm}>CONFIRM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.buttonTextCancel}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <WarningConfirmationDialog
        visible={warningVisible}
        onConfirm={handleWarningConfirm}
        onCancel={handleWarningCancel}
        onClose={handleWarningCancel}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    width: 350,
    padding: 20,
    backgroundColor: '#F2F5FA',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  verticalLine: {
    width: 10,
    height: '100%',
    backgroundColor: '#0A154D',
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A154D',
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    paddingLeft: 6,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#0A154D',
  },
  cancelButton: {
    borderColor: '#0A154D',
    borderWidth: 2,
  },
  buttonTextConfirm: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  buttonTextCancel: {
    color: '#0A154D',
    fontSize: 14,
  },
});

export default ConfirmationDialog;