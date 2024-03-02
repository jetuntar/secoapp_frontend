import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text, Image, ImageBackground, AppState, Button } from 'react-native';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bold } from 'react-native-feather';
import LinearGradient from "react-native-linear-gradient"
import RegisterScreen from './RegisterScreen';
import Icon from 'react-native-vector-icons/FontAwesome';


const googleLogo = require('../../assets/app_images/googlelogo.jpg');
const whatsapplogo = require('../../assets/app_images/whatsapp.png');
const line = require('../../assets/app_images/line.png');
const display = require('../../assets/app_images/display.png');
const displaystart = require('../../assets/app_images/displaystart.png');

const OnBoardingScreen =  ({ navigation }: any) => {
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
      // Ganti 'Home' dengan route halaman utama atau login yang sebenarnya
      navigation.navigate('Register');
    } catch (error) {
      console.log('Error @handleGetStarted: ', error);
    }
  };

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('@viewedOnboarding');
        if(value !== null) {
          // Pengguna sudah melihat onboarding, navigasikan ke halaman utama atau login
          navigation.navigate('Login'); // Sesuaikan dengan route Anda
        } else {
          // Pengguna belum melihat onboarding, biarkan di onboarding screen atau navigasikan ke sana
          navigation.navigate('OnBoard'); // Atau biarkan di screen ini jika sudah merupakan onboarding screen
        }
      } catch(error) {
        console.log('Error @checkOnboarding: ', error);
      }
    };
  
    checkOnboarding();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.boxShadow}>
      <Image source={displaystart} style={[styles.display]}> 
      </Image>
      </View>
      <Text style={styles.headertext}>Innovative Digital </Text>
      <Text style={styles.headertextsub}>Meal Preparations and </Text>
      <Text style={styles.headertextsub}>Great Nutritions</Text>
      <Text style={styles.subText}>Designed to help you manage your meal</Text>
      <Text style={styles.subTextsub}>supply easily and efficiently.</Text>
      <View style={[styles.button, styles.androidShadow]}>
        <TouchableOpacity  onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <View>
      <Text style={styles.baseText}>
      Already have an account?
      <TouchableOpacity onPress={()=>navigation.push('Login')}><Text style={styles.innerText}>Login</Text></TouchableOpacity>
    </Text>
      </View>

    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginTop: 0,
    backgroundColor: 'white',
  },
  headertext: {
    textAlign:'center',
    fontWeight:'bold',
    fontFamily:"Manrope-Bold",
    fontSize: 28,
    color:'#292D32',
    marginTop:30,
  },
  headertextsub: {
    textAlign:'center',
    fontWeight:'bold',
    fontFamily:"Manrope-Bold",
    fontSize: 28,
    color:'#292D32'
  },
  subText: {
    textAlign:'center',
    fontSize: 14,
    color:'#939393',
    marginTop: 15,
  },
  subTextsub: {
    textAlign:'center',
    fontSize: 14,
    color:'#939393',
  },
  baseText: {
    marginStart: 72,
    marginTop: 15,
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
  button: {
    alignSelf:'center',
    width: 253, // Adjust width
    height: 50, // Adjust height
    backgroundColor: '#535947', // Button color
    marginTop:50,
    padding: 10,
    borderRadius: 100, // Adjust button border radius here
    alignItems: 'center',
    justifyContent: 'center',
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