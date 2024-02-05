import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import apiUrl from '../../../apiConfig';
import axios from 'axios';

interface RegisterScreenProps {}

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}:any) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${apiUrl}/user/register`, { username, password, email});
      console.log(response.data);
      navigation.navigate("Login");
      
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
