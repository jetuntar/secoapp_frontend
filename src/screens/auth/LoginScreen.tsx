import React, { useState } from 'react';
import apiUrl from '../../../apiConfig';
import { View, TextInput, Button, Alert, AppState } from 'react-native';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenProps = {
  navigation: AppState; // Change 'any' to the actual type of your navigation prop
  onAuthentication: (value: boolean) => void;
};

const LoginScreen = ({ navigation, onAuthentication }: LoginScreenProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response: AxiosResponse<{ token: string }> = await axios.post(
        `${apiUrl}/user/login`,
        { email, password }
      );

      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        console.log(response.data)
        onAuthentication(true)
      } else {
        Alert.alert('Invalid email or password!!!', response.data.token, [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      </View>
  );
};

export default LoginScreen;
