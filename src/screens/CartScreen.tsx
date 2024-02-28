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
import {BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
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
import CustomIcon from '../components/CustomIcon';

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

const CartScreen = ({navigation}:any) => {
  const tabBarHeight = useBottomTabBarHeight();
  const [cartList, setCartList] = useState<any[]>([])
  const [itemList, setItemList] = useState<any[]>([])
  const [cartPrice, setCartPrice] = useState<CartItem[]>([])
  const [itemDetails, setItemDetails] = useState<any>([])
  const [addressUser, setAddressUser] = useState<Address[]>([])

  

  const getUserCartItem = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${apiUrl}/api/user-cart-items/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch carts');
      }
      const data = await response.json();
      setCartList(data);
      const itemIds = data.map(({ itemId, quantity}: any) => {
        return { itemId, quantity};
      });
      setItemList(itemIds);
      return { data, itemIds };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getItemDetails = async (data: CartItem[]) => {
    try {
      const itemDetails = await Promise.all(
        data.map(async ({ itemId }: any) => {
          const priceResponse = await fetch(`${apiUrl}/api/meal-item/${itemId}`);
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
      const { data } = await getUserCartItem();
      const itemDetails = await getItemDetails(data);
      setItemDetails(itemDetails);
      const totalPriceCart = calculateTotalPrice(itemDetails, data);
      setCartPrice(totalPriceCart);
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
  let year = currentDate.getFullYear();
  let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  let day = ("0" + currentDate.getDate()).slice(-2);
  let hour = ("0" + currentDate.getHours()).slice(-2);
  let minute = ("0" + currentDate.getMinutes()).slice(-2);
  let second = ("0" + currentDate.getSeconds()).slice(-2);

  let formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;


  const checkoutHandler = async () => {
    fetchCart();
    const userId = await AsyncStorage.getItem('userId');
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
        order_id: `ORDER-${Math.floor(Math.random() * 1000000)}`,
        gross_amount: cartPrice
      }
    };

    let orderdata = {
      item_details: itemDetails.map((item: { id: any;}, index: number) => ({
        itemId: item.id,
        quantity: cartList[index]?.quantity || 0
      })),
      address_details: addressUser.map((item: {id: any},) => ({
        addressId: item.id,
      })),
      order_details: {
        order_date: `${formattedDate}`
      }
    }

    try {
      const response = await axios.post(`${apiUrl}/api/add-user-order/${userId}`, orderdata)
      if (response.status == 200) {
        console.log("Success Order")
      }
    } catch (error) {
      console.error("Error during post order:", error);
    }

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
        console.log(payment_url)
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

    await axios.post(
      `${apiUrl}/api/remove-items/${userId}`
    );

    fetchCart();
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
            {/* <HeaderBar /> */}

            <View style={styles.HeaderContainer}>
              <TouchableOpacity 
              style={styles.AddressBox}
              onPress={()=>navigation.navigate('Address')}
              >
                  <View>
            <CustomIcon
                    style={styles.InputIcon}
                    name="location"
                    size={FONTSIZE.size_30}
                    color={COLORS.primaryLightGreyHex}
                  />
            </View>
          <View style={styles.innerAddressBox}>
            <Text style={styles.AddressTitle}>Deliver To</Text>
            <Text style={styles.AddressText}>{addressUser.length > 0 ? addressUser[0].recipient : 'Set Address'}</Text>
          </View>
        </TouchableOpacity>
    </View>
            
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
                      item_piece={itemId.item_piece}
                      imagelink_square={itemId.imagelink_square}
                      price={itemId.price}
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
              buttonTitle="Checkout"
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

HeaderText: {
  fontFamily: FONTFAMILY.poppins_semibold,
  fontSize: FONTSIZE.size_20,
  color: COLORS.primaryWhiteHex,
},
AddressBox: {
  alignItems: 'center',
  flexDirection:'row',
  height: 60,
  width:200,
  borderRadius: BORDERRADIUS.radius_20,
  backgroundColor: COLORS.primaryDarkGreyHex,
},
AddressTitle: {
  fontFamily: FONTFAMILY.poppins_medium,
  fontSize: FONTSIZE.size_14,
  color: COLORS.primaryWhiteHex,
},
AddressText:{
  fontFamily: FONTFAMILY.poppins_medium,
  fontSize: FONTSIZE.size_16,
  color: COLORS.primaryWhiteHex,
},
innerAddressBox:{
  marginTop:5
},
InputIcon: {
  marginHorizontal: SPACING.space_20,
},
});

export default CartScreen