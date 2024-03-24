import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import apiUrl from '../../../../apiConfig';
import { useFocusEffect } from '@react-navigation/native';
import HeaderBar from '../../../components/HeaderBar';
import { COLORS, FONTSIZE, SPACING } from '../../../theme/theme';
import EmptyListAnimation from '../../../components/EmptyListAnimation';
import FavoritesItemCard from '../../../components/FavoritesItemCard';
import PromoCard from '../../../components/PromoCard';
import PromoImageBG from '../../../components/PromoImageBG';
import axios from 'axios';
import GradientBGIconVector from '../../../components/GradientBGIconVector';
import GradientBGIcon from '../../../components/GradientBGIcon';

const AdminPromoScreen = ({navigation}:any) => {
  const tabBarHeight = useBottomTabBarHeight();

  const [promoList, setPromoList] = useState<any[]>([])


  const getAllPromo = async() => {
    try {
      const response = await fetch(`${apiUrl}/api/all-promo`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setPromoList(data);
    } catch (error) {
      
    }
  }

  const deletePromo = async(id:string) => {
    try {
      await axios.post(`${apiUrl}/api/delete-promo/${id}`)
      fetchPromo()
    } catch (error) {
      console.error(`Failed to remove promo`, error)
    }
  };

  const fetchPromo = async() => {
    try {
      getAllPromo();
    } catch (error) {
      console.error(error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchPromo();
    }, [])
  )

  return (
    <View style={styles.ScreenContainer}>
      <View style={styles.HeaderContainer}>
        <TouchableOpacity 
        onPress={()=> navigation.navigate('AddPromo')}>
          <GradientBGIcon
            name="add"
            color={COLORS.primaryLightGreyHex}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity>
        </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
          <View style={styles.ItemContainer}>

          {promoList.length === 0 ? (
            <EmptyListAnimation title={'No Promo'} />
          ) : (
            <View style={styles.ListItemContainer}>
              {promoList.map(id => (
                  <PromoImageBG
                    id={id.id}
                    imagelink={id.imagelink}
                    buttonHandler={() => deletePromo(id.id)}
                  />
              ))}
            </View>
          )}
          </View>
      </ScrollView>
    </View>
  )
}

export default AdminPromoScreen

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primarySilverHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_30,
  },
  HeaderContainer: {
    paddingTop: SPACING.space_30,
    paddingLeft:SPACING.space_30,
    paddingRight:SPACING.space_30,
    paddingBottom:SPACING.space_20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})