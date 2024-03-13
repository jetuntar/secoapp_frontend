import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import apiUrl from '../../apiConfig';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, BORDERRADIUS, SPACING, FONTFAMILY, FONTSIZE } from '../theme/theme';
import ImageBackgroundInfo from './ImageBackgroundInfo';
import GradientBGIcon from './GradientBGIcon';

interface PromoImageItemCardProps {
  id: string;
  imagelink:string;
  buttonHandler:any;
}

const PromoImageBG: React.FC<PromoImageItemCardProps> = ({
  id,
  imagelink,
  buttonHandler
}) => {
  const [promoIitem, setPromoItem] = useState<PromoImageItemCardProps[]>([]);
  return (
    <View style={styles.CardContainer}>
          <View>
            <ImageBackground
              source={{uri : imagelink}}
              style={styles.ItemBackgroundImage}>
                <View style={styles.ImageHeaderBarContainerWithoutBack}>
                  <TouchableOpacity
                    onPress={() => {
                      buttonHandler(id)
                    }}>
                    <GradientBGIcon
                      name="minus"
                      color={COLORS.primaryLightGreyHex}
                      size={FONTSIZE.size_16}
                    />
                  </TouchableOpacity>
                </View>
            </ImageBackground>
          </View>
    </View>
  )
}

export default PromoImageBG

const styles = StyleSheet.create({
  CardContainer: {
    borderRadius: BORDERRADIUS.radius_25,
    overflow: 'hidden',
  },
  ContainerLinearGradient: {
    gap: SPACING.space_10,
    padding: SPACING.space_20,
  },
  ItemBackgroundImage: {
    width: '100%',
    aspectRatio: 20 / 10,
    justifyContent: 'space-between',
  },
  ImageHeaderBarContainerWithBack: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ImageHeaderBarContainerWithoutBack: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ImageInfoOuterContainer: {
    paddingVertical: SPACING.space_24,
    paddingHorizontal: SPACING.space_30,
    backgroundColor: COLORS.primaryBlackRGBA,
    borderTopLeftRadius: BORDERRADIUS.radius_20 * 2,
    borderTopRightRadius: BORDERRADIUS.radius_20 * 2,
  },
  ImageInfoInnerContainer: {
    justifyContent: 'space-between',
    gap: SPACING.space_15,
  },
  InfoContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})