import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageProps,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import CustomIcon from './CustomIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../apiConfig';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

interface CartItemProps {
  quantity:string,
  id: string;
  incrementCartItemQuantityHandler: any;
  decrementCartItemQuantityHandler: any;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  quantity,
  incrementCartItemQuantityHandler,
  decrementCartItemQuantityHandler,
}) => {
  const [mealItem, setMealItem] = useState<any>(null);

  useEffect(() => {
    const fetchCoffeeItem = async () => {
      try {
        // console.log(id);
        const response = await fetch(`${apiUrl}/api/meal-item/${id}`); // Use id from props
        if (!response.ok) {
          throw new Error('Failed to fetch meal item');
        }
        const data = await response.json();
        setMealItem(data);
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    };

    fetchCoffeeItem();
  }, [id]);

  const formattedName =
    mealItem && mealItem.name.length > 11
      ? `${mealItem.name.substring(0, 11)}...`
      : mealItem?.name;

  return (
    <View>
      {mealItem && (
        <>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={[COLORS.primaryWhiteHex, COLORS.primaryWhiteHex]}
          style={styles.CartItemLinearGradient}>
          <View style={styles.CartItemRow}>
            <Image source={{uri: mealItem.imagelink_square}} style={styles.CartItemImage} />
            <View style={styles.CartItemInfo}>
              <View style={styles.InfoText}>
                <Text style={styles.CartItemTitle}>{formattedName}</Text>
                <Text style={styles.CartItemSubtitle}>
                  {mealItem.item_piece}
                </Text>
                <Text style={styles.SizeCurrency}>
                  <Text style={styles.SizePrice}>Rp. {mealItem.price}</Text>
                </Text>
              </View>
            </View>
            <View style={styles.CartQuantityContainer}>
              <TouchableOpacity
                  style={styles.CartItemIcon}
                  onPress={() => {
                    decrementCartItemQuantityHandler(id);
                  }}>
                  <CustomIcon
                    name="minus"
                    color={COLORS.primaryWhiteHex}
                    size={6}
                  />
                </TouchableOpacity>
                <View style={styles.CartItemQuantityContainer}>
                  <Text style={styles.CartItemQuantityText}>
                    {quantity}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.CartItemIcon}
                  onPress={() => {
                    incrementCartItemQuantityHandler(id);
                  }}>
                  <CustomIcon
                    name="add"
                    color={COLORS.primaryWhiteHex}
                    size={6}
                  />
                </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  CartItemLinearGradient: {
    flex: 1,
    gap: SPACING.space_12,
    padding: SPACING.space_12,
    borderRadius: BORDERRADIUS.radius_25,
    elevation:6
  },
  CartItemRow: {
    flexDirection: 'row',
    gap: SPACING.space_12,
    flex: 1,
  },
  CartItemImage: {
    height: 90,
    width: 90,
    borderRadius: BORDERRADIUS.radius_20,
  },
  CartItemInfo: {
    height:90,
    width:130,
    gap:4,
    flexDirection:'row',
    paddingVertical: SPACING.space_4,
  },
  CartItemTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
  },
  CartItemSubtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryDarkWhiteHex,
  },
  CartItemRoastedContainer: {
    height: 50,
    width: 50 * 2 + SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDarkGreyHex,
  },
  CartItemRoastedText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.primaryWhiteHex,
  },
  CartItemSizeRowContainer: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.space_20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  CartItemSizeValueContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  SizeBox: {
    backgroundColor: COLORS.primaryBlackHex,
    height: 40,
    width: 100,
    borderRadius: BORDERRADIUS.radius_10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
  SizeCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryOrangeHex,
  },
  SizePrice: {
    color: COLORS.primaryGreenHex,
  },
  CartItemIcon: {
    height:30,
    width:30,
    backgroundColor: COLORS.secondaryGreenHex,
    padding: SPACING.space_12,
    borderRadius: BORDERRADIUS.radius_10,
  },
  CartItemQuantityContainer: {
    backgroundColor: COLORS.primaryWhiteHex,
    width: 40,
    height:30,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 2,
    borderColor: COLORS.secondaryGreenHex,
    alignItems: 'center',
    paddingVertical: SPACING.space_2,
  },
  CartItemQuantityText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
  },
  CartItemSingleLinearGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.space_12,
    gap: SPACING.space_12,
    borderRadius: BORDERRADIUS.radius_25,
  },
  CartItemSingleImage: {
    height: 150,
    width: 150,
    borderRadius: BORDERRADIUS.radius_20,
  },
  CartItemSingleInfoContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-around',
  },
  CartItemSingleSizeValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  CartItemSingleQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  CartQuantityContainer:{
    alignItems:'center',
    flexDirection:'row',
    gap:4
  },
  InfoText:{
    justifyContent:'space-evenly',
  }
});

export default CartItem;