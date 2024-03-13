import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import apiUrl from '../../apiConfig';
import LinearGradient from 'react-native-linear-gradient';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import ImageBackgroundInfo from './ImageBackgroundInfo';

interface FavoritesItemCardProps {
  id: string;
  imagelink_square:string;
  description:string;
  favourite: boolean;
  toggleFavouriteItem: any;
}

const FavoritesItemCard: React.FC<FavoritesItemCardProps> = ({
  id,
  imagelink_square,
  description,
  toggleFavouriteItem,
  favourite,
}) => {
  // const [mealItem, setMealItem] = useState<any>(null);

  // useEffect(() => {
  //   const fetchCoffeeItem = async () => {
  //     try {
  //       // console.log(id);
  //       const response = await fetch(`${apiUrl}/api/meal-item/${id}`); // Use id from props
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch fav item');
  //       }
  //       const data = await response.json();
  //       setMealItem(data);
  //     } catch (error) {
  //       console.error(error);
  //       // Handle error here
  //     }
  //   };

  //   fetchCoffeeItem();
  // }, [id]); // Add id to the dependency array

  return (
    <View style={styles.CardContainer}>
          <ImageBackgroundInfo
            EnableBackHandler={false}
            imagelink_square={imagelink_square}
            id={id}
            favourite={favourite}
            toggleFavourite={toggleFavouriteItem}
          />
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
            style={styles.ContainerLinearGradient}>
            <Text style={styles.DescriptionTitle}>Description</Text>
            <Text style={styles.DescriptionText}>{description}</Text>
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
    gap: SPACING.space_10,
    padding: SPACING.space_20,
  },
  DescriptionTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.secondaryLightGreyHex,
  },
  DescriptionText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
});

export default FavoritesItemCard;
