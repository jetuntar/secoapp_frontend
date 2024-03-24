import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  ImageProps,
} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../../../theme/theme';
import HeaderBar from '../../../components/HeaderBar';
import CustomIcon from '../../../components/CustomIcon';
import {FlatList} from 'react-native';
import {Dimensions} from 'react-native';
import apiUrl from '../../../../apiConfig';
import { Icon } from 'react-native-vector-icons/Icon';
import GradientBGIconVector from '../../../components/GradientBGIconVector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AdminMealCard from '../../../components/AdminMealCard';
import GradientBGIcon from '../../../components/GradientBGIcon';


interface MealDataItem {
  id: string;
  imagelink_square: string;
  name: string;
  description: string;
  item_piece:string;
  price: number;
  type: string;
}

const AdminMealsScreen = ({navigation}:any) => {
  
  const [mealData, setMealData] = useState<MealDataItem[]>([]);

  const getItems =  async () => {
    try {
      const items = await fetch(`${apiUrl}/api/meals`);
      const data = await items.json();
        setMealData(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getItems();
    }, [])
  );

  const renderMealItem = ({ item }:any) => (
    <TouchableOpacity
      onPress={() => {
        navigation.push('EditMeal', {
          id: item.id,
        });
      }}>
       <AdminMealCard
          id={item.id}
          item_piece={item.item_piece}
          type={item.type}
          imagelink_square={item.imagelink_square}
          name={item.name}
          description={item.description}
          price={item.price}
        />
    </TouchableOpacity>
  );


  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
          {/* App Header */}
        <View style={styles.HeaderContainer}>
        <TouchableOpacity 
            onPress={()=> navigation.navigate('AddMeal')}>
          <GradientBGIcon
            name="add"
            color={COLORS.primaryLightGreyHex}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity>
        </View>


        {/* Meal Flatlist */}

      </ScrollView>
      <FlatList
      data={mealData}
      numColumns={2}
      contentContainerStyle={styles.container}
      renderItem={renderMealItem}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={
        <View style={styles.emptyListContainer}>
          <Text style={styles.categoryText}>No Meal Available</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
    </View>
  )
}

export default AdminMealsScreen

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    alignSelf:'center',
    marginBottom:85,
  },
  mealContainer: {
    width: 'auto',
    margin: 5,
    backgroundColor: '#eaeaea',
    padding: 10,
    borderRadius: 5,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primarySilverHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginLeft: SPACING.space_30,
    marginRight: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
  HeaderContainer: {
    paddingTop: SPACING.space_30,
    paddingLeft:SPACING.space_30,
    paddingRight:SPACING.space_30,
    paddingBottom:SPACING.space_20,
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
});