import {StyleSheet, Text, View, ImageProps, Image, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import apiUrl from '../../apiConfig';
import BGIcon from './BGIcon';

interface AdminOrderItemCardProps {
  id: string,
  itemId:string;
  quantity:number;
  addressId:string;
  order_status:string;
  buttonPressHandler: any;
}

const AdminOrderItemCard: React.FC<AdminOrderItemCardProps> = ({
  id,
  itemId,
  quantity,
  addressId,
  order_status,
  buttonPressHandler
}) => {

  const [mealItem, setMealItem] = useState<any>(null);

  useEffect(() => {
    const fetchMealItem = async () => {
      try {
        // console.log(id);
        const response = await fetch(`${apiUrl}/api/meal-item/${itemId}`); // Use id from props
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

    fetchMealItem();
  }, [id]);


  return (
    <View>
      {mealItem && (
        <>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
          style={styles.CardLinearGradient}>
          <View style={styles.CardInfoContainer}>
            <View style={styles.CardImageInfoContainer}>
              <Image source={{uri: mealItem.imagelink_square}} style={styles.Image} />
              <View>
                <Text style={styles.CardTitle}>{mealItem.name}</Text>
                <Text style={styles.CardSubtitle}>{mealItem.special_ingredient}</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                  onPress={() => {
                    buttonPressHandler(id);
                  }}>
                  <BGIcon
                    color={COLORS.primaryWhiteHex}
                    name={'add'}
                    BGColor={COLORS.primaryOrangeHex}
                    size={FONTSIZE.size_10}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.CardTableRow}>
              <View style={styles.CardTableRow}>
                <View style={styles.PriceBoxRight}>
                  <Text style={styles.PriceCurrency}>
                    Rp.<Text style={styles.Price}> {mealItem.price}</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.CardTableRow}>
                <Text style={styles.CardQuantityPriceText}>
                  X <Text style={styles.Price}>{quantity}</Text>
                </Text>
                <Text style={styles.CardQuantityPriceText}>
                  Rp. {(quantity * mealItem.price).toFixed(2).toString()}
                </Text>
              </View>
            </View>
        </LinearGradient>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  CardLinearGradient: {
    gap: SPACING.space_20,
    padding: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
  },
  CardInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CardImageInfoContainer: {
    flexDirection: 'row',
    gap: SPACING.space_20,
    alignItems: 'center',
  },
  Image: {
    height: 90,
    width: 90,
    borderRadius: BORDERRADIUS.radius_15,
  },
  CardTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  CardSubtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.secondaryLightGreyHex,
  },
  CardCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryOrangeHex,
  },
  CardPrice: {
    color: COLORS.primaryWhiteHex,
  },
  CardTableRow: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  SizeBoxLeft: {
    backgroundColor: COLORS.primaryBlackHex,
    height: 45,
    flex: 1,
    borderTopLeftRadius: BORDERRADIUS.radius_10,
    borderBottomLeftRadius: BORDERRADIUS.radius_10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.primaryGreyHex,
  },
  SizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
  PriceBoxRight: {
    backgroundColor: COLORS.primaryBlackHex,
    height: 45,
    flex: 1,
    borderRadius: BORDERRADIUS.radius_10,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.primaryGreyHex,
  },
  PriceCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryOrangeHex,
  },
  Price: {
    color: COLORS.primaryWhiteHex,
  },
  CardQuantityPriceText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryOrangeHex,
  },
});

export default AdminOrderItemCard;