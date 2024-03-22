import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, Alert, BackHandler} from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../apiConfig';
import { useFocusEffect } from '@react-navigation/native';

const SettingScreen = ({ navigation}: any) => {
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const getUsername = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/user/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch carts');
      }
      const data = await response.json();
      setUsername(data.data.username);
      setEmail(data.data.email)
      //console.log(data.data)
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  const getUserProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/get-address/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      if (data.length > 0) {
        const firstAddress = data[0]; 
        setAddress(firstAddress.address);
        setPhone(firstAddress.phone);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userId', 'token'])
      BackHandler.exitApp();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Function to refresh the screen, such as refetching data
      getUsername();
    }, [])
  );

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <View style={styles.ScreenContainer}>
    <View style={styles.box}>
    <Image
          source={require('../assets/icons/pp_seco.png')}
          style={{
          alignSelf:'center',
          height: 110,
          width: 110,
          marginTop: -75,
          }}
          resizeMode='contain'
        />
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.address}>{address}</Text>
        <View style={styles.minibox}>
        <TouchableOpacity
        onPress={handleLogout}
        style={styles.logout}>
        <Image
          source={require('../assets/icons/logout.png')}
          style={{
          height: 25,
          width: 25,
          }}
          resizeMode='contain'
        />
      </TouchableOpacity>
        </View>
      <View style={styles.boxSet}>
      <Text style={styles.title}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        editable={false}
        onChangeText={(text) => setEmail(text)} 
      />
      <Text style={styles.title}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        editable={false}
        onChangeText={(text) => setPhone(text)} 
      />
      <Text style={styles.title}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        editable={false}
        onChangeText={(text) => setAddress(text)} 
      />
      </View>
    </View>
    </View>
    );
};

export default SettingScreen

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: "F7FBFC",
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
  logout: {
    alignSelf:'center'
  },
  address: {
    fontSize: 14,
    marginTop: 5,
    fontWeight:'normal',
    alignSelf:'center',
  },
  username: {
    fontSize: 18,
    marginTop: 25,
    fontWeight:'bold',
    alignSelf:'center',
  },
  profile: {
    color: 'rgba(41,45,50,1)',
    fontFamily: "Manrope, sans-serif",
    fontWeight: "800",
    fontSize: 18,
  },
  minibox: {
    width: 75,
    height: 55,
    backgroundColor: 'rgba(217,217,217,50)',
    padding: 15,
    marginTop: 15,
    borderRadius: 18,
    alignSelf:'center',
  },
  box: {
    width: 333,
    height: 205,
    backgroundColor: 'rgba(247,251,252,100)',
    padding: 15,
    marginTop: 100,
    borderRadius: 16,
    alignSelf:'center',
    elevation:4
  },
  boxSet: {
    width: 333,
    height: 'auto',
    backgroundColor: 'rgba(247,251,252,100)',
    padding: 15,
    marginTop: 35,
    borderRadius: 16,
    alignSelf:'center',
    elevation:4
  },
  input: {
    width: "100%",
    height: 55,
    paddingLeft: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(217,217,217,50)',
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  title: {
    color: "rgba(147,147,147,1)",
    fontSize: 14,
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