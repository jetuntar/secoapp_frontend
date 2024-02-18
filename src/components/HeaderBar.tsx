import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from @react-navigation/native
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import GradientBGIconVector from './GradientBGIconVector';
import ProfilePic from './ProfilePic';
import CustomIcon from './CustomIcon';


const HeaderBar = () => {
  const navigation = useNavigation(); // Use useNavigation hook to get the navigation object

  const handleLogout = async () => {
    try {
      // Clear the token from AsyncStorage
      await AsyncStorage.multiRemove(['userId', 'token'])

      // navigation.navigate('Login')
      Alert.alert('Ini harusnya logout, tapi belum jadi')
    } catch (error) {
      console.error('Logout failed', error);
      // Optionally, display an alert or handle the error in another way
    }
  };

  return (
    <View style={styles.HeaderContainer}>
      {/* <GradientBGIconVector
        onPress={handleLogout}
        nameVector="logout"
        colorVector={COLORS.primaryLightGreyHex}
        sizeVector={FONTSIZE.size_16}
      /> */}
      <TouchableOpacity 
      style={styles.AddressBox}
      
      >
          <View>
            <CustomIcon
                    style={styles.InputIcon}
                    name="location"
                    size={FONTSIZE.size_30}
                    color={COLORS.primaryLightGreyHex}
                  />
            </View>
          <View style={styles.innerAddressBox}>
            <Text style={styles.AddressTitle}>Deliver To</Text>
            <Text style={styles.AddressText}>Kost Standing</Text>
          </View>
        </TouchableOpacity>
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

  AddressBox: {
    alignItems: 'center',
    flexDirection:'row',
    height: 60,
    width:200,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
  },
  AddressTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  AddressText:{
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  innerAddressBox:{
    marginTop:5
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
});
