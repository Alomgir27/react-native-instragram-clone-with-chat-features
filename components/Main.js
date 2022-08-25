import React, { Component } from 'react'
import { Text, View, TextInput, Button } from 'react-native'


import  MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import firebase from 'firebase/compat'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchPosts, fetchFollowing, clearData, fetchUserChats } from '../redux/actions'
import Feed from './main/Feed'
import Search from './main/Search'
import ChatList from './main/chat/ChatList'

const ContainerAdd = () => {
    return <View />
}
const ContainerProfile = () => {
    return <View />
}

const Tab = createMaterialBottomTabNavigator();
export  class Main extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchPosts();
        this.props.fetchFollowing();
        this.props.fetchUserChats();
       
    }
    
    
  render() {
    
    return (
        <Tab.Navigator initialRouteName='Feed' labeled={false}>
            <Tab.Screen name="Feed" component={Feed} navigation={this.props.navigation}
            options={{  tabBarIcon: ({ color }) => (    
                <MaterialCommunityIcons name="home" color={color} size={26} />
            )}} />
             <Tab.Screen name="Search" component={Search} navigation={this.props.navigation}
            options={{  tabBarIcon: ({ color }) => (    
                <MaterialCommunityIcons name="magnify" color={color} size={26} />
            )}} />
             <Tab.Screen name="ContainerAdd" component={ContainerAdd} navigation={this.props.navigation}
             listeners={({ navigation }) => ({   
                tabPress: (e) => {
                    e.preventDefault();
                    navigation.navigate('Add');
                }   
            })}
            options={{  tabBarIcon: ({ color }) => (    
                <MaterialCommunityIcons name="camera" color={color} size={26} />
            )}} />
            <Tab.Screen key={Date.now()} name="chat" component={ChatList} navigation={this.props.navigation} share={false}
                options={{
                    tabBarIcon: ({ color, _size }) => (
                        <MaterialCommunityIcons name="chat" color={color} size={26} />
                    ),
                }} />
             <Tab.Screen name="ContainerProfile" component={ContainerProfile} navigation={this.props.navigation}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Profile', {uid: firebase.auth().currentUser.uid});
                    }
                })}
            options={{  tabBarIcon: ({ color }) => (    
                <MaterialCommunityIcons name="account-circle" color={color} size={26} />
            )}} />
        </Tab.Navigator>
    )
  }
}

const mapStateToProps = (store) => ({ 
    currentUser : store.userState.currentUser,
    posts : store.userState.posts,
    following : store.userState.following,
    chats: store.userState.chats,
 })

const mapDispatchToProps = dispatch => bindActionCreators({ fetchUser, fetchPosts, fetchFollowing, clearData, fetchUserChats }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main);