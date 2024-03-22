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
  Image,
} from 'react-native';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import {FlatList} from 'react-native';
import {Dimensions} from 'react-native';
import apiUrl from '../../apiConfig';
import { Icon } from 'react-native-vector-icons/Icon';
import GradientBGIconVector from '../components/GradientBGIconVector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import MealCard from '../components/MealCard';
import PromoCard from '../components/PromoCard';

interface MealDataItem {
  id: string;
  imagelink_square: string;
  name: string;
  description: string;
  item_piece:string;
  price: number;
  type: string;
}

interface Address {
  address: string;
  id: number;
  phone: string;
  recipient: string;
  userId: number;
}

const HomeScreen = ({navigation}: any) => {
  const [mealData, setMealData] = useState<MealDataItem[]>([]);
  const [sortedMeal, setSortedMeal] = useState<MealDataItem[]>(mealData);
  const [searchedText, setSearchedText] = useState<string>('');
  const [addressUser, setAddressUser] = useState<Address[]>([]);
  const [promoData, setPromoData] = useState<any[]>([]);

  const [searchText, setSearchText] = useState('');


  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  const searchMeal = (search: string) => {
    setSearchedText(search);
    if (search !== '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setSortedMeal(
        mealData.filter((item: MealDataItem) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      // If search text is empty, show all items
      setSortedMeal(mealData);
    }
  };
  
  const resetSearchMeal = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setSearchText('');
    setSearchedText('');
    setSortedMeal(mealData);
  };

  
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

  const getUserAddress = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/get-address/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch carts');
      }
      const data = await response.json();
      setAddressUser(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const getPromo = async () => {
    try {
      const promos = await fetch(`${apiUrl}/api/all-promo`)
      const data = await promos.json();
      setPromoData(data)
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addToCart = async (
    id: string,
    name: string
    ) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await axios.put(
        `${apiUrl}/api/increment-item-cart/${userId}/${id}`
      );
    } catch (error) {
      console.error('Failed to remove from favorites', error);
    }
  };

  const addToCarthandler = ({
    id,name
  }: any) => {
    addToCart(id, name);
    ToastAndroid.showWithGravity(
      `${name} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      // Function to refresh the screen, such as refetching data
      getPromo();
      getItems();
      getUserAddress();
    }, [])
  );

  const handleLogout = async () => {
    try {
      // Clear the token from AsyncStorage
      await AsyncStorage.multiRemove(['userId', 'token'])

      
      Alert.alert('Ini harusnya logout, tapi belum jadi')
    } catch (error) {
      console.error('Logout failed', error);
      // Optionally, display an alert or handle the error in another way
    }
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        {/* App Header */}
        <View style={styles.HeaderContainer}>
          <TouchableOpacity 
          style={styles.AddressBox}
          onPress={()=>navigation.navigate('Address')}>
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
            <Text style={styles.AddressText}>{addressUser.length > 0 ? addressUser[0].recipient : 'Set Address'}</Text>
          </View>
        </TouchableOpacity>
    </View>

        {/* Search Input */}

        <View style={styles.InputContainerComponent}>
          <TouchableOpacity
            onPress={() => {
              searchMeal(searchText);
            }}>
            <CustomIcon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryDarkWhiteHex
                  : COLORS.secondaryGreenHex
              }
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Find Your Best Meal..."
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              searchMeal(text);
            }}
            placeholderTextColor={COLORS.primaryDarkWhiteHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                resetSearchMeal();
              }}>
              <CustomIcon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryDarkWhiteHex}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>

        {/* Promo Flatlist */}

        <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.PromoFlatlistContainer}
        data={promoData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <PromoCard
          id={item.id}
          imagelink={item.imagelink}
          />
        )}
        />

        {/* Type Meal Button */}

        <View style={styles.TypeContainer}>
          <View style={styles.TypeInnerContainer}>
            <TouchableOpacity style={styles.TypeButtonContainer} onPress={() => navigation.navigate('Type', {type: 'rf'})}>
              <Text style={styles.TypeText}>
                Raw Food
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.TypeInnerContainer}>
          <TouchableOpacity style={styles.TypeButtonContainer} onPress={() => navigation.navigate('Type', {type: 'hc'})}>
              <Text style={styles.TypeText}>
                Half-Cooked
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.MealTitle}>Today's Meal</Text>
        
        {/* Meal Flatlist */}

        <FlatList
          ListEmptyComponent={
            <View style={styles.EmptyListContainer}>
              <Text style={styles.CategoryText}>No Meal Available</Text>
            </View>
          }
          numColumns={2}
          data={searchedText !== '' ? sortedMeal : mealData}
          contentContainerStyle={styles.MealFlatListContainer}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.push('Details', {
                  id: item.id,
                },
                );
              }
              }>
              <MealCard
                id={item.id}
                item_piece={item.item_piece}
                type={item.type}
                imagelink_square={item.imagelink_square}
                name={item.name}
                description={item.description}
                price={item.price}
                buttonPressHandler={() => {
                  addToCarthandler({
                    id: item.id,
                    name:item.name
                  })
                }}
              />
            </TouchableOpacity>
          )}
        />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primarySilverHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  logout: {
    alignSelf:'center'
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
    backgroundColor: COLORS.primaryWhiteHex,
    alignItems: 'center',
    elevation:3
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackHex,
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  TypeContainer: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignSelf:'center',
    width:340,
    height:60,
  },
  TypeInnerContainer: {
    borderRadius:BORDERRADIUS.radius_10,
    width:160,
    height:60,
    backgroundColor:'white',
    justifyContent:'center',
    elevation:3
  },
  TypeButtonContainer: {
    alignSelf:'center',
  },
  TypeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryBlackHex,
  },
  PromoFlatlistContainer: {
    marginVertical:16,
    gap:30,
    marginHorizontal:30,
  },
  MealFlatListContainer: {
    marginVertical:16,
    marginBottom:85,
    alignSelf:'center',
    alignItems:'center',
    rowGap:10
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  MealTitle: {
    marginLeft: 36,
    fontSize: FONTSIZE.size_18,
    marginTop: 16,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryBlackHex,
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
    backgroundColor: COLORS.primarySilverHex,
  },
  AddressTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryDarkWhiteHex,
  },
  AddressText:{
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
  },
  innerAddressBox:{
    marginTop:5
  },
});

export default HomeScreen;