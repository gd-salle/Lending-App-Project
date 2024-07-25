import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Card, Paragraph, Text, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchCollectibles } from '../services/CollectiblesService';

type RootStackParamList = {
  Home: undefined;
  Collectibles: undefined;
  DataEntry: { item: Collectibles }; // Pass the selected item
};

type CollectiblesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Collectibles'>;

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

const Collectibles: React.FC = () => {
  const navigation = useNavigation<CollectiblesScreenNavigationProp>();
  const [data, setData] = useState<Collectibles[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Collectibles[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const collectibles = await fetchCollectibles();
        setData(collectibles);
      } catch (error) {
        console.error('Error fetching collectibles:', error);
      }
    };
    getData();
  }, []);

  const handleCardPress = (item: Collectibles) => {
    navigation.navigate('DataEntry', { item }); // Pass the selected item
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#D2222D'; // red
      case 'Paid':
        return '#007000'; // green
      case 'Partial':
        return '#FFBF00'; // orange
      default:
        return '#0f2045'; // default color
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredItems = data.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filteredItems);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Collectibles" />
      </Appbar.Header>
      <View style={styles.content}>
        <Searchbar
          placeholder="Search"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        {(searchQuery !== '' ? filteredData : data).map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.row}>
                  <Text style={styles.title}>Account Name</Text>
                  <Text style={styles.title}>Balance</Text>
                </View>
                <View style={styles.row}>
                  <Paragraph style={styles.accountNumber}>{item.name}</Paragraph>
                  <Paragraph style={styles.loanAmount}>₱{item.remaining_balance}</Paragraph>
                </View>
                <View style={styles.detailsRow}>
                  <View style={styles.detailsColumn}>
                    <Text style={styles.label}>Account Number</Text>
                    <Text style={styles.dueDate}>{item.account_number}</Text>
                  </View>

                  <View style={styles.detailsColumn}>
                    <Text style={styles.label}>Due Date</Text>
                    <Text style={styles.dueDate}>{item.due_date}</Text>
                  </View>

                  <View style={styles.detailsColumn}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={[styles.status, { color: getStatusColor(item.period_id) }]}>{item.period_id}</Text>
                  </View>

                  <View style={styles.detailsColumn}>
                    {/* <Text style={[styles.label, { color: getStatusColor(item.status) }]}>Status</Text>
                    <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text> */}
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsColumn: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
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
    color: '#0f2045',
  },
  accountNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f2045',
    lineHeight: 28,
  },
  label: {
    fontSize: 8,
    color: '#0f2045',
  },
  dueDate: {
    fontSize: 10,
    color: '#0f2045',
  },
  status: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default Collectibles;
