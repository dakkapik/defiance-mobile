import * as Location from "expo-location";

export default function LocationAuthorization () {
    return new Promise(( resolve, reject )=>{
        Location.requestPermissionsAsync()
        .then((responce)=>{
            if(responce.status === "granted"){
                resolve(true)
            }else{
                reject(false)
            }
        })
    })
}