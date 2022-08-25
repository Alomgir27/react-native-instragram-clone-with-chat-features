import React, { useState, useEffect } from 'react'

import { Text, View, StyleSheet, Image, FlatList, Button, TextInput } from 'react-native'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsersData } from '../../redux/actions';

import firebase from 'firebase/compat';
import 'firebase/firestore';


function Comment(props) {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
      if(props.route.params.postId !== postId){
        firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
          let comments = snapshot?.docs?.map(doc => {
            let id = doc.id;
            let comment = doc.data();
            return {id, ...comment};
          })
          matchUserToComment(comments);
        })
        setPostId(props.route.params.postId);
      }
      else {
        matchUserToComment(comments);
      }
    }, [props.route.params.postId, props.users]);

    const matchUserToComment = (comments) => {
      for(let i = 0; i < comments.length; i++) {
        if(comments[i].hasOwnProperty('user')) {
          continue;
        }
        const user = props.users.find(x => x.uid === comments[i].creator);
        if(user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }
    
    const onCommentsAdd = () => {
      firebase.firestore()
      .collection('posts')
      .doc(props.route.params.uid)
      .collection('userPosts')
      .doc(props.route.params.postId)
      .collection('comments')
      .add({
        creator: firebase.auth().currentUser.uid,
        text: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setText('');
      }).catch((error) => {
        console.log(error);
      }).then(() => {
        firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
          console.log(snapshot);
          let comments = snapshot?.docs?.map((doc) => {
            let id = doc.id;
            let comment = doc.data();
            return {id, ...comment};
          }).sort(function(x, y) {
            return  y.timestamp - x.timestamp;
          })
          matchUserToComment(comments);
        })
      })
    }

  return (
    <View>
       <FlatList
       numColumns={1}
       horizontal={false}
       data={comments}
       renderItem={({item}) => (
         <View> 
            {item.user !== undefined ? (
              <View style={styles.commentContainer}>
                <Text style={styles.name}>{item.user.name}</Text>
                <Text style={styles.comment}>{item.text}</Text>
              </View>
            ) : null}
         </View>
       )}
       />
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          onChangeText={(text) => setText(text)}
          value={text}
        />
        <Button
          title="Send..."
          onPress={() => onCommentsAdd()}
        />

    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  commentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  comment: {
    fontSize: 16,
  },
});


const mapStateToProps = (store) => ({
  users : store.usersState.users,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Comment);