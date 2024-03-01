import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import apiUrl from '../../../apiConfig'
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const EditMealScreen = ({navigation, route}:any) => {
  const { id } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagelink_square, setImagelinkSquare] = useState('');
  const [item_piece, setItemPiece] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');

  const getMeal = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/meal-item/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch meal');
      }
      const data = await response.json();
        setName(data.name);
        setDescription(data.description);
        setImagelinkSquare(data.imagelink_square);
        setItemPiece(data.item_piece);
        setPrice(data.price);
        setType(data.type);
    } catch (error) {
      console.error(error);
    }
  }

  const saveMeal = async () => {
    try {
      const newMeal = { name, description, imagelink_square, item_piece, price, type };
    const response = await fetch(`${apiUrl}/api/edit-meal/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMeal)
    });
    if (!response.ok) {
      throw new Error('Failed to edit meal')
    }
    navigation.goBack()
    } catch (error) {
      console.error(error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getMeal()
    }, [])
  );


  return (
    <View style={styles.ScreenContainer}>
      <View style={styles.HeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.edit}>
          <Image
            source={require('../../assets/icons/arrow-circle-left.png')}
            style={{
            height: 36,
            width: 36,
            marginRight: 8
            }}
            resizeMode='contain'
          />
            <Text style={styles.address}>Edit meal</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)} // Update recipient state
      />
      <Text style={styles.title}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={(text) => setDescription(text)} // Update phone state
      />
      <Text style={styles.title}>Image link</Text>
      <TextInput
        style={styles.input}
        value={imagelink_square}
        onChangeText={(text) => setImagelinkSquare(text)} // Update address state
      />
      <Text style={styles.title}>Item piece</Text>
      <TextInput
        style={styles.input}
        value={item_piece}
        onChangeText={(text) => setItemPiece(text)} // Update notes state
      />
      <Text style={styles.title}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={(text) => setPrice(text)} // Update notes state
      />
      <Text style={styles.title}>Type</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={(text) => setType(text)} // Update notes state
      />
      <View style={styles.nav}>
        <View style={styles.button}>
          <TouchableOpacity onPress={saveMeal}>
            <Text style={styles.save}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default EditMealScreen

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