import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text, Image, ImageBackground, AppState, Button } from 'react-native';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bold } from 'react-native-feather';
import LinearGradient from "react-native-linear-gradient"
import RegisterScreen from './RegisterScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import apiUrl from '../../../apiConfig';

type LoginScreenProps = {
  navigation: any;
  onAuthentication: (value: boolean) => void;
  onAdmin: (value:boolean) => void;
};

const googleLogo = require('../../assets/app_images/googlelogo.jpg');
const whatsapplogo = require('../../assets/app_images/whatsapp.png');
const line = require('../../assets/app_images/line.png');
const display = require('../../assets/app_images/display.png');

const LoginScreen = ({ navigation, onAuthentication, onAdmin }: LoginScreenProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response: AxiosResponse<{
        role: string; token: string , userId: any
      }> = await axios.post(
        `${apiUrl}/user/login`,
        { email, password }
      );

      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('userId', response.data.userId.toString());
        if (response.data.role == 'admin') {
          onAdmin(true)
          console.log(response.data)
        onAuthentication(true)
        } else {
        console.log(response.data)
        onAuthentication(true)
        onAdmin(false)
        }
      } else {
        Alert.alert('Invalid email or password!!!', response.data.token, [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleGoogleLogin = () => {
    // Here you can integrate Google Sign-In functionality
    console.log('Google Sign-In pressed');
    // Typically, you would use a library like @react-native-google-signin/google-signin
    // and call a method here to initiate the Google Sign-In process
  };

  const handleWhatsAppLogin = () => {
    console.log('WhatsApp Sign-In pressed');
    // Integrate WhatsApp Sign-In functionality here
  };


  return (
    <View style={styles.container}>
      <View style={styles.boxShadow}>
      <Image source={display} style={[styles.display]}> 
      </Image>
      </View>
      <TextInput
        style= {[styles.textInputEmail, styles.boxShadow]}
        placeholder="Email"
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.textInputPassword, styles.boxShadow]}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, styles.androidShadow]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View>
      <Image source={line} style={styles.lineContainer} />
      </View>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={handleGoogleLogin}>
          <Image source={googleLogo} style={styles.googleLogo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleWhatsAppLogin}>
          <Image source={whatsapplogo} style={styles.whatsapplogo} />
        </TouchableOpacity>
      </View>
      <View>
      <Text style={styles.baseText}>
      Already have an account?
      <TouchableOpacity onPress={()=>navigation.push('Register')}><Text style={styles.innerText}>Sign Up</Text></TouchableOpacity>
    </Text>
      </View>

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginTop: 0,
    backgroundColor: 'white',
  },
  baseText: {
    marginTop:5,
    alignSelf:'center',
    fontWeight: 'normal',
  },
  innerText: {
    color: '#535947',
  },
  display: {
    justifyContent: 'center',
    width: 500, // Adjust width
    height: 500, // Adjust height
    marginStart: -20, // Add some margin between the logo and the text
    marginTop: -150,
    alignContent:'center',
  },
  textInputEmail: {
    alignSelf:'center',
    width: 253, // Adjust width
    height: 50, // Adjust height
    borderColor: '#535947',
    borderWidth: 1,
    borderRadius: 100, // Adjust border radius here
    marginTop: 50,
    marginBottom: 20,
    paddingLeft: 30, // Add some padding to the inside of the TextInput
  },
  textInputPassword: {
    alignSelf:'center',
    width: 253, // Adjust width
    height: 50, // Adjust height
    borderColor: '#535947',
    borderWidth: 1,
    borderRadius: 100, // Adjust border radius here
    marginBottom: 20,
    paddingLeft: 30, // Add some padding to the inside of the TextInput
  },
  button: {
    backgroundColor: '#535947', // Button color
    alignSelf:'center',
    width: 253, // Adjust width
    height: 50, // Adjust height
    padding: 14,
    borderRadius: 100, // Adjust button border radius here
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', // Text color
    fontSize: 16,
  },
  googleLogo: {
    width: 25, // Adjust width
    height: 25, // Adjust height
    marginStart: 85, // Add some margin between the logo and the text
    marginTop: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  whatsapplogo: {
    width: 32, // Adjust width
    height: 32, // Adjust height
    marginRight: 83,
    marginTop: 3,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center',
    marginTop: 20,
  },
  androidShadow: {
    elevation: 5,
  },
  boxShadow: {
    shadowColor: "#333333",
    shadowOffset: {
      width:6,
      height: 6,
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  }
});