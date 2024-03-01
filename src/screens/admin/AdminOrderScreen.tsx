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
} from '../../theme/theme';
import EmptyListAnimation from '../../components/EmptyListAnimation';
import PopUpAnimation from '../../components/PopUpAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../apiConfig';
import { useFocusEffect } from '@react-navigation/native';
import AdminOrderItemCard from '../../components/AdminOrderItemCard';
import axios from 'axios';
import HeaderBar from '../../components/HeaderBar';



const AdminOrderScreen = ({navigation}:any) => {
  const tabBarHeight = useBottomTabBarHeight();

  const [orderList, setOrderList] = useState<any[]>([])
  const [itemList, setItemList] = useState<any[]>([])
  const [itemDetails, setItemDetails] = useState<any>([])

  
  const getOrderItems = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/get-orders-ongoing`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrderList(data);
      const itemIds = data.map(({id, itemId, quantity, addressId}: any) => {
        return {id, itemId, quantity, addressId};
      });
      setItemList(itemIds);
      return { data, itemIds };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // const getUserAddress = async () => {
  //   try {
  //     const userId = await AsyncStorage.getItem('userId');
  //     const response = await fetch(`${apiUrl}/api/get-address/${userId}`)
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch carts');
  //     }
  //     const data = await response.json();
  //     setAddressUser(data);
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  const fetchOrder = async () => {
    try {
      getOrderItems();
      setItemDetails(itemDetails);
      // getUserAddress();
      // console.log(orderList);
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
    // <View>
    //   <Text>ini order</Text>
    // </View>
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
                {itemList.map(({id, itemId, quantity}: any) => (
                  <TouchableOpacity
                  onPress={() => console.log(id)}
                  key={itemId}>
                    <AdminOrderItemCard
                    id={id}
                    itemId={itemId}
                    addressId={itemId.addressId}
                    quantity={quantity}
                    order_status={itemId.order_status}
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