import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from @react-navigation/native
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import GradientBGIconVector from './GradientBGIconVector';
import ProfilePic from './ProfilePic';

interface HeaderBarProps {
  title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title }) => {
  const navigation = useNavigation(); // Use useNavigation hook to get the navigation object

  const handleLogout = async () => {
    try {
      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem('token');

      // Navigate to the login screen (replace 'Login' with the actual name of your login screen)
      // navigation.navigate('Login')
      Alert.alert('Ini harusnya logout, tapi belum jadi')
    } catch (error) {
      console.error('Logout failed', error);
      // Optionally, display an alert or handle the error in another way
    }
  };

  return (
    <View style={styles.HeaderContainer}>
      <GradientBGIconVector
        onPress={handleLogout}
        nameVector="logout"
        colorVector={COLORS.primaryLightGreyHex}
        sizeVector={FONTSIZE.size_16}
      />
      <Text style={styles.HeaderText}>{title}</Text>
      <ProfilePic />
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
});
