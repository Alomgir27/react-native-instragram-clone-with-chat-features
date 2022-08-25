import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { fetchUsersData } from '../../../redux/actions';

import firebase from 'firebase/compat';

function ChatList(props) {
    const [chats, setChats] = useState([]);
    useEffect(() => {
            setChats(props.chats);
            // console.log(props.chats);

    } , [props.chats]);

    const opponentUser = (users) => {
        return users.filter(user => user !== firebase.auth().currentUser.uid)[0];
    }
    const UserName = (users) => {
        const uid = opponentUser(users);
        fetchUsersData(uid, false);
        const user = props.users.filter(user => user.uid === uid)[0];
        return user?.name;
    }

  return (
    <View style={{flex : 1,}}>
        <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => {
                return (
                    <TouchableOpacity onPress={() => props.navigation.navigate('Chat', {chatId: item.id})}>
                        <View style={style.container}>
                            <Text>{UserName(item.users)}</Text>
                        </View>
                    </TouchableOpacity>
                )
            } }
        />
                            
        
    </View>
  )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    userContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    post: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
})

const mapStateToProps = (store) => ({
    chats : store.userState.chats,
    currentUser : store.userState.currentUser,
    users: store.usersState.users,

})
export default connect(mapStateToProps, null)(ChatList)
