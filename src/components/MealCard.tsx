import React from 'react';
import {
  Dimensions,
  ImageBackground,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import BGIcon from './BGIcon';

const CARD_WIDTH = Dimensions.get('window').width * 0.32;

interface MealCardProps {
  id: string;
  imagelink_square: string;
  name: string;
  description: string;
  item_piece: string;
  price: number;
  type: string;
  buttonPressHandler: any;
}

const MealCard: React.FC<MealCardProps> = ({
  id,
  type,
  imagelink_square,
  name,
  item_piece,
  price,
  buttonPressHandler,
}) => {
  let formatted_name = name;
  if (formatted_name.length > 11) {
    formatted_name = `${formatted_name.substring(0, 11)}...`;
  }

  return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.CardLinearGradientContainer}
        colors={[COLORS.secondaryWhiteHex, COLORS.secondaryWhiteHex]}>
        <ImageBackground
          source={{ uri: imagelink_square }}
          style={styles.CardImageBG}
          resizeMode="cover">
        </ImageBackground>

        <Text style={styles.CardTitle}>{formatted_name}</Text>
        <Text style={styles.CardSubtitle}>{item_piece}</Text>
        <View style={styles.CardFooterRow}>
          <Text style={styles.CardPriceCurrency}>
            Rp. <Text style={styles.CardPrice}>{price}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => {
              buttonPressHandler({
                id,
                type,
                imagelink_square,
                name,
                item_piece,
                price,
                quantity: 1,
              });
            }}>
            <BGIcon
              color={COLORS.primaryWhiteHex}
              name={'add'}
              BGColor={COLORS.secondaryGreenHex}
              size={FONTSIZE.size_10}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  CardLinearGradientContainer: {
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_25,
    marginHorizontal: 10,
    elevation:6
  },
  CardImageBG: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: BORDERRADIUS.radius_20,
    marginBottom: SPACING.space_15,
    overflow: 'hidden',
  },
  CardTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_16,
  },
  CardSubtitle: {
    fontFamily: FONTFAMILY.poppins_light,
    color: COLORS.primaryDarkGreyHex,
    fontSize: FONTSIZE.size_10,
  },
  CardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.space_15,
  },
  CardPriceCurrency: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenHex,
    fontSize: FONTSIZE.size_14,
  },
  CardPrice: {
    color: COLORS.primaryGreenHex,
  },
});

export default MealCard;
