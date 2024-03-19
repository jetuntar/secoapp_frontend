import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import apiUrl from '../../apiConfig';
import LinearGradient from 'react-native-linear-gradient';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import ImageBackgroundInfo from './ImageBackgroundInfo';

interface FavoritesItemCardProps {
  id: string;
  imagelink_square:string;
  name:string;
  item_piece:string;
  favourite: boolean;
  toggleFavouriteItem: any;
}

const FavoritesItemCard: React.FC<FavoritesItemCardProps> = ({
  id,
  imagelink_square,
  name,
  item_piece,
  toggleFavouriteItem,
  favourite,
}) => {
  return (
    <View style={styles.CardContainer}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={[COLORS.primaryWhiteHex, COLORS.primaryWhiteHex]}
            style={styles.ContainerLinearGradient}>
            <View style={styles.Image}>
              <ImageBackgroundInfo
                EnableFav={false}
                imagelink_square={imagelink_square}
                id={id}
                favourite={favourite}
                toggleFavourite={toggleFavouriteItem}
              />
            </View>
            <Text style={styles.Title}>{name}</Text>
            <Text style={styles.Text}>{item_piece}</Text>
          </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    borderRadius: BORDERRADIUS.radius_25,
    overflow: 'hidden',
  },
  ContainerLinearGradient: {
    padding:10
  },
  Image: {
    borderRadius:16,
    overflow: 'hidden'
  },
  Title: {
    paddingTop:10,
    paddingHorizontal:10,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryBlackHex,
  },
  Text: {
    paddingHorizontal:10,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackHex,
  },
});

export default FavoritesItemCard;
