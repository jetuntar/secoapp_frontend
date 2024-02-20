import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import apiUrl from '../../apiConfig';

const AddressScreen = ({ navigation }: any) => {
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const getUserAddress = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/get-address/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      if (data.length > 0) {
        const firstAddress = data[0]; // Get the first address object
        setRecipient(firstAddress.recipient);
        setAddress(firstAddress.address);
        setPhone(firstAddress.phone);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAddress(); // Fetch address when component mounts
  }, []);

  const saveAddress = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const newAddress = { recipient, address, phone }; // Collect new address data
      const response = await fetch(`${apiUrl}/api/address/${userId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAddress)
      });
      if (!response.ok) {
        throw new Error('Failed to save address');
      }
      // Optionally handle success
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Recipient:</Text>
      <TextInput
        style={styles.input}
        value={recipient}
        onChangeText={(text) => setRecipient(text)} // Update recipient state
      />
      <Text>Address:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={(text) => setAddress(text)} // Update address state
      />
      <Text>Phone:</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={(text) => setPhone(text)} // Update phone state
        keyboardType="phone-pad"
      />
      <Button title="Save" onPress={saveAddress} />
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
