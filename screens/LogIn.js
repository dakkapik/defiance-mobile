import React , { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import getCredentials from '../utils/getCredentials'

const settings = {
  STORE_LOCATION : { latitude: 26.286637840478523, longitude: -80.20009302407799 },
  GPS_ACCURACY : 6,
  ENDPOINT : "http://69.65.91.236:3001"
}

export default function LogIn( {navigation} ) {

  const [ employeeId, setEmployeeId ] = useState('')

  const handleLogIn = () => {
    if(employeeId){
      getCredentials(employeeId, settings.ENDPOINT)
      .then(credentials => navigation.navigate("Map", {credentials, settings}))
      .catch(err => console.log("getCredentials:", err))
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.inputBox}>
        <TextInput 
        style={styles.textInput}
        keyboardType="number-pad"
        secureTextEntry={true}
        onChangeText={text=>setEmployeeId(text)}
        />
        <TouchableOpacity onPress={handleLogIn}>
          <Text style={styles.logInText}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 3,
    paddingTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox:{
    flex:0.25,
    marginHorizontal:40,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: 'center',
    justifyContent: 'center',
  },  
  textInput: {
    flex:3,
    backgroundColor:"black",
    fontSize:80,
    color:"white",
    
  },
  logInButton:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logInText: {
    fontSize:20,
    paddingHorizontal: 3,
  }

});
