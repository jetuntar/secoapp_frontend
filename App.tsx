import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios';

import apiUrl from './apiConfig';
import TabNavigator from './src/navigators/TabNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import EditMealScreen from './src/screens/admin/MealsScreen/EditMealScreen';
import AddMealScreen from './src/screens/admin/MealsScreen/AddMealScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import AddressScreen from './src/screens/AddressScreen';
import OnboardingScreen from './src/screens/auth/OnBoardingScreen';
import AdminTabNavigator from './src/navigators/AdminTabNavigator';
import TypeMealScreen from './src/screens/TypeMealScreen';
import LoginScreen from './src/screens/auth/LoginScreen'; // Import your LoginScreen component
import RegisterScreen from './src/screens/auth/RegisterScreen'; // Import your RegisterScreen component
import AddPromoScreen from './src/screens/admin/PromoScreen/AddPromoScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          const response = await axios.post(
            `${apiUrl}/userdata`, { token }
          );

          if (response.data.status == 'ok') {
            setIsAdmin(response.data.role === 'admin');
            setIsAuthenticated(true)
          } else {
            console.log("Token Expired")
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };

    checkAuthentication();
  }, []);

  
  const handleAuthentication = (value : any) => {
    setIsAuthenticated(value);
  };

  const handleAdmin = (value:any) => {
    setIsAdmin(value);
  }
  

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="OnBoard" component={OnboardingScreen}/>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onAuthentication={handleAuthentication} onAdmin={handleAdmin}/>}
          </Stack.Screen>
          <Stack.Screen name="Register">
          {(props) => <RegisterScreen {...props} onAuthentication={handleAuthentication}/>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (isAdmin) {
    return(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='AdminTab' component={AdminTabNavigator}/>
          <Stack.Screen name='AddMeal' component={AddMealScreen}/>
          <Stack.Screen name='EditMeal' component={EditMealScreen}/>
          <Stack.Screen name='AddPromo' component={AddPromoScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Address"
            component={AddressScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Type"
            component={TypeMealScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;
