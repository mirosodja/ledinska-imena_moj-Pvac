import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { StatusBar } from 'expo-status-bar';
import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace';
import PlaceDetails from './screens/PlaceDetails';
import IconButton from './components/UI/IconButton';
import { Colors } from './constants/colors';
import Map from './screens/Map';
import { init } from './util/database';
import Info from './screens/Info';

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  const [fontsLoaded] = useFonts({
    'OpenSBB': require('./assets/fonts/OpenSans-BoldB.ttf'),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        init();
      } catch (e) {
        console.warn(e);
      } finally {
        setDbInitialized(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(

    // add fontsLoaded to the dependency array
    async () => {
      if (dbInitialized) {
        await SplashScreen.hideAsync();
      }
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    },
    [dbInitialized, fontsLoaded]
  );

  if (!dbInitialized) return null;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer onReady={onLayoutRootView}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: Colors.primary500 },
              headerTintColor: Colors.gray700,
              contentStyle: { backgroundColor: Colors.gray700 }
            }}
          >
            <Stack.Screen
              name="AllPlaces"
              component={AllPlaces}
              options={({ navigation }) => ({
                title: `Moj Pvác`,
                headerRight: ({ tintColor }) => (
                  <>
                    <IconButton
                      icon="add"
                      size={28}
                      color={tintColor}
                      onPress={() => navigation.navigate('AddPlace')}
                    />
                    <IconButton
                      icon="information"
                      size={28}
                      color={tintColor}
                      onPress={() => navigation.navigate('Info')}
                    />
                  </>
                ),
              })}
            />
            <Stack.Screen
              name="AddPlace"
              component={AddPlace}
              options={{
                title: 'Dodaj Pvác',
              }}
            />
            <Stack.Screen name="Map"
              component={Map}
              options={{
                title: 'Pvác na zemljevidu'
              }}
            />
            <Stack.Screen name="PlaceDetails"
              component={PlaceDetails}
              options={{
                title: 'Podrobnosti o Pvácu'
              }}
            />
            <Stack.Screen name="Info"
              component={Info}
              options={{ title: 'Info' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}
