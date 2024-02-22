import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../apiConfig';
import { COLORS, SPACING } from '../theme/theme';
import Geolocation from '@react-native-community/geolocation';

const AddressScreen = ({ navigation }: any) => {
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

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

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    getCurrentLocation();
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
    <View style={styles.ScreenContainer}>
      <View style={styles.HeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.edit}>
          <Image
            source={require('../assets/icons/arrow-circle-left.png')}
            style={{
            height: 36,
            width: 36,
            marginRight: 8
            }}
            resizeMode='contain'
          />
            <Text style={styles.address}>Set Address</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Recipient</Text>
      <TextInput
        style={styles.input}
        value={recipient}
        onChangeText={(text) => setRecipient(text)} // Update recipient state
      />
      <Text style={styles.title}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={(text) => setAddress(text)} // Update address state
      />
      <Text style={styles.title}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={(text) => setPhone(text)} // Update phone state
        keyboardType="phone-pad"
      />
      {/* 
      <Text style={styles.title}>Latitude</Text>
      <TextInput
        style={styles.input}
        value={latitude ? latitude.toString() : ''}
        editable={false}
      />

      <Text style={styles.title}>Longitude</Text>
      <TextInput
        style={styles.input}
        value={longitude ? longitude.toString() : ''}
        editable={false}
      /> */}
      {/* <Text style={styles.title}>Notes:</Text>
      <TextInput
        style={styles.input}
        value={recipient}
        onChangeText={(text) => setRecipient(text)} // Update notes state
      /> */}
      <View style={styles.nav}>
        <View style={styles.button}>
          <TouchableOpacity onPress={saveAddress}>
            <Text style={styles.save}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(245,245,245,1)",
    padding: 20,
  },
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  edit: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  address: {
    color: "rgba(41,45,50,1)",
    fontFamily: "Manrope, sans-serif",
    fontWeight: "800",
    fontSize: 18,
  },
  input: {
    width: "100%",
    height: 55,
    paddingLeft: 12,
    borderRadius: 16,
    backgroundColor: "rgba(217,217,217,0.5)",
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
    color: 'rgba(41,45,50,0.8)',
  },
  title: {
    color: "rgba(147,147,147,1)",
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 15,
  },
  nav: {
    position: "absolute",
    bottom: 0,
    width: "150%",
    height: 75,
    paddingLeft: 278,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(247, 251, 252, 1)",
  },
  button: {
    width: 100,
    height: 35,
    borderRadius: 10,
    backgroundColor: "rgba(83,89,71,1)",
    justifyContent: "center",
  },
  save: {
    color: "rgba(247,251,252,1)",
    fontSize: 16,
    fontFamily: "Manrope, sans-serif",
    fontWeight: "600",
    textAlign: "center",
  },
});