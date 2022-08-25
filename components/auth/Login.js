import React, { Component } from 'react'
import { Text, View, TextInput, Button } from 'react-native'



import firebase from 'firebase/compat';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email : '',
            password : '',
        }
        this.onSignIn = this.onSignIn.bind(this);
    }
    onSignIn = () => {
        // console.log(this.state);
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((res) => {

          console.log(res); // user object

        })
        .catch((err) => {
          console.log(err); // error object
        })
    }
  render() {
    return (
      <View>
        <TextInput placeholder='email' onChangeText={(email) => this.setState({email})} />
        <TextInput placeholder='password' secureTextEntry={true} onChangeText={(password) => this.setState({password})} />
        <Button title='Sign In' onPress={this.onSignIn} />
      </View>
    )
  }
}
