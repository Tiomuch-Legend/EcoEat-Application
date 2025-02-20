import React from 'react';
import { Text, View,  StyleSheet, Button, TouchableOpacity, Pressable } from 'react-native';
import {Image} from 'expo-image';
import {useRouter, Link, SplashScreen } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App(){
  const router = useRouter();

  const on_click_hendler = async() => {
    
    console.log("heheheh")

    try {
      await AsyncStorage.setItem('recipe_name', 'No name');
      await AsyncStorage.setItem('guess_calories', 'None');
      await AsyncStorage.setItem('guess_vitamins', 'None');
      await AsyncStorage.setItem('food_restrictions', 'None');
      await AsyncStorage.setItem('list_ingredients', 'No list ingredients');
      await AsyncStorage.setItem('list_ingredients', 'No list steps');
      console.log('Дані збережено!');

    } catch (error) {
      console.error('Помилка збереження:', error);
    }

    router.push("/main")
  }

  return(
    <View style = {styles.wrapper}>
      <Text style = {styles.h1}>EcoEat</Text>
      <Image
        source = {require('../assets/images/vector.png')}
        style = {styles.bgImage}
      />
      <Text style = {styles.h2}>Save Eco, Eat Eco, Help Eco</Text>
      <Text style = {styles.mainText}>Help others and save money without leaving home!</Text>
      <View style = {styles.btnWrapper}>
          <Pressable onPress={on_click_hendler}>
            <LinearGradient
              colors={["#FF7F50", "#FFDAB9"]}
                  start={{ x: 0, y: 0 }} // Left side
                  end={{ x: 1, y: 0 }} // Right side (90-degree angle)
                  style={styles.btn}
            >
              <Text style = {styles.btnText}>Get Started</Text>
            </LinearGradient>

          </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:{
    flex: 1,
    backgroundColor: "#f5fff5",
  },
  h1:{
    letterSpacing: -2,
    textAlign: "center",
    marginTop: 12,
    fontSize: 34,
    color: "#3D774D",
    fontWeight: 'bold',

  },
  bgImage:{
    width: 390,
    height: 490,
  },
  h2:{
    fontSize: 30,
    textAlign: "center",
    letterSpacing: -1,
    color: "#3D774D",
    fontWeight: 'semibold',
  },
  mainText:{
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    color: "#161622",
    padding: 2,

  },
  btnWrapper:{
    alignItems: "center",     

  },
  btn:{
    width: 327,
    height: 58,
    marginTop: 12,
    marginBottom: 70,
    borderRadius: 8,
    alignItems: "center",
    justifyContent:"center"   
  },
  btnText:{
    color: "#161622",
    fontSize: 16,
    fontWeight: 'semibold',

  }
})