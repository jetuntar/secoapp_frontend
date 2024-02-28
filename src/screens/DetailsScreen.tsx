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


const DetailsScreen = ({navigation, route}: any) => {
  
  const { id } = route.params;
  const [mealDetail, setMealDetail] = useState<MealDetail | null>(null);// Use 'any' for now

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <ImageBackgroundInfo
          EnableBackHandler={true}
          imagelink_square={mealDetail ? mealDetail.imagelink_square : 'Image not found'}
          id={mealDetail ? mealDetail.id : ''}
          favourite={mealDetail ? mealDetail.favourite : false}
          BackHandler={BackHandler}
          toggleFavourite={toggleFavourite}
        />
        <View style={styles.FooterInfoArea}>
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