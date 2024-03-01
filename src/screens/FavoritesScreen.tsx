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
  const [itemList, setItemList] = useState([]);
  const tabBarHeight = useBottomTabBarHeight();

  const fetchFavorites = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/user-fav-items/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      const itemIds = data.map(({itemId}:any) => itemId); // Extracting itemId from data
      setItemList(itemIds); // Setting itemList to an array of itemIds
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewFlex}>
        <View style={[styles.scrollViewInnerView, { marginBottom: tabBarHeight }]}>
          <View style={styles.itemContainer}>

            {favoritesList.length === 0 ? (
              <EmptyListAnimation title={'No Favourites'} />
            ) : (
              <View style={styles.listItemContainer}>
                {itemList.map(itemId => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        id: itemId
                      });
                    }}
                    key={itemId}>
                    <FavoritesItemCard
                      id={itemId}
                      name={itemId}
                      imagelink_square={itemId}
                      description={itemId}
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
    backgroundColor: COLORS.primaryBlackHex,
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
