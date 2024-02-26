import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import apiUrl from '../../../apiConfig';
import axios from 'axios';

interface RegisterScreenProps {
  navigation: any;
  onAuthentication: (value: boolean) => void;
}

const googleLogo = require('../../assets/app_images/googlelogo.jpg');
const whatsapplogo = require('../../assets/app_images/whatsapp.png');
const line = require('../../assets/app_images/line.png');
const display = require('../../assets/app_images/display.png');

const RegisterScreen = ({ navigation, onAuthentication}: RegisterScreenProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const role = 'user'

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${apiUrl}/user/register`, { username, password, email, role});
      console.log(response.data);
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxShadow}>
      <Image source={display} style={[styles.display]}> 
      </Image>
      </View>
      
      <TextInput
        style= {[styles.textInputUsername, styles.boxShadow]}
        placeholder="Username"
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.textInputPassword, styles.boxShadow]}
        placeholder="Email"
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.textInputPassword, styles.boxShadow]}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, styles.androidShadow]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View>
      <Text style={styles.baseText}>
      Already have an account?
      <TouchableOpacity onPress={()=>navigation.push('Login')}><Text style={styles.innerText}>Sign In</Text></TouchableOpacity>
    </Text>
      </View>
    </View>
  );
};

export default RegisterScreen;



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
  textInputUsername: {
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
    marginStart: 75, // Add some margin between the logo and the text
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
    marginRight: 70,
    marginTop: 3,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 57,
    marginEnd: 50,
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