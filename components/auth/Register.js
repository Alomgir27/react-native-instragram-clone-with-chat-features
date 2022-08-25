import React, { Component } from 'react'
import { Text, View, TextInput, Button } from 'react-native'



import firebase from 'firebase/compat';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email : '',
            password : '',
            name: ''
        }
        this.onSignUp = this.onSignUp.bind(this);
    }
    onSignUp = () => {
        // console.log(this.state);
        const { email, password, name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((res) => {
          firebase.firestore().collection('users').doc(res.user.uid).set({
            name,
            email,
            lastSeen: firebase.firestore.Timestamp.fromDate(new Date())
          })
          .then((response) => { 
            console.log(response);
          }).catch((err) => {
            console.log(err);
          })
          console.log(res); // user object
        })
        .catch((err) => {
          console.log(err); // error object
        })
    }
  render() {
    return (
      <View>
        <TextInput placeholder='name' onChangeText={(name) => this.setState({name})} />
        <TextInput placeholder='email' onChangeText={(email) => this.setState({email})} />
        <TextInput placeholder='password' secureTextEntry={true} onChangeText={(password) => this.setState({password})} />
        <Button title='Sign up' onPress={this.onSignUp} />
      </View>
    )
  }
}
