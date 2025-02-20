import React from 'react';
import { SplashScreen, Stack,} from 'expo-router';


  export default function RootLayout(){
    return (
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home', headerShown: false,}} />
          <Stack.Screen name="main" options={{ title: 'Main', headerShown: false,}} />
          <Stack.Screen name="editRecipe" options={{ title: 'Editing Recipe', headerShown: false,}} />
        </Stack>
    );
  };
