import React , { useState, useEffect }from "react";
import {TouchableOpacity, Text} from "react-native";
import * as Location from "expo-location";

const GPS_ACCURACY = 6;

export default function StartNavigation(props) {
    
    const [ locationListener, setlocationListener ] = useState();
    const [ compassListener, setCompassListener ] = useState();

    useEffect(() => {

        if(props.navigate){
            startNavigation();
            startCompass();
        }else{
            execCleanUp(1);
        }

        return ()=>{
            execCleanUp(2);
        }

    }, [props.navigate]);

    const handleButton = () => {
        props.setNavigate(!props.navigate)
    }
    
    return (
        <TouchableOpacity style={{position:"absolute", bottom: 40}} onPress={handleButton}>
            <Text>{props.navigate ? "STOP NAVIGATION" : "START NAVIGATION"}</Text>
        </TouchableOpacity>
    )

    function formatData(data) {
        props.setPosition({latitude: data.coords.latitude, longitude: data.coords.longitude})
    }

    async function startNavigation() {
        const cleanUp = await Location.watchPositionAsync({
            accuracy: GPS_ACCURACY
        }, formatData);

        setlocationListener(cleanUp)
    };

    async function startCompass() {
        const cleanUp = await Location.watchHeadingAsync(compass => props.setCompass(compass))
        setCompassListener(cleanUp)
    }

    function execCleanUp(number) {
        if(locationListener){
            console.log(`cleanUp exec ${number}...`)
            locationListener.remove();
            compassListener.remove();
            setlocationListener();
        }
    };
};