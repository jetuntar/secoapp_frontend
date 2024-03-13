import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../apiConfig';
import { COLORS, SPACING } from '../theme/theme';
import GetLocation from 'react-native-get-location';

const AddressScreen = ({ navigation }: any) => {
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [latitude, setLatitude] = useState<any | null>(null);
  const [longitude, setLongitude] = useState<any | null>(null);

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
        setNotes(firstAddress.notes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
  })
  .then(location => {
    const { latitude, longitude } = location;
    setLatitude(latitude);
    setLongitude(longitude);
    console.log([latitude,longitude]);
  })
  .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
  })
  }

  // Function to convert degrees to radians
  const toRadians = (degrees:any) => {
    return degrees * (Math.PI / 180);
  };

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1:any, lon1:any, lat2:any, lon2:any) => {
    const R = 6371; // Radius of the Earth in km

    // Convert latitude and longitude from degrees to radians
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    // Convert latitudes to radians
    lat1 = toRadians(lat1);
    lat2 = toRadians(lat2);

    // Apply Haversine formula
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    const distance = R * c;
    const roundedDistance = distance.toFixed(1);
    const roundedDistanceNumber = parseFloat(roundedDistance);
    return roundedDistanceNumber
  };

  const userLatitude = latitude;
  const userLongitude = longitude;

  // Store coordinates
  const storeLatitude = -7.435137443627459;
  const storeLongitude = 109.24898618550385;



  useEffect(() => {
    getCurrentLocation();
    getUserAddress();
  }, []);

  const saveAddress = async () => {
    const distance = calculateDistance(
      userLatitude,
      userLongitude,
      storeLatitude,
      storeLongitude
    );
    console.log(distance)
    try {
      const userId = await AsyncStorage.getItem('userId');
      const newAddress = { recipient, address, phone, notes, distance}; // Collect new address data
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
      navigation.goBack();
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
      <Text style={styles.title}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={(text) => setPhone(text)} // Update phone state
        keyboardType="phone-pad"
      />
      <Text style={styles.title}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={(text) => setAddress(text)} // Update address state
      />
      <Text style={styles.title}>Notes</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={(text) => setNotes(text)} // Update notes state
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