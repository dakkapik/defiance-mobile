import React , { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import startSocket from "../utils/startSocket";
import LocationAuthorization from "../utils/LocationAuthorization";
import MapView from "../components/MapView";
import * as Location from "expo-location";
import mockData from "../mock/responce2.json"

export default function Map({ route, navigation }) {

  // const { credentials, settings } = route.params

  const credentials = {
    id: 4545,
    name: "George",
    role: "driver",
    // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDU0NSwicm9sZSI6ImRyaXZlciIsIm5hbWUiOiJHZW9yZ2UiLCJpYXQiOjE2MTgyNDEyNDh9.PAMdiAs8-ZwrH5UrlhRnIczF0mqKkaIqmry0i8hW2ZA",
  };
  
  const settings =  {
    // ENDPOINT: "https://defiance-prod.herokuapp.com/",
    ENDPOINT: "http://69.65.91.236:3001",
    GPS_ACCURACY: 6,
    STORE_LOCATION: {
      latitude: 26.286637840478523,
      longitude: -80.20009302407799,
    },
  };

  const [ LocationAuth, setLocationAuth ] = useState(false);
  const [ position, setPosition ] = useState(settings.STORE_LOCATION);

  const [ directionsPolyline, setDirectionsPolyline ] = useState([]);
  const [ deliveryRoute, setDeliveryRoute ] = useState({})
  const [ mapInstructions, setMapInstructions ] = useState(mockData)

  const [ compass, setCompass ] = useState({});
  const [ navigate, setNavigate ] = useState(false);
  const [ socket, setSocket ] = useState(null);
  const [ closeToMarker, setCloseToMarker ] = useState(false);

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

  const handleFinishDelivery = () => {
    console.log("delivery finished")
  }

  const handleDisconnect = () => {
    setLocationAuth(false)
    setSocket(null)
  }

  const handleShowRoute = (route) =>{
    
  }

  useEffect(() => {
    // if(socket){
    //   socket.on("route", ( route )=>{
    //     console.log("directions received")
    //     setDirections(route)
    //   })
    // }

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
      <MapView 
        position={ position } 
        navigate={ navigate } 
        compass={ compass } 
        mapInstructions={ mapInstructions } 
        setCloseToMarker={ setCloseToMarker }
      />
      <View style={styles.mapUIFrame}>
        <View style={styles.mapTopUI}>
          {mapInstructions ? 
            <TouchableOpacity style={styles.UIButton} onPress={()=>handleShowRoute(mapInstructions)}>
              <Text style={styles.font}>NEW DELIVERY ROUTE</Text>
            </TouchableOpacity>
          : null}
          <TouchableOpacity style={styles.UIButton} onPress={()=> handleDisconnect()}>
              <Text style={styles.font}>disconnect</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mapUIView}/>
        <View style={styles. mapBottomUI}>
          <TouchableOpacity style={styles.UIButton} onPress={()=>setNavigate(!navigate)}>
            <Text style={styles.font}>{navigate ? "STOP NAVIGATION": "START NAVIGATION"}</Text>
          </TouchableOpacity>
          { closeToMarker ? 
          <TouchableOpacity style={styles.UIButton} onPress={handleFinishDelivery}>
            <Text style={styles.font}>FINISH DELIVERY</Text>
          </TouchableOpacity>
          : null }
        </View>
      </View>
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
    // paddingTop:50,
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
  mapUIFrame: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,

    position: "absolute",
    display: "flex",
    flexDirection:"column"
  },
  mapUIView: {
    flex: 6
  },
  mapTopUI:{
    flex: 1,
    // paddingTop:40,
    flexDirection: "row",
  },
  mapBottomUI:{
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black"
  },
  UIButton: {
    flex:1,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "red",
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    color: "white"
  }
});