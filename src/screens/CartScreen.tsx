import React, { useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking
} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PaymentFooter from '../components/PaymentFooter';
import CartItem from '../components/CartItem';
import apiUrl from '../../apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link, useFocusEffect } from '@react-navigation/native';
import { encode } from 'base-64';
import App from '../../App';

const CartScreen = ({navigation}:any) => {
  const tabBarHeight = useBottomTabBarHeight();
  const [cartList, setCartList] = useState<any[]>([])
  const [itemList, setItemList] = useState<any[]>([])
  const [cartPrice, setCartPrice] = useState<any>([])
  const [itemDetails, setItemDetails] = useState<any>([])

  const getUserCartItem = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/user-cart-items/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch carts');
      }
      const data = await response.json();
      setCartList(data);
      const itemIds = data.map(({ itemId, quantity }: any) => {
        return { itemId, quantity };
      });
      setItemList(itemIds);
      return { data, itemIds };
    } catch (error) {
      console.error(error);
      // Handle error here, e.g., show error message to user
      throw error;
    }
  };

  interface CartItem {
    itemId: string;
    quantity: number;
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
  
  const calculateTotalPrice = (itemDetails: any[], cartList: CartItem[]) => {
    try {
      const totalPriceCart = itemDetails.reduce((acc, item, index) => {
        const totalPriceItem = item.price * cartList[index].quantity;
        return acc + totalPriceItem;
      }, 0);
      return totalPriceCart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  
  const fetchCart = async () => {
    try {
      const { data } = await getUserCartItem();
      const itemDetails = await getItemDetails(data);
      setItemDetails(itemDetails);
      const totalPriceCart = calculateTotalPrice(itemDetails, data);
      setCartPrice(totalPriceCart);
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

  const incrementItem = async (id: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await axios.put(
        `${apiUrl}/api/increment-item-cart/${userId}/${id}`
      );
      fetchCart();
    } catch (error) {
      console.error('Failed to remove from favorites', error);
    }
  }

  const decrementItem = async (id: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await axios.put(
        `${apiUrl}/api/decrement-item-cart/${userId}/${id}`
      );
      fetchCart();
    } catch (error) {
      console.error('Failed to remove from favorites', error);
    }
  }

  const incrementCartItemQuantityHandler = (id: string) => {
    incrementItem(id);
  };

  const decrementCartItemQuantityHandler = (id: string) => {
    decrementItem(id);
  };

  let currentDate = new Date();
  let formattedDate = currentDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/[/\s/:]/g, '-');


  const checkoutHandler = async () => {
    const secret = 'SB-Mid-server-NxDJMYT-daettKH3d_-1ky5r'
    const encodedSecret = encode(secret)
    const basicAuth = `Basic ${encodedSecret}`
    const checkoutUrl = 'https://api.sandbox.midtrans.com'

    let paydata = {
      item_details: itemDetails.map((item: { id: any; name: any; price: any; }, index: number) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: cartList[index]?.quantity || 0
      })),
      transaction_details: {
        order_id: `ORDER-${formattedDate}`, // Add 'ORDER-' prefix to formattedDate
        gross_amount: cartPrice
      }
    };

    try {
        const response = await fetch(`${checkoutUrl}/v1/payment-links`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": basicAuth
          },
          body: JSON.stringify(paydata)
        })

        const paymentLink = await response.json()
        let payment_url = paymentLink.payment_url
        // console.log(payment_url)
        Linking.openURL(payment_url)
        .then((supported) => {
          if (!supported) {
            console.log("Can't handle payment url: "+ payment_url);
          } else {
            return Linking.openURL(payment_url)
          }
        })
        .catch((err) => console.error('An error occurred', err));
    } catch (error) {
        // Handle error
        console.error("Error during checkout:", error);
    }
  }


  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View
          style={[styles.ScrollViewInnerView, {marginBottom: tabBarHeight}]}>
          <View style={styles.ItemContainer}>
            <HeaderBar />

            

            {cartList.length == 0 ? (
              <EmptyListAnimation title={'Cart is Empty'} />
            ) : (
              <View style={styles.ListItemContainer}>
                {itemList.map(({itemId, quantity}: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        id: itemId,
                      });
                    }}
                    key={itemId}>
                    <CartItem
                      id={itemId}
                      quantity={quantity}
                      name={itemId.name}
                      imagelink_square={itemId.imagelink_square}
                      special_ingredient={itemId.special_ingredient}
                      roasted={itemId.roasted}
                      price={itemId.price}
                      type={itemId.type}
                      incrementCartItemQuantityHandler={
                        incrementCartItemQuantityHandler
                      }
                      decrementCartItemQuantityHandler={
                        decrementCartItemQuantityHandler
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {cartList.length != 0 ? (
            <PaymentFooter
              buttonPressHandler={checkoutHandler}
              buttonTitle="Pay"
              price={cartPrice}
            />
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({ScreenContainer: {
  flex: 1,
  backgroundColor: COLORS.primaryBlackHex,
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
  gap: SPACING.space_20,
}
});

export default CartScreen