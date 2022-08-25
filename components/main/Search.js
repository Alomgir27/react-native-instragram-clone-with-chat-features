import React , { useState } from 'react'


import firebase from 'firebase/compat'
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput } from 'react-native'

export default function Search({ navigation }) {
    const [users, setUsers] = useState(null)

    const fetchUsers = (search) => {
        firebase.firestore()
        .collection('users')
        .where('name', '>=', search)
        .get()
        .then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            setUsers(users);
        })
    }


  return (
    <View style={styles.container}>
        <TextInput placeholder='Search' onChangeText={(search) => fetchUsers(search)} />
        <FlatList
            numColumns={1}
            horizontal={false}
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity 
                     onPress={() => navigation.navigate('Profile', { uid: item.id })}
                     style={styles.user}
                     >
                        {/* <Image source={{ uri: item.profilePhotoUrl }} style={styles.userImage} /> */}
                        <Text style={styles.userName}>{item.name}</Text>
                    </TouchableOpacity>
                )}}
         />
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userName: {
        marginLeft: 10,
        fontWeight: 'bold',
    }
})