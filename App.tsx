// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

//App.tsx code mostly from expo docs, link: https://docs.expo.dev/versions/latest/sdk/camera/
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import { useState } from 'react';
// import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function App() {
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [permission, requestPermission] = useCameraPermissions();

//   if (!permission) {
//     // Camera permissions are still loading.
//     return <View />;
//   }

//   if (!permission.granted) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need your permission to show the camera</Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView style={styles.camera} facing={facing} />
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//           <Text style={styles.text}>Flip Camera</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   message: {
//     textAlign: 'center',
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 64,
//     flexDirection: 'row',
//     backgroundColor: 'transparent',
//     width: '100%',
//     paddingHorizontal: 64,
//   },
//   button: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
// });
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import FindColorScreen from './src/screens/FindColorScreen';
import SavedColorsScreen from './src/screens/SavedColorsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF', // brand-blue placeholder
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="FindColor"
          component={FindColorScreen}
          options={{
            tabBarLabel: 'Find Color',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💧</Text>,
          }}
        />
        <Tab.Screen
          name="SavedColors"
          component={SavedColorsScreen}
          options={{
            tabBarLabel: 'Saved',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔖</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}