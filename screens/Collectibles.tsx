import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Card, Paragraph, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Collectibles = () => {
  const navigation = useNavigation();

  const data = [
    {
      accountNumber: '123456789',
      loanAmount: '₱ 151,500',
      dueDate: 'July 13, 2024',
      status: 'Pending',
      statusColor: 'red'
    },
    {
      accountNumber: '374851927',
      loanAmount: '₱ 8,000',
      dueDate: 'July 13, 2024',
      status: 'Paid',
      statusColor: 'green'
    },
    {
      accountNumber: '661928875',
      loanAmount: '₱ 12,700',
      dueDate: 'July 13, 2024',
      status: 'Partial',
      statusColor: 'orange'
    }
  ];

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Collectibles"/>
      </Appbar.Header>
      <View style={styles.content}>
        {data.map((item, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                <Text style={styles.title}>Account Number</Text>
                <Text style={styles.title}>Loan Amount</Text>
              </View>
              <View style={styles.row}>
                <Paragraph style={styles.accountNumber}>{item.accountNumber}</Paragraph>
                <Paragraph style={styles.loanAmount}>{item.loanAmount}</Paragraph>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Due Date</Text>
                <Text style={styles.label}>Status</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.dueDate}>{item.dueDate}</Text>
                <Text style={[styles.status, { color: item.statusColor }]}>{item.status}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8'
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 8,
    color: '#0f2045',
  },
  loanAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f2045'
  },
  accountNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f2045',
    lineHeight: 28,
  },
  label: {
    fontSize: 8,
    color: '#0f2045'
  },
  dueDate: {
    fontSize: 10,
    color: '#0f2045'
  },
  status: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  
});

export default Collectibles;
