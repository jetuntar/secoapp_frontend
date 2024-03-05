import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import BGIcon from './BGIcon';

interface PromoCardProps {
  id:string;
  imagelink:string;
}

const PromoCard: React.FC<PromoCardProps> = ({
  id,
  imagelink
}) => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.CardLinearGradientContainer}
      colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}>
      <Image
        source={{uri: imagelink}}
        style={styles.CardImageBG}
        resizeMode="cover">
      </Image>
    </LinearGradient>
  )
}

export default PromoCard

const styles = StyleSheet.create({
  CardLinearGradientContainer: {
    borderRadius: BORDERRADIUS.radius_20,

  },
  CardImageBG: {
    width: 333,
    height: 145,
    borderRadius: BORDERRADIUS.radius_20,
    overflow: 'hidden',
  },
})