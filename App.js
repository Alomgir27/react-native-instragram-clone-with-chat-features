import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';


import firebase from 'firebase/compat';
import 'firebase/compat';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}


import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './components/auth/Landing'; 
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import Add from './components/main/Add';
import Save from './components/main/Save';
import Profile from './components/main/Profile';
import Comment from './components/main/Comment';
import Chat from './components/main/chat/Chat';
import ChatList from './components/main/chat/ChatList';

const Stack = createStackNavigator();
export default class App extends Component {
  constructor(props) {  // constructor is a method that is called when the component is created         
    super(props);
    this.state = {
      loaded : false,
      loggedIn : false,
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if(!user) {
        this.setState({
          loaded : true,
          loggedIn : false,
        })
      } else {
        this.setState({
          loaded : true,
          loggedIn : true,
        })
      }
    })
  }
  render(){
    const { loaded, loggedIn } = this.state;
    if(!loaded) {
      return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    }
   if(!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Landing" component={Landing}  />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
   }
   return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen key={Date.now()} name="Main" component={Main} navigation={this.props.navigation}/>
            <Stack.Screen key={Date.now()} name="Profile" component={Profile} navigation={this.props.navigation}/>
            <Stack.Screen key={Date.now()} name="Add" component={Add} navigation={this.props.navigation}/>
            <Stack.Screen key={Date.now()} name="Chat" component={Chat} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="ChatList" component={ChatList} navigation={this.props.navigation} />
            <Stack.Screen key={Date.now()} name="Save" component={Save} navigation={this.props.navigation}/>
            <Stack.Screen key={Date.now()} name="Comment" component={Comment} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );  
  }
}