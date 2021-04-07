import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Polyline, animateCamera, getCamera , Marker } from 'react-native-maps';
import NaviDataDisplay from './NaviDataDisplay';
import redArrow from '../assets/red_arrow.png';
import directionData from '../assets/direction-mock2.json';
import { decode } from '@mapbox/polyline'

const STORE_LOCATION = { latitude: 26.286637840478523, longitude: -80.20009302407799 };
const MAP_SETTINGS = {
    zoom: 15,
    pitch: 0
}
const NAVI_SETTINGS ={
    zoom: 20,
    pitch: 60
}

export default function Map () {

    const _map = useRef(null);
    const [ route, setRoute ] =  useState([]);
    const [ navigate, setNavigate ] = useState(false);
    const [ position, setPosition ] = useState(STORE_LOCATION);
    const [ compass, setCompass ] = useState({});
    const [ region, setRegion ] = useState({
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {

        if(navigate){

            const points = decode(directionData.routes[0].overview_polyline.points)
            const coords = points.map(( point ) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })

            setRoute(coords);

            _map.current.animateCamera({
                center: {
                    latitude: position.latitude,
                    longitude: position.longitude
                    },
                pitch: NAVI_SETTINGS.pitch,
                zoom: NAVI_SETTINGS.zoom,
                heading: compass.magHeading
                }, 5000
            );

        } else {

            setRoute([]);

            _map.current.animateCamera({
                center: {
                    latitude: position.latitude,
                    longitude: position.longitude
                    },
                pitch: MAP_SETTINGS.pitch,
                zoom: MAP_SETTINGS.zoom,
                heading: 0
                }, 5000
            );
        }

    }, [navigate])

    useEffect(() => {
        _map.current.animateCamera({
            center: {
                latitude: position.latitude,
                longitude: position.longitude
                },
            pitch: NAVI_SETTINGS.pitch,
            zoom: NAVI_SETTINGS.zoom,
            heading: compass.magHeading
            }, 5000
        );
    }, [position]);
    
    return (
        <View style={styles.container}>
            <Text>LAT: { position.latitude } LNG: { position.longitude}</Text>
            <MapView 
            style={styles.map} 
            initialRegion={region}
            rotateEnabled={true} 
            showsCompass={true} 
            ref={_map}
            >
            {navigate?
                <Marker
                    coordinate={position}
                    image={redArrow}
                    anchor={{x: 0.5, y: 0 }}
                    // zoom/(zoom * 40)
                /> 
            : null}

            {route.length > 0 && <Polyline coordinates={route} strokeWidth={4} strokeColor={"red"}/> }

            </MapView>
            <NaviDataDisplay 
            setPosition={ setPosition } 
            setCompass={ setCompass } 
            setNavigate={ setNavigate }
            navigate={ navigate }/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - 30,
    },
    button: {
        position: "absolute",
        bottom: 40
    }
});