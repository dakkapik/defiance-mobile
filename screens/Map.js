import React , { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LocationAuthorization from "../utils/LocationAuthorization";
import MapView from "../components/MapView";

export default function Map({ route, navigation}) {

  const { credentials } = route.params

  const [ authorization, setAuthorization ] = useState(false);

  const handleAuthorization = () => {
    LocationAuthorization()
    .then(authorized => setAuthorization(authorized))
    .catch((err) => console.log("can't start without location permissions, activate manually", err))
  }

  return (
    <View style={styles.container}>
      {
        authorization ? 
        <MapView/>
        :
        <TouchableOpacity style={styles.button} onPress={handleAuthorization}>
          <Text>START APP</Text>
        </TouchableOpacity>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    position: "absolute",
    bottom: 60
  },
  button2:{
    width: 100,
    height: 3
  }
});
