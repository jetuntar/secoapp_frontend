import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
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

interface CoffeeDetail {
  price:number;
  description: string;
  imagelink_portrait: any;
  imagelink_square:any;
  type: string;
  id: string;
  favourite: boolean;
  name: string;
  special_ingredient: string;
  ingredients: string;
  average_rating: number;
  ratings_count: string;
  roasted: string;
  index:number;
}


const DetailsScreen = ({navigation, route}: any) => {
  
  const { id } = route.params;
  const [coffeeDetail, setCoffeeDetail] = useState<CoffeeDetail | null>(null);// Use 'any' for now

  // const ItemOfIndex = useStore((state: any) =>
  //   route.params.type == 'Coffee' ? state.CoffeeList : state.BeanList,
  // )[route.params.index];
  // const addToCart = useStore((state: any) => state.addToCart);
  // const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  // const [price, setPrice] = useState(ItemOfIndex.prices[0]);
  // const [fullDesc, setFullDesc] = useState(false);

  const toggleFavourite = async (id: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // Retrieve userId from AsyncStorage
      await axios.post(
          `${apiUrl}/api/add-to-fav/${userId}/${id}`
        ); // Make HTTP request to add to favorites
      navigation.goBack();
    } catch (error) {
      console.error('ToggleFavourite error:', error);
      // Handle error
    }
  };

  const BackHandler = () => {
    navigation.pop();
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
    // calculateCartPrice();
    navigation.goBack();
  };

  useEffect(() => {
    fetch(`${apiUrl}/api/coffee-item/${id}`)
      .then(response => response.json())
      .then(data => {
        setCoffeeDetail(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}
      >
        <ImageBackgroundInfo
          EnableBackHandler={true}
          imagelink_portrait={coffeeDetail ? coffeeDetail.imagelink_portrait : 'Image not found'}
          type={coffeeDetail ? coffeeDetail.type : ''}
          id={coffeeDetail ? coffeeDetail.id : ''}
          favourite={coffeeDetail ? coffeeDetail.favourite : false}
          name={coffeeDetail ? coffeeDetail.name : ''}
          special_ingredient={coffeeDetail ? coffeeDetail.special_ingredient : ''}
          ingredients={coffeeDetail ? coffeeDetail.ingredients : ''}
          average_rating={coffeeDetail ? coffeeDetail.average_rating : 0}
          ratings_count={coffeeDetail ? coffeeDetail.ratings_count : ''}
          roasted={coffeeDetail ? coffeeDetail.roasted : ''}
          BackHandler={BackHandler}
          toggleFavourite={toggleFavourite}
        />
        <View style={styles.FooterInfoArea}>
          <Text style={styles.InfoTitle}>Description</Text>
          <Text style={styles.DescriptionText}>
            {coffeeDetail?.description}
          </Text>
        </View>
        <PaymentFooter
          price={coffeeDetail?.price}
          buttonTitle="Add to Cart"
          buttonPressHandler={() => {
            addToCarthandler({
              id: coffeeDetail?.id
            });
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  FooterInfoArea: {
    padding: SPACING.space_20,
  },
  InfoTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_10,
  },
  DescriptionText: {
    letterSpacing: 0.5,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_30,
  },
  SizeOuterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },
  SizeBox: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_24 * 2,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 2,
  },
  SizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
  },
});

export default DetailsScreen;