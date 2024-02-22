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
  const [itemList, setItemList] = useState<any[]>([])
  const [itemDetails, setItemDetails] = useState<any>([])
  const [addressUser, setAddressUser] = useState<Address[]>([])

  const navigationHandler = ({id}: any) => {
    navigation.push('Details', {
      id
    });
  };

  const getUserOrderItem = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/get-user-orders/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrderList(data);
      const itemIds = data.map(({ itemId, quantity}: any) => {
        return { itemId, quantity};
      });
      setItemList(itemIds);
      return { data, itemIds };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const getItemDetails = async (data: CartItem[]) => {
    try {
      const itemDetails = await Promise.all(
        data.map(async ({ itemId }: any) => {
          const priceResponse = await fetch(`${apiUrl}/api/coffee-item/${itemId}`);
          if (!priceResponse.ok) {
            throw new Error('Failed to fetch item price');
          }
          const itemData = await priceResponse.json();
          return itemData;
        })
      );
      return itemDetails;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getUserAddress = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/get-address/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch carts');
      }
      const data = await response.json();
      setAddressUser(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  
  const fetchCart = async () => {
    try {
      const { data } = await getUserOrderItem();
      const itemDetails = await getItemDetails(data);
      setItemDetails(itemDetails);
      getUserAddress();
      // console.log(addressUser);
    } catch (error) {
      console.error(error);
      // Handle error here, e.g., show error message to user
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCart();
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
                {itemList.map(({itemId, quantity}: any) => (
                  <TouchableOpacity onPress={() => {
                    navigation.push('Details', {
                      id: itemId,
                    });
                  }}
                  key={itemId}>
                    <OrderItemCard
                    id={itemId}
                    quantity={quantity}
                    type={itemId.type}
                    name={itemId.name}
                    imagelink_square={itemId.imagelink_square}
                    special_ingredient={itemId.special_ingredient}
                    price={itemId.prices}
                    ItemPrice={itemId.ItemPrice}
                  />
                </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {/* {OrderHistoryList.length > 0 ? (
            <TouchableOpacity
              style={styles.DownloadButton}
              onPress={() => {
                buttonPressHandler();
              }}>
              <Text style={styles.ButtonText}>Download</Text>
            </TouchableOpacity>
          ) : (
            <></>
          )} */}
        </View>
      </ScrollView>
    </View>
  );
}

export default OrderHistoryScreen

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
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
    gap: SPACING.space_30,
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