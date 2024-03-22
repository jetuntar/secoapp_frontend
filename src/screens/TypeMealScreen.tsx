import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, StatusBar } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import apiUrl from '../../apiConfig'
import MealCard from '../components/MealCard';

interface MealDataItem {
  id: string;
  imagelink_square: string;
  name: string;
  description: string;
  item_piece:string;
  price: number;
  type: string;
}

const TypeMealScreen = ({navigation, route}:any) => {
  const [mealData, setMealData] = useState<MealDataItem[]>([]);
  const { type } = route.params;

  useEffect(() => {
    // Fetch meal data based on the type
    const fetchMealData = async () => {
      try {
        const items = await fetch(`${apiUrl}/api/type-meal/${type}`);
        const data = await items.json();
        setMealData(data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    fetchMealData();
  }, [type]);


  return (
    <View style={styles.ScreenContainer}>
      <View style={styles.HeaderContainer}>
        <View style={styles.HeaderInnerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.Icon}>
          <Image
            source={require('../assets/icons/arrow-circle-left.png')}
            style={{
            height: 36,
            width: 36,
            marginRight: 8
            }}
            resizeMode='contain'
          />
            <Text style={styles.Title}>{type}</Text>
        </TouchableOpacity>
        </View>
      </View>
      <FlatList
          ListEmptyComponent={
            <View style={styles.EmptyListContainer}>
              <Text style={styles.CategoryText}>No Meal Available</Text>
            </View>
          }
          numColumns={2}
          data={mealData}
          contentContainerStyle={styles.MealFlatListContainer}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.push('Details', {
                  id: item.id,
                },
                );
              }
              }>
              <MealCard
                id={item.id}
                item_piece={item.item_piece}
                type={item.type}
                imagelink_square={item.imagelink_square}
                name={item.name}
                description={item.description}
                price={item.price}
                buttonPressHandler={undefined}
              />
            </TouchableOpacity>
          )}
        />
    </View>
  )
}

export default TypeMealScreen

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primarySilverHex,
  },
  HeaderContainer: {
    paddingHorizontal:20,
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
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  MealFlatListContainer: {
    marginVertical:16,
    marginBottom:85,
    alignSelf:'center',
    alignItems:'center',
    rowGap:10
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  MealTitle: {
    marginLeft: 36,
    fontSize: FONTSIZE.size_18,
    marginTop: 16,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
  
})