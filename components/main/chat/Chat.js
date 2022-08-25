import React, { useState , useEffect, useRef, useCallback} from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native'

import { connect } from 'react-redux';
import { fetchUserMessages } from '../../../redux/actions';
import { bindActionCreators } from 'redux';
import { Provider } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';


import { useSelector, useDispatch  } from 'react-redux'


import firebase from 'firebase/compat';
import 'firebase/firestore';

function Chat(props) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [flatList, setFlatList] = useState(null)

    // const selector = useSelector(state => console.log(state));

    useEffect(() => {
        props.fetchUserMessages(props.route.params.chatId);
    } , [props.route.params.chatId]);

    // useEffect(() => {
    //    setMessages(props.messages);
    // } , [props.messages]);

   useEffect(() => {
         const unsubscribe =  firebase.firestore()
            .collection('chats')
            .doc(props.route.params.chatId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot((querySnapshot) => {
                let messages = querySnapshot.docChanges().map(change => {
                    if(change.type === 'added'){
                       setMessages(prevState => [...prevState, {...change.doc.data(), id: change.doc.id}]);
                    }
                })
                setFlatList(flatList => {
                    return {...flatList, scrollToIndex: {index: messages.length - 1, animated: true}}
                } )
            } )
        return () => {
            unsubscribe();
        }
    } , []);
               

    const sendMessage = () => {
        if(text !== '') {
            const textValue = text;
            setText('');
            firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
                lastSeen: firebase.firestore.Timestamp.now()
            })

            firebase.firestore()
            .collection('chats')
            .doc(props.route.params.chatId)
            .collection('messages')
            .add({
                text: textValue,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userId: firebase.auth().currentUser.uid
            })
        }
    }

  return (
    <View style={styles.container} >
        <Provider>
             <FlatList
                    ref={setFlatList}
                    numColumns={1}
                    horizontal={false}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => {
                        return (
                            <View key={item.id} style={styles.message}>
                                {item.userId === firebase.auth().currentUser.uid ? (
                                    <View style={styles.messageContainerRight}>
                                        <Text style={styles.messageText}>{item.text}</Text>
                                        {/* <Text style={styles.messageTime}>{item.timestamp.toDate().toLocaleTimeString()}</Text> */}
                                    </View>
                                ) : (
                                    <View style={styles.messageContainerLeft}>
                                        <Text style={styles.messageText}>{item.text}</Text>
                                        {/* <Text style={styles.messageTime}>{item.timestamp.toDate().toLocaleTimeString()}</Text> */}
                                    </View>
                                )}
                            </View>
                        )
                    } }
                />
            <View 
                style={styles.inputContainer}
                >
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    onChangeText={(text) => setText(text)}
                    value={text}
                />
                <Button title="Send"  onPress={sendMessage}  />
               
            </View>
        </Provider>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: 'auto',
        width: 'auto',
        behavior: 'smooth',
    },
    message: {
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    messageContainerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginLeft: 'auto',
        marginRight: 10,
        backgroundColor: '#00bfff',
        borderRadius: 10,
        padding: 10,
    },
    messageContainerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 10,
        marginRight: 'auto',
        backgroundColor: '#5ca0f2',
        borderRadius: 10,
        padding: 10,
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
    messageTime: {
        fontSize: 10,
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 10,
        
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
    },
    sendButton: {
        width: '20%',
        height: 50,
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5ca0f2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
    },
    sendButtonText: {
        fontSize: 15,
        color: '#fff',
    }

});


const mapStateToProps = (store) => ({
    messages: store.userState.messages,
    users: store.usersState.users,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUserMessages }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);