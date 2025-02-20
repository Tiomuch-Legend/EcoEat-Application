import React, { useState, useEffect } from 'react';
import { Text, FlatList, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function Recipe() {
  const [recipeName, setRecipeName] = useState('');
  const [guessCalories, setGuessCalories] = useState('');
  const [guessVitamins, setGuessVitamins] = useState('');
  const [foodRestrictions, setFoodRestrictions] = useState('');
  const [listIngredients, setListIngredients] = useState('');
  const [listSteps, setListSteps] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const recipeName = await AsyncStorage.getItem('recipe_name');
        const guessCalories = await AsyncStorage.getItem('guess_calories');
        const guessVitamins = await AsyncStorage.getItem('guess_vitamins');
        const foodRestrictions = await AsyncStorage.getItem('food_restrictions');
        const listIngredients = await AsyncStorage.getItem('list_ingredients');
        const listSteps = await AsyncStorage.getItem('list_steps');

        if (recipeName !== null) setRecipeName(recipeName);
        if (guessCalories !== null) setGuessCalories(guessCalories);
        if (guessVitamins !== null) setGuessVitamins(guessVitamins);
        if (foodRestrictions !== null) setFoodRestrictions(foodRestrictions);
        if (listIngredients !== null) setListIngredients(listIngredients);
        if (listSteps !== null) setListSteps(listSteps);
      } catch (error) {
        console.error('Error loading data from AsyncStorage', error);
      }
    };

    loadData();
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64WithPrefix = `data:image/jpeg;base64,${base64Image}`;
      // console.log(base64WithPrefix);

      const url = "http://192.168.1.103:8123/get_recipe"; // Замени на реальную IP-адресу сервера

      const payload = {
        image_url: base64WithPrefix,
        user_restrictions: "null", // или null, если не нужно
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const res = await response.json();
        console.log("Полученный рецепт:", res);
        

        // Сохраняем данные в AsyncStorage
        await AsyncStorage.setItem('recipe_name', res.recipe_name);
        await AsyncStorage.setItem('guess_calories', String(res.guess_calories));
        await AsyncStorage.setItem('guess_vitamins', res.guess_vitamins);
        await AsyncStorage.setItem('list_ingredients', res.list_ingredients);
        await AsyncStorage.setItem('list_steps', res.list_steps);

        if (res.food_restrictions) {
          await AsyncStorage.setItem('food_restrictions', res.food_restrictions);
        } else {
          await AsyncStorage.setItem('food_restrictions', 'Peanut Butter'); // или любое значение по умолчанию
        }

        // Обновляем состояние с новыми данными
      setRecipeName(res.recipe_name);
      setGuessCalories(String(res.guess_calories));
      setGuessVitamins(res.guess_vitamins);
      setFoodRestrictions(res.food_restrictions || 'None');

        console.log('Данные сохранены!');
        

      } catch (error) {
        console.error("Ошибка запроса:", error);
      }

    } else {
      alert('Вы не выбрали изображение.');
    }
  };

  return (
    <View style={styles.wrapperMain}>
      <ScrollView style={styles.wrapper}>
        <Text style={styles.h1}>EcoEat</Text>
        <Text style={styles.h2}>Edit recipe:</Text>

        <View style={styles.recipeBox}>
          <Image
            style={styles.recipeImg}
            source={require("../assets/images/image.png")}
          />

          <View style={styles.contentBlock}>
            <View style={styles.topBlock}>
              <Text style={styles.recipeName}>{recipeName}</Text>
              <Image
                style={styles.editImg}
                source={require("../assets/images/edit.png")}
              />
            </View>

            <View style={styles.calWrapper}>
              <View style={styles.caloriesBox}>
                <Image
                  source={require("../assets/images/cal.png")}
                  style={styles.caloriesImg}
                />
                <Text style={styles.caloriesText}>{guessCalories}</Text>
              </View>

              <View style={styles.vitaminsBox}>
                <Image
                  style={styles.vitaminsImg}
                  source={require("../assets/images/vitam.png")}
                />
                <Text style={styles.caloriesText}>{guessVitamins}</Text>
              </View>
            </View>

            <Text style={styles.cancelsText}>Restrictions: {foodRestrictions}</Text>
          </View>
        </View>

        <View style={styles.ingWrapper}>
          <Text style={styles.ingH}>Ingridients</Text>
          <Text style={styles.mainIngText}>{listIngredients}</Text>
        </View>

        <View style={styles.stepsBox}>
          <Text style={styles.stepsH}>Steps</Text>
          <View style={styles.stepsContainer}>
            <Text style={styles.mainIngText}>{listSteps}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerBox}>
          <Image
            style={styles.footerImg}
            source={require("../assets/images/home.png")}
          />
          <Text style={styles.activeText}>My recipes</Text>
        </View>
        <TouchableOpacity style={styles.footerBox}  onPress={pickImageAsync}>
          <Image
            style={styles.footerImg}
            source={require("../assets/images/add.png")}
          />
          <Text style={styles.footerText}>Add recipe</Text>
        </TouchableOpacity>
        <View style={styles.footerBox}>
          <Image
            style={styles.footerImg}
            source={require("../assets/images/profile.png")}
          />
          <Text style={styles.footerText}>Profile</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperMain: {
    flex: 1
  },
  wrapper: {
    backgroundColor: "#F5FFF5",
  },
  h1: {
    letterSpacing: -2,
    textAlign: "center",
    marginTop: 12,
    fontSize: 34,
    color: "#3D774D",
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 22,
    textAlign: "center",
    letterSpacing: -1,
    color: "#3D774D",
    marginTop: 12,
    fontWeight: 'semibold',
  },
  recipeBox: {
    width: 343,
    height: 'auto',
    borderRadius: 10,
    borderColor: "#FFDAB9",
    borderWidth: 1,
    marginLeft: 24,
    marginTop: 24,
    flexDirection: "row",
    padding: 12,
  },
  recipeImg: {
    borderRadius: 10,
    width: 89,
    height: 91,
    margin: 8,
  },
  contentBlock: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: 'center',

  },
  topBlock: {
    flexDirection: "row",
    textAlign: 'center',
  },
  recipeName: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 8,
    marginRight: 100,
    marginTop: 8,
    fontWeight: 'bold',
  },
  editImg: {
    width: 22,
    height: 22,
    marginRight: 60,
    marginTop: 4,
  },
  calWrapper: {
    flexDirection: "row",
    alignItems: 'center',
    marginLeft: -100,
  },
  caloriesBox: {
    flexDirection: "row",
    alignItems: 'center',
    marginRight: 20,
  },
  caloriesText: {
    fontSize: 16,
    color: "#FF7F50",
    fontWeight: 'bold',
  },
  caloriesImg: {
    width: 24,
    height: 24,
    marginRight: 2,
  },
  vitaminsBox: {
    flexDirection: "row",
    marginLeft: 4,
    marginRight: 36,
  },
  vitaminsImg: {
    width: 24,
    height: 24,
    marginRight: 2,
  },
  cancelsText: {
    fontSize: 12,
    textAlign: 'center',
    marginRight: 160,
    marginTop: 10,
  },
  ingWrapper: {
    width: 343,
    height: 324,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFDAB9",
    flexDirection: "column",
    marginLeft: 24,
    marginTop: 24,
  },
  ingH: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  mainIngText: {
    fontSize: 16,
    marginLeft: 8,
  },
  stepsBox: {
    alignItems: 'center',
    width: 343,
    height: 'auto',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFDAB9",
    flexDirection: "column",
    marginLeft: 24,
    marginTop: 24,
  },
  stepsH: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  stepsContainer: {
    width: 327,
    height: 'auto',
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'semibold',
    padding: 12,

  },
  stepsText: {
    fontSize: 16,
    textAlign: 'left',
  },
  footer: {
    width: 400,
    height: 96,
    backgroundColor: "#3D774D",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerBox: {
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
  },
  footerImg: {
    width: 24,
    height: 24,
  },
  activeText: {
    color: "#FF7F50",
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: "#CDCDE0",
    fontWeight: 'bold',
  }
});
