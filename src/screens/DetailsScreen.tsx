import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useStore} from '../store/store';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import ImageBackgroundInfo from '../components/ImageBackgroundInfo';
import PaymentFooter from '../components/PaymentFooter';
import apiUrl from '../../apiConfig';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBGIcon from '../components/GradientBGIcon';

interface MealDetail {
  id: string;
  imagelink_square: string;
  name: string;
  description: string;
  item_piece:string;
  price: number;
  type: string;
  favourite:boolean;
}


const DetailsScreen = ({navigation, route, favourite}: any) => {
  
  const { id } = route.params;
  const [mealDetail, setMealDetail] = useState<MealDetail | null>(null);// Use 'any' for now

  const toggleFavourite = async (id: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // Retrieve userId from AsyncStorage
      await axios.post(
          `${apiUrl}/api/add-to-fav/${userId}/${id}`
        );
      navigation.goBack();
    } catch (error) {
      console.error('ToggleFavourite error:', error);
    }
  };


  const addToCart = async (
    id: string
    ) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await axios.put(
        `${apiUrl}/api/increment-item-cart/${userId}/${id}`
      );
    } catch (error) {
      console.error('Failed to remove from favorites', error);
    }
  }

  const addToCarthandler = ({
    id,
  }: any) => {
    addToCart(id);
    navigation.goBack();
  };

  useEffect(() => {
    fetch(`${apiUrl}/api/meal-item/${id}`)
      .then(response => response.json())
      .then(data => {
        setMealDetail(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.HeaderContainer}>
        <View style={styles.HeaderInnerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.Icon}>
          <Image
            source={require('../assets/icons/arrow-circle-left.png')}
            style={{
            height: 36,
            width: 36,
            marginRight: 8
            }}
            resizeMode='contain'
          />
            <Text style={styles.Title}>Details</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.HeaderInnerContainer}>
            <TouchableOpacity
              style={styles.FavIcon}
              onPress={() => {
                toggleFavourite(id)
              }}>
              <GradientBGIcon
                name="like"
                color={
                  favourite ? COLORS.primaryRedHex : COLORS.primaryWhiteHex
                }
                size={FONTSIZE.size_16}
              />
            </TouchableOpacity>
        </View>
      </View>
      <View
        style={styles.ViewFlex}>
        <View style={styles.ImageArea}>
          <View style={styles.Image}>
            <ImageBackgroundInfo
              EnableFav={true}
              imagelink_square={mealDetail ? mealDetail.imagelink_square : 'Image not found'}
              id={mealDetail ? mealDetail.id : ''}
              favourite={mealDetail ? mealDetail.favourite : false}
              toggleFavourite={toggleFavourite}
            />
          </View>
        </View>
        <View style={styles.DetailsArea}>
          <View style={styles.HeaderDetails}>
            <View style={styles.HeaderDetailsContainer}>
              <View style={styles.HeaderDetailsInnerContainer}>
                <Text style={styles.NameText}>{mealDetail ? mealDetail.name : ''}</Text>
              </View>
              <View style={styles.HeaderDetailsInnerContainer}>
                <Text style={styles.ItemText}>{mealDetail ? mealDetail.item_piece : ''}</Text>
              </View>
            </View>
            <View style={styles.HeaderDetailsContainer}>
            <Text style={styles.PriceText}>
            Rp. <Text style={styles.Price}>{mealDetail ? mealDetail.price : ''}</Text>
            </Text>
            </View>
          </View>
          <Text style={styles.InfoTitle}>Description</Text>
          <Text style={styles.DescriptionText}>
            {mealDetail?.description}
          </Text>
        </View>
        <PaymentFooter
          price={mealDetail?.price}
          buttonTitle="Add to Cart"
          buttonPressHandler={() => {
            addToCarthandler({
              id: mealDetail?.id
            });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primarySilverHex,
  },
  ViewFlex: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  DetailsArea: {
    paddingHorizontal: SPACING.space_20,
  },
  InfoTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
  },
  HeaderContainer: {
    paddingHorizontal:20,
    paddingVertical:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderInnerContainer:{
    width:150
  },
  Icon: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
  },
  Title: {
    color: COLORS.secondaryDarkGreyHex,
    fontFamily: "Manrope, sans-serif",
    fontWeight: "800",
    fontSize: 18,
  },
  ImageArea:{
    paddingHorizontal:20,
    marginBottom:-20
  },
  Image: {
    borderRadius:16,
    overflow: 'hidden'
  },
  FavIcon: {
    alignSelf:'flex-end',
    width: 40
  },
  DescriptionText: {
    letterSpacing: 0.5,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryDarkWhiteHex,
    marginBottom: SPACING.space_30,
  },
  HeaderDetails: {
    height:70,
    justifyContent:'space-between',
    flexDirection:'row'
  },
  HeaderDetailsContainer:{
    flexDirection:'column'
  },
  HeaderDetailsInnerContainer:{
    height:30,
    width:240,
  },
  NameText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryBlackHex,
  },
  ItemText: {
    fontFamily: FONTFAMILY.poppins_light,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryDarkWhiteHex,
  },
  PriceText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryGreenHex,
  },
  Price: {
    color: COLORS.primaryGreenHex,
  },
});

export default DetailsScreen;