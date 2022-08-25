import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, Image, StyleSheet, Button } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


import { fetchUser, fetchPosts } from '../../redux/actions';
import { fetchUserChats } from '../../redux/actions';


import firebase from 'firebase/compat'
import 'firebase/firestore';

export function Profile(props) {
   
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  
  
  useEffect(() => {
    if(props.route.params.uid === firebase.auth().currentUser.uid) {
        setUserPosts(props.posts);
        setUser(props.currentUser);
    }
    else {
        firebase.firestore()
        .collection('users')
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
            if(snapshot.exists) {
                setUser(snapshot.data());
            }
            else {
                console.log('user not found');
            }
        })
        firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            // console.log(posts);
            setUserPosts(posts);
        })
    }
  }, [props.route.params.uid]);

  useEffect(() => {
    const time = firebase.firestore.Timestamp.now();
    if(props.following.includes(props.route.params.uid)) {
        setFollowing(true);
    }
    else {
        setFollowing(false);
    }
  } , [props.following, props.route.params.uid]);


  const onUnfollow = () => {
    firebase.firestore()
    .collection('following')
    .doc(firebase.auth().currentUser.uid)
    .collection('userFollowing')
    .doc(props.route.params.uid)
    .delete()


    firebase.firestore()
    .collection("chats")
    .where("users", "array-contains", props.route.params.uid)
    .get()
    .then((snapshot) => {
        // console.log(snapshot.docs);
        snapshot.docs.map(doc => {
          if(doc.data().users.includes(firebase.auth().currentUser.uid)) {
           
            firebase.firestore()
            .collection('chats')
            .doc(doc.id)
            .collection('messages')
            .get()
            .then((snapshot) => {
                snapshot.docs.map(doc => {
                  doc.ref.delete();
                } )
            } )
            doc.ref.delete();
          }
        })
    })
    
  }
  const onFollow = () => {
    firebase.firestore()
    .collection('following')
    .doc(firebase.auth().currentUser.uid)
    .collection('userFollowing')
    .doc(props.route.params.uid)
    .set({})
    firebase.firestore()
    .collection('following')
    .doc(props.route.params.uid)
    .collection('userFollowing')
    .onSnapshot((snapshot) => {
        const following = snapshot.docs.some(doc => doc.id === firebase.auth().currentUser.uid);
        if(following) {
             firebase.firestore()
            .collection('chats')
            .add({
                users: [firebase.auth().currentUser.uid, props.route.params.uid]
            })
            .then((doc) => {
                firebase.firestore()
                .collection('chats')
                .doc(doc.id)
                .collection('messages')
                .add({
                    text: 'Welcome to the chat',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    user: firebase.auth().currentUser.uid
                })
            })

        }
    })
  }

if(user === null){
    return <View />
}

  return (
    <View style={style.container}>
        <View style={style.header}>
           <View style={style.userContainer}>
             <Text >{user?.name}</Text>
             <Text >{user?.email}</Text>
             {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                  following ? (
                      <Button title='following' onPress={() => onUnfollow()} />
                  ) : (
                      <Button title='Follow' onPress={() => onFollow()} />
                  )
             ) : (
                <Button title="Logout" onPress={() => firebase.auth().signOut()} />
             )}
           </View>
          {userPosts && (
            <FlatList
              numColumns={3}
              horizontal={false}
              data={userPosts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <View style={style.post}>
                    <Image source={{ uri: item.image }} style={style.postImage} />
                  </View>
                )
              } }
            />
          )}
        </View>
    </View>
  )
}


const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  post: {
    flex: 1/3,
    justifyContent: 'center',
    
  },
  postImage: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  header: {
    flex: 1,
    // marginTop: 50,
  },
  userContainer: {
    marginBottom: 20,
  }, 
  text : {
    flex: 1,
    color: '#111',
  }
})


const mapStateToProps = (store) => ({
    currentUser : store.userState.currentUser,
    posts : store.userState.posts,
    following : store.userState.following
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser, fetchPosts, fetchUserChats }, dispatch);

export default connect(mapStateToProps, null)(Profile);

