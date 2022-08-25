import firebase from "firebase/compat";

import { USER_STATE_CHANGE } from "../constants";
import { USER_POST_STATE_CHANGE } from "../constants";
import { USER_FOLLOWING_STATE_CHANGE } from "../constants";
import { USERS_POST_STATE_CHANGE } from "../constants";
import { USERS_DATA_STATE_CHANGE } from "../constants";
import { USERS_LIKES_STATE_CHANGE } from "../constants";
import { USER_CHATS_STATE_CHANGE } from "../constants";
import { USER_MESSAGES_STATE_CHANGE } from "../constants";
import { CLEAR_DATA } from "../constants";




export function clearData() {
    return ((dispatch) => {
        dispatch({ type: CLEAR_DATA });
    })
}

export  function fetchUser(){
    return ((dispatch) => {
        const unsubscribe =  firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            if(snapshot.exists){
                dispatch({
                    type: USER_STATE_CHANGE,
                    currentUser: snapshot.data()
                })
            }
            else {
                console.log('user not found');
            }
        })
    })
}

export function fetchPosts(){
    return ((dispatch) => {
        const unsubscribe =  firebase.firestore().collection('posts')
        .doc(firebase.auth().currentUser.uid)
        .collection('userPosts')
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            });
            dispatch({
                type: USER_POST_STATE_CHANGE,
                posts: posts
            })
            console.log(posts);
        })
    })
}
export function fetchFollowing(){
    return ((dispatch) => {
        const unsubscribe =  firebase.firestore().collection('following')
        .doc(firebase.auth().currentUser.uid)
        .collection('userFollowing')
        .onSnapshot((snapshot) => {
            let following = snapshot.docs.map(doc => {
                return doc.id
            });
            dispatch({
                type: USER_FOLLOWING_STATE_CHANGE,
                following: following
            })
            console.log(following);
            for(let i = 0; i < following.length; i++){
                dispatch(fetchUsersData(following[i], true));
            }
        })
    })
}


export function fetchUsersData(uid, getPosts){
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(user => user.uid === uid);
        if(!found){
            const unsubscribe =  firebase.firestore()
            .collection('users')
            .doc(uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    let user = snapshot.data();
                    user.uid = snapshot.id;
                    dispatch({
                        type: USERS_DATA_STATE_CHANGE,
                        user: user
                    })
                }
            })
            if(getPosts){
              dispatch(fetchUsersFollowingPosts(uid));
            }
        }
    })
}
export function fetchUsersFollowingPosts(uid){
    return ((dispatch, getState) => {
        const unsubscribe = firebase.firestore().collection('posts')
        .doc(uid)
        .collection('userPosts')
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
            const user = getState().usersState.users.find(user => user.uid === uid);

            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data, user }
            })
            for(let i = 0; i < posts.length; i++){
                dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
            }
            dispatch({
                type: USERS_POST_STATE_CHANGE,
                posts: posts,
                uid: uid
            })
            // console.log(getState());

        })
    })
}


export function fetchUsersFollowingLikes(uid, postId){
        return ((dispatch, getState) => {
            const unsubscribe =  firebase.firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postId)
            .collection('likes')
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                const postId = snapshot.ref.path.split('/')[3];
                if(snapshot.exists){
                    dispatch({
                        type: USERS_LIKES_STATE_CHANGE,
                        postId: postId,
                        like: true
                    })
                }
                else {
                    dispatch({
                        type: USERS_LIKES_STATE_CHANGE,
                        postId: postId,
                        like: false
                    })
                }
            })
        //   console.log(getState());
        })
             
}

export function fetchUserChats(){
    return ((dispatch) => {
        const unsubscribe =  firebase.firestore()
        .collection('chats')
        .where('users', 'array-contains', firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            let chats = snapshot.docs.map(doc => {
                let data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            dispatch({
                type: USER_CHATS_STATE_CHANGE,
                chats: chats
            })
        })
    })

}

export function fetchUserMessages(chatId){
     return ((dispatch) => {
         firebase.firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
            let messages = snapshot.docs.map(doc => {
                let data = doc.data();
                const id = doc.id;
                return { id, ...data }
            }).reverse()
            dispatch({
                type: USER_MESSAGES_STATE_CHANGE,
                messages: messages,
            })
        })
     })

}