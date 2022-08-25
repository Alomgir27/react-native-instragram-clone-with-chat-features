import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Image, FlatList, Button } from 'react-native'

import { connect } from 'react-redux';

import firebase from 'firebase/compat';
import 'firebase/firestore';

function Feed(props) {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if(props.usersFollowingLoaded == props.following.length && props.following.length > 0) {
            props.feed.sort(function(x, y) {
                return  y.timestamp - x.timestamp;
            })
            setPosts(props.feed);
        }

    }, [props.usersFollowingLoaded, props.feed]);

    const onLike = (uid, postId) => {
        firebase.firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .collection('likes')
        .doc(firebase.auth().currentUser.uid)
        .set({})
        firebase.firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .update({
            likesCount: firebase.firestore.FieldValue.increment(1)
        })
    }
    const onUnlike = (uid, postId) => {
        firebase.firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .collection('likes')
        .doc(firebase.auth().currentUser.uid)
        .delete()
        firebase.firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .update({
            likesCount: firebase.firestore.FieldValue.increment(-1)
        })
    }


  return (
    <View  style={style.container}>
        <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={({item}) => (
                <View style={style.containerImage}>
                    <Text>{item.user.name}</Text>
                    <Image
                        style={style.image}
                        source={{uri: item.image}}
                    />
                    {item.like ? (
                        <Button title='Unlike' onPress={() => onUnlike(item.user.uid, item.id)} />
                    ) : (
                        <Button title='like' onPress={() => onLike(item.user.uid, item.id)} />
                    )}
                    <Text
                        onPress={() => props.navigation.navigate('Comment', {postId: item.id, uid: item.user.uid})}
                    >View Comments...</Text>
                </View>
            )}
            />
    </View>
  )
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    infoContainer: {
        margin: 20,
    },
    image: {
        flex: 1,
        aspectRatio: 1/1,
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed);