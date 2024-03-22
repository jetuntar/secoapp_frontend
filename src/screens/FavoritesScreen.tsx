import React, { useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { COLORS, SPACING } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import EmptyListAnimation from '../components/EmptyListAnimation';
import FavoritesItemCard from '../components/FavoritesItemCard';
import apiUrl from '../../apiConfig';
import axios from 'axios';

const FavoritesScreen = ({ navigation}: any) => {
  const [favoritesList, setFavoritesList] = useState([]);
  const tabBarHeight = useBottomTabBarHeight();

  const fetchFavorites = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/user-fav-items/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      setFavoritesList(data);
    } catch (error) {
      console.error(error);
      // Handle error here, e.g., show error message to user
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const deleteFromFavoriteList = async (id: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await axios.post(
        `${apiUrl}/api/remove-fav/${userId}/${id}`
      );
      fetchFavorites();
    } catch (error) {
      console.error('Failed to remove from favorites', error);
      // Handle error here, e.g., show error message to user
    }
  };

  const toggleFavourite = (id: string) => {
  deleteFromFavoriteList(id)
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.HeaderContainer}>
        <View style={styles.HeaderInnerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.Icon}>
            <Text style={styles.Title}>Favorites</Text>
        </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewFlex}>
        <View style={[styles.scrollViewInnerView, { marginBottom: tabBarHeight }]}>
          <View style={styles.itemContainer}>

            {favoritesList.length === 0 ? (
              <EmptyListAnimation title={'No Favourites'} />
            ) : (
              <View style={styles.listItemContainer}>
                {favoritesList.map(({itemId, MealItem}:any) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        id: itemId
                      });
                    }}
                    key={itemId}>
                    <FavoritesItemCard
                      id={itemId}
                      imagelink_square={MealItem.imagelink_square}
                      name={MealItem.name}
                      item_piece={MealItem.item_piece}
                      favourite={itemId}
                      toggleFavouriteItem={() => toggleFavourite(itemId)}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.primarySilverHex,
  },
  HeaderContainer: {
    paddingHorizontal:30,
    paddingVertical:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderInnerContainer:{
    width:150
  },
  Icon: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
  },
  Title: {
    color: COLORS.secondaryDarkGreyHex,
    fontFamily: "Manrope, sans-serif",
    fontWeight: "800",
    fontSize: 18,
  },
  scrollViewFlex: {
    flexGrow: 1,
  },
  scrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemContainer: {
    flex: 1,
  },
  listItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_20,
  },
});
