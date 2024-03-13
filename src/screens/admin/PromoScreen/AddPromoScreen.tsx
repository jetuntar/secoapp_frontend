import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'
import apiUrl from '../../../../apiConfig'

const AddPromoScreen = ({navigation}:any) => {
  const [imagelink, setImagelink] = useState('')

  const addPromo = async() => {
    try {
      const newPromo = {imagelink}
      const response = await axios.post(`${apiUrl}/api/add-promo`, newPromo)
      if (response.status == 200) {
        console.info({message: 'Success add new promo'})
      } else {
        console.info({message: 'Failed to add new promo'})
      }
      navigation.goBack()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.ScreenContainer}>
      <View style={styles.HeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.edit}>
          <Image
            source={require('../../../assets/icons/arrow-circle-left.png')}
            style={{
            height: 36,
            width: 36,
            marginRight: 8
            }}
            resizeMode='contain'
          />
            <Text style={styles.address}>Add new promo</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>ImageLink</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setImagelink(text)}
      />
      <View style={styles.nav}>
        <View style={styles.button}>
          <TouchableOpacity onPress={addPromo}>
            <Text style={styles.save}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default AddPromoScreen

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(245,245,245,1)",
    padding: 20,
  },
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  edit: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  address: {
    color: "rgba(41,45,50,1)",
    fontFamily: "Manrope, sans-serif",
    fontWeight: "800",
    fontSize: 18,
  },
  input: {
    width: "100%",
    height: 55,
    paddingLeft: 12,
    borderRadius: 16,
    backgroundColor: "rgba(217,217,217,0.5)",
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
    color: 'rgba(41,45,50,0.8)',
  },
  title: {
    color: "rgba(147,147,147,1)",
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 15,
  },
  nav: {
    position: "absolute",
    bottom: 0,
    width: "150%",
    height: 75,
    paddingLeft: 278,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(247, 251, 252, 1)",
  },
  button: {
    width: 100,
    height: 35,
    borderRadius: 10,
    backgroundColor: "rgba(83,89,71,1)",
    justifyContent: "center",
  },
  save: {
    color: "rgba(247,251,252,1)",
    fontSize: 16,
    fontFamily: "Manrope, sans-serif",
    fontWeight: "600",
    textAlign: "center",
  }
})