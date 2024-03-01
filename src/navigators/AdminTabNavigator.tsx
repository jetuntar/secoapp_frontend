import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../theme/theme';
import {BlurView} from '@react-native-community/blur';
import AdminMealsScreen from '../screens/admin/AdminMealsScreen';
import AdminOrderScreen from '../screens/admin/AdminOrderScreen';
import CustomIcon from '../components/CustomIcon';

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarBackground: () => (
          <BlurView
            overlayColor=""
            blurAmount={15}
            style={styles.BlurViewStyles}
          />
        ),
      }}>
      <Tab.Screen
        name="Order"
        component={AdminOrderScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <CustomIcon
            name="cart"
            size={25}
            color={
              focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
            }
            />
            ),
          }}></Tab.Screen>
          <Tab.Screen
            name="User"
            component={AdminMealsScreen}
            options={{
              tabBarIcon: ({focused, color, size}) => (
                <CustomIcon
                  name="menu"
                  size={25}
                  color={
                    focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
                  }
                />
              ),
            }}></Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    position: 'absolute',
    backgroundColor: COLORS.primaryBlackRGBA,
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
  },
  BlurViewStyles: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default AdminTabNavigator;