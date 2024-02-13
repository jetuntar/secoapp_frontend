import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'



const AdminScreen = () => {

  const handleLogout = async() =>{
    await AsyncStorage.removeItem('token');
    Alert.alert('Ini harusnya logout, tapi belum jadi')
  }

  return (
    <View>
      <Text>AdminScreen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  )
}

export default AdminScreen

const styles = StyleSheet.create({})