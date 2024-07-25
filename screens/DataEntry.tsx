import * as React from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import { Appbar, Card, Text, TextInput, Checkbox, Button, Divider} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { fetchPeriodDateById } from '../services/CollectiblesService';

type RootStackParamList = {
  Home: undefined;
  Collectibles: undefined;
  DataEntry: { item: Collectibles };
};

type DataEntryRouteProp = RouteProp<RootStackParamList, 'DataEntry'>;

interface Collectibles {
  account_number: number;
  name: string;
  remaining_balance: number;
  due_date: string;
  amount_paid: number;
  daily_due: number;
  is_printed: number;
  period_id: number;
}

const DataEntry = () => {
  const route = useRoute<DataEntryRouteProp>();
  const navigation = useNavigation();

  const { item } = route.params; // Access the passed data

  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(''); // State to track selected payment method
  const [isChequeNumberVisible, setChequeNumberVisible] = React.useState(false); // State to track cheque number visibility
  const [dialogVisible, setDialogVisible] = React.useState(false); // State to manage dialog visibility
  const [periodDate, setPeriodDate] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPeriodDate = async () => {
      try {
        const date = await fetchPeriodDateById(item.period_id);
        setPeriodDate(date);
      } catch (error) {
        console.error('Failed to fetch period date:', error);
      }
    };

    fetchPeriodDate();
  }, [item.period_id]);

  // Handler to update selected payment method and cheque number visibility
  const handleCheckboxChange = (method: string) => {
    setSelectedPaymentMethod(method);
    setChequeNumberVisible(method === 'Cheque'); // Show cheque number input if Cheque is selected
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
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Data Entry" />
        </Appbar.Header>
        
        <ScrollView contentContainerStyle={styles.container}>
          <View>
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.row}>
                    <Text style={styles.label}>Account Number</Text>
                    <Text style={styles.label}>Balance</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.accountNumber}>{item.account_number}</Text>
                    <Text style={styles.loanAmount}>₱ {item.remaining_balance}</Text>
                  </View>
                  <Divider style={{ padding: 2, marginTop: 5, marginBottom: 1 }} />
                  <View style={styles.row}>
                    <Text style={styles.label}>Account Name</Text>
                    <Text style={styles.label}>Daily Due</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.agentName}>{item.name}</Text>
                    <Text style={styles.value}>₱ {item.daily_due}</Text>
                  </View>
                  <Text style={styles.label}>Due Date</Text>
                  <Text style={styles.value}>{item.due_date}</Text>
                </Card.Content>
              </Card>
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
          
          <View style={styles.dateContainer}>
            <TextInput
              mode="flat"
              label="Date"
              value={periodDate || 'Loading...'}
              style={[styles.input, { flex: 1 }]}
              editable={false}
            />
          </View>
          
          {/* <TextInput mode="flat" label="Payment for" style={styles.input} /> */}
          <TextInput mode="flat" label="Amount Paid" style={styles.input} />
          <TextInput mode="flat" label="The Sum of" style={styles.input} />
          <TextInput mode="flat" label="Creditors Name" style={styles.input} />
          {/* <TextInput mode="flat" label="By" style={styles.input} /> */}
  
          <ConfirmationDialog
            visible={dialogVisible}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onClose={handleCancel}
          />
        </ScrollView>
  
        <Button mode="contained" style={styles.button} onPress={handleOpenDialog}>
          CONFIRM
        </Button>
      </View>
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
      fontWeight: 'bold',
      fontSize: 18,
      color: '#0f2045',
      lineHeight: 28,
    },
    code: {
      fontWeight: 'bold',
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
      fontWeight: 'bold',
      fontSize: 18,
      color: '#0f2045',
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
      marginHorizontal: 16,
      marginVertical: 10,
      backgroundColor: '#002B5B',
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
  
  export default DataEntry;
