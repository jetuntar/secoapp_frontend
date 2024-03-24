import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../../../theme/theme';
import EmptyListAnimation from '../../../components/EmptyListAnimation';
import PopUpAnimation from '../../../components/PopUpAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../apiConfig';
import { useFocusEffect } from '@react-navigation/native';
import AdminOrderItemCard from '../../../components/AdminOrderItemCard';
import axios from 'axios';
import HeaderBar from '../../../components/HeaderBar';

const AdminOrderScreen = ({navigation}:any) => {
  const tabBarHeight = useBottomTabBarHeight();

  const [orderList, setOrderList] = useState<any[]>([])

  const getOrderItems = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/get-orders-ongoing`);
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
      getOrderItems();
      // getUserAddress();
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

  const finishOrder = async (id: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/order-finish/${id}`
      );
      fetchOrder();
    } catch (error) {
      console.error('Failed to finish order', error);
    }
  }

  const finishOrderHandler = (id: string) => {
    finishOrder(id);
  };

  return (
    <View style={styles.ScreenContainer}>
      <HeaderBar/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View
          style={[styles.ScrollViewInnerView, {marginBottom: tabBarHeight}]}>
          <View style={styles.ItemContainer}>

            {orderList.length == 0 ? (
              <EmptyListAnimation title={'No Orders'} />
            ) : (
              <View style={styles.ListItemContainer}>
                {orderList.map(({id, itemId, quantity, addressId, order_status, Address, MealItem, order_date}: any) => (
                  <TouchableOpacity
                  onPress={() => console.log(MealItem)}  
                  key={itemId}>
                    <AdminOrderItemCard
                    id={id}
                    recipient={Address.recipient}
                    order_date={order_date}
                    imagelink_square={MealItem.imagelink_square}
                    itemId={itemId}
                    addressId={addressId}
                    quantity={quantity}
                    name={MealItem.name}
                    price={MealItem.price}
                    order_status={order_status}
                    buttonPressHandler={finishOrderHandler}
                  />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AdminOrderScreen

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primarySilverHex,
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
  ButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
})