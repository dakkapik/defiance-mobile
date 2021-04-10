import React , { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import startSocket from "../utils/startSocket";
import LocationAuthorization from "../utils/LocationAuthorization";
import MapView from "../components/MapView";
import * as Location from "expo-location";

export default function Map({ route, navigation }) {

  const { credentials, settings } = route.params

  const [ LocationAuth, setLocationAuth ] = useState(false);
  const [ position, setPosition ] = useState(settings.STORE_LOCATION);
  const [ directions, setDirections ] = useState([]);
  const [ compass, setCompass ] = useState({});
  const [ navigate, setNavigate ] = useState(false);
  const [ socket, setSocket ] = useState(null)

  const handleLocationAuthorization = () => {
    LocationAuthorization()
    .then(authorized => {
      startSocket(credentials, settings.ENDPOINT)
      .then(socket => {
        console.log("logged in socket as: ", credentials.name)
        setSocket(socket)
      })
      .catch(err => console.log("startSocket ERROR:", err))
      setLocationAuth(authorized)
    })
    .catch((err) => console.log("can't start without location permissions, activate manually", err))
  }

  useEffect(() => {
    if(socket){
      socket.on("route", (route)=>{
        setDirections(route)
      })
    }

    return () => {
      if(socket){
        socket.disconnect()
        setSocket(null)
      }
    }
  }, [socket])

  useEffect(() => {

    let naviListener;
    let compassListener;

    if(LocationAuth && navigate){
      Location.watchPositionAsync({
        accuracy: settings.GPS_ACCURACY
      }, formatData)
      .then(listener => naviListener = listener)
      .catch(err => console.log("location listener error: ",err))

      Location.watchHeadingAsync(compass => setCompass(compass))
      .then(listener => compassListener = listener)
      .catch(err => console.log("compass listener error: ",err))
    }

    return () => {
      if(naviListener){
        naviListener.remove()
      }
      if(compassListener){ 
        compassListener.remove()
      }
    }

  }, [navigate]);

  useEffect(() => {

    if(socket){
      socket.emit("position", {position,  userId: 4545, storeId: "psq2"});
    }

  }, [position])

  return (
    LocationAuth ?
    <View style={styles.fullScreen}>
      <Text>LAT: { position.latitude } LNG: { position.longitude}</Text>  
      <MapView position={ position } navigate={ navigate } compass={ compass } directions={ directions }
      />
      <TouchableOpacity style={styles.startNavigationButton} onPress={()=>setNavigate(!navigate)}>
        <Text style={styles.font}>{navigate ? "STOP NAVIGATION": "START NAVIGATION"}</Text>
      </TouchableOpacity>
    </View>
    :
    <View style={styles.fullScreen}>
      <TouchableOpacity style={styles.startAppButton} onPress={handleLocationAuthorization}>
        <Text style={styles.font}>START APP</Text>
      </TouchableOpacity>
    </View>
  );

  //LEAVE THIS HERE, AS WE NEED MORE DATA TO BE SENT TO THE SERVER THIS WILL GROW
  function formatData(data) {
    setPosition({latitude: data.coords.latitude, longitude: data.coords.longitude})
  }
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    paddingTop:50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startAppButton:{
    flex: 0.2,
    width: 100,
    backgroundColor: "red",
    alignItems: 'center',
    justifyContent: 'center',
  },
  startNavigationButton: {
    position:"absolute",
    bottom: 60,
    width: 100,
    height: 100,
    backgroundColor: "red",
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    color: "white"
  }
});
