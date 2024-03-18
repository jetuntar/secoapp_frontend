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
  id: string;
  recipient:string;
  order_date:any;
  imagelink_square:string;
  itemId:string;
  quantity:number;
  name:string;
  price:number;
  addressId:string;
  order_status:string;
  buttonPressHandler: any;
}

const AdminOrderItemCard: React.FC<AdminOrderItemCardProps> = ({
  id,
  itemId,
  recipient,
  order_date,
  imagelink_square,
  quantity,
  name,
  price,
  addressId,
  order_status,
  buttonPressHandler
}) => {

  const new_order_date = new Date(order_date);
  const formatted_date = `${new_order_date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  })}, ${new_order_date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  })}`;

  let formatted_name = name;
  if (formatted_name.length > 8) {
   formatted_name = `${formatted_name.substring(0, 8)}...`;
  }

  return (
    <View>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
          style={styles.CardLinearGradient}>
          <View style={styles.CardInfoContainer}>
            <View style={styles.CardImageInfoContainer}>
              <Image source={{uri: imagelink_square}} style={styles.Image} />
              <View style={styles.CardTableRow}>
                <View style={styles.CardTableContainer}>
                  <View style={styles.CardInnerContainerLeft}>
                    <Text style={styles.CardTitle}>{formatted_name}</Text>
                    <Text style={styles.CardSubtitle}>{quantity} Item</Text>
                  </View>
                  <View style={styles.CardInnerContainerLeft}>
                  <Text style={styles.CardOrderDateSubtitle}>{formatted_date}</Text>
                  </View>
                </View>
                <View style={styles.CardTableContainer}>
                  <View style={styles.CardInnerContainerRight}>
                    <Text style={styles.CardQuantityPriceText}>
                      Rp. {(quantity * price).toFixed().toString()}
                    </Text>
                  </View>
                  <View style={styles.CardInnerContainerRight}>
                    <TouchableOpacity
                      style={styles.CardButton}
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
                {/* <View style={styles.PriceBox}>
                  <Text style={styles.PriceCurrency}>
                    Rp.<Text style={styles.Price}> {price}</Text>
                  </Text>
                </View> */}
            </View>
            </View>
            <View>
              </View>
            </View>
        </LinearGradient>
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
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
  CardSubtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.secondaryLightGreyHex,
  },
  CardOrderDateSubtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.secondaryLightGreyHex,
    paddingTop:24
  },
  CardCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryOrangeHex,
  },
  CardPrice: {
    color: COLORS.primaryWhiteHex,
  },
  CardButton: {
    marginTop:10
  },
  CardTableRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf:'center',
  },
  CardTableContainer: {
    flexDirection:'column',
    justifyContent:'space-between',
    height:90,
    width:100
  },
  CardInnerContainerLeft:{
    width:120,
    height:40,
   },
   CardInnerContainerRight:{
    width:100,
    height:40,
    alignItems:'flex-end'
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
  PriceBox: {
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
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryOrangeHex,
  },
});

export default AdminOrderItemCard;