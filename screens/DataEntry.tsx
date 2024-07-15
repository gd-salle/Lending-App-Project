import * as React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Appbar, Card, Text, TextInput, Checkbox, Button, Divider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ConfirmationDialog from '../components/ConfirmationDialog';

const DataEntry = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(''); // State to track selected payment method
    const [dueDate, setDueDate] = React.useState(new Date());
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [isChequeNumberVisible, setChequeNumberVisible] = React.useState(false); // State to track cheque number visibility
    const [dialogVisible, setDialogVisible] = React.useState(false); // State to manage dialog visibility
    const navigation = useNavigation();
  
    const data = [
      {
        accountNumber: '661928875',
        loanAmount: '₱ 12,700',
        agentName: 'John Smith',
        code: '12345',
        address: 'Lorem Ipsum Dolor',
        date: 'September 12, 2024',
        tin: '123-456-789-000',
      }
    ];
  
    // Handler to update selected payment method and cheque number visibility
    const handleCheckboxChange = (method: string) => {
      setSelectedPaymentMethod(method);
      setChequeNumberVisible(method === 'Cheque'); // Show cheque number input if Cheque is selected
    };
  
    // Function to format the date as YYYY-MM-DD
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    // Handler to update due date
    const onChangeDueDate = (event: any, selectedDate?: Date) => {
      const currentDate = selectedDate || dueDate;
      setShowDatePicker(Platform.OS === 'ios');
      setDueDate(currentDate);
    };
  
    // Handlers for dialog actions
    const handleConfirm = () => {
      // Handle the confirm action
      setDialogVisible(false);
    };
  
    const handleCancel = () => {
      // Handle the cancel action
      setDialogVisible(false);
    };
  
    const handleOpenDialog = () => {
      setDialogVisible(true);
    };
  
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Data Entry" />
        </Appbar.Header>
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            {data.map((item, index) => (
              <Card key={index} style={styles.card}>
                <Card.Content>
                  <View style={styles.row}>
                    <Text style={styles.label}>Account Number</Text>
                    <Text style={styles.label}>Loan Amount</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.accountNumber}>{item.accountNumber}</Text>
                    <Text style={styles.loanAmount}>{item.loanAmount}</Text>
                  </View>
                  <Divider style={{ padding: 2, marginTop: 5, marginBottom: 1 }} />
                  <View style={styles.row}>
                    <Text style={styles.label}>Received From</Text>
                    <Text style={styles.label}>Code</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.agentName}>{item.agentName}</Text>
                    <Text style={styles.code}>{item.code}</Text>
                  </View>
                  <Text style={styles.label}>Address</Text>
                  <Text style={styles.value}>Lorem Ipsum Dolor</Text>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.value}>September 12, 2024</Text>
                  <Text style={styles.label}>Tax Identification Number</Text>
                  <Text style={styles.value}>123-456-789-000</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
          <Text style={styles.label}>Form of Payment</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={selectedPaymentMethod === 'Cash' ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxChange('Cash')}
            />
            <Text style={styles.checkboxLabel}>Cash</Text>
            <Checkbox
              status={selectedPaymentMethod === 'Cheque' ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxChange('Cheque')}
            />
            <Text style={styles.checkboxLabel}>Cheque</Text>
          </View>
  
          {isChequeNumberVisible && (
            <TextInput mode="flat" label="Cheque Number" style={styles.input} />
          )}
          <TextInput mode="flat" label="Payment for" style={styles.input} />
          <TextInput mode="flat" label="Amount to Pay" style={styles.input} />
          <TextInput mode="flat" label="The Sum of" style={styles.input} />
          <TextInput mode="flat" label="Discount" style={styles.input} />
  
          <View style={styles.dateInputContainer}>
            <TextInput
              mode="flat"
              label="Due Date"
              value={formatDate(dueDate)}
              style={[styles.input, { flex: 1 }]}
              editable={false}
            />
            <IconButton
              icon="calendar"
              size={24}
              onPress={() => setShowDatePicker(true)}
            />
          </View>
  
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onChangeDueDate}
            />
          )}
  
          <TextInput mode="flat" label="Conforme" style={styles.input} />
          <TextInput mode="flat" label="By" style={styles.input} />
  
          <Button mode="contained" style={styles.button} onPress={handleOpenDialog}>
            CONFIRM
          </Button>
        </ScrollView>
  
        <ConfirmationDialog
          visible={dialogVisible}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onClose={handleCancel}
        />
      </>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#F2F5FA',
    },
    card: {
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 8,
      color: '#0f2045',
    },
    loanAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#0f2045',
    },
    accountNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#0f2045',
    },
    agentName: {
      fontSize: 18,
      color: '#0f2045',
      lineHeight: 28,
    },
    code: {
      fontSize: 18,
      color: '#0f2045',
    },
    column: {
      flex: 1,
    },
    label: {
      marginTop: 5,
      fontSize: 9,
      color: '#000000',
    },
    value: {
      fontSize: 18,
      marginBottom: 8,
    },
    input: {
      marginBottom: 12,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    checkboxLabel: {
      fontSize: 16,
      marginRight: 16,
    },
    button: {
      marginTop: 10,
      backgroundColor: '#002B5B',
    },
    dateInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
  });
  
  export default DataEntry;