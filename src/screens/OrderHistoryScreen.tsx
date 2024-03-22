import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PopUpAnimation from '../components/PopUpAnimation';
import OrderHistoryCard from '../components/OrderHistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../apiConfig';
import { useFocusEffect } from '@react-navigation/native';
import OrderItemCard from '../components/OrderItemCard';

interface Address {
  address: string;
  id: number;
  phone: string;
  recipient: string;
  userId: number;
}

interface CartItem {
  itemId: string;
  quantity: number;
}

const OrderHistoryScreen = ({navigation}: any) => {
  const OrderHistoryList = useStore((state: any) => state.OrderHistoryList);
  const tabBarHeight = useBottomTabBarHeight();
  const [showAnimation, setShowAnimation] = useState(false);

  const [orderList, setOrderList] = useState<any[]>([])

  const getUserOrderItem = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/get-user-orders/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrderList(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  
  const fetchOrder = async () => {
    try {
      getUserOrderItem();
    } catch (error) {
      console.error(error);
      // Handle error here, e.g., show error message to user
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrder();
    }, [])
  );

  const buttonPressHandler = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.HeaderContainer}>
        <View style={styles.HeaderInnerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.Icon}>
            <Text style={styles.Title}>Order History</Text>
        </TouchableOpacity>
        </View>
      </View>
      {showAnimation ? (
        <PopUpAnimation
          style={styles.LottieAnimation}
          source={require('../lottie/download.json')}
        />
      ) : (
        <></>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View
          style={[styles.ScrollViewInnerView, {marginBottom: tabBarHeight}]}>
          <View style={styles.ItemContainer}>

            {orderList.length == 0 ? (
              <EmptyListAnimation title={'No Order History'} />
            ) : (
              
              <View style={styles.ListItemContainer}>
                {orderList.map(({itemId, quantity, MealItem, Address, order_date}: any) => (
                  <TouchableOpacity onPress={() => {
                    navigation.push('Details', {
                      id: itemId,
                    });
                  }}
                  key={itemId}>
                    <OrderItemCard
                    id={itemId}
                    order_date={order_date}
                    quantity={quantity}
                    imagelink_square={MealItem.imagelink_square}
                    price={MealItem.price}
                    name={MealItem.name}
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
}

export default OrderHistoryScreen

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primarySilverHex,
  },
  HeaderContainer: {
    paddingHorizontal:25,
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
  LottieAnimation: {
    height: 250,
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
    gap: SPACING.space_10,
  },
  DownloadButton: {
    margin: SPACING.space_20,
    backgroundColor: COLORS.primaryOrangeHex,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_36 * 2,
    borderRadius: BORDERRADIUS.radius_20,
  },
  ButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
})