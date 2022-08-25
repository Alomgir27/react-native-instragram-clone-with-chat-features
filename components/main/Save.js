import React, { useEffect, useState } from 'react'




import firebase from 'firebase/compat/app';
import { serverTimestamp } from 'firebase/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { Text, View, TextInput, Button, Image } from 'react-native'



export default function Save(props) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const childPath = `posts/images/${firebase.auth().currentUser.uid}/${Date.now()}`;

    useEffect(() => {
        setImage(props.route.params.image);
    } , [props.route.params.image]);
    
    useEffect(() => {
        console.log(image);
    } , [image]);


    const uploadImages = async () => {
        const response = await fetch(props.route.params.image);
        const blob = await response.blob();
        // console.log(blob);
        const task =  firebase.storage().ref().child(childPath).put(blob);

         task.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (error) =>{
            console.log(error);
        }, async () => {
           await task.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                console.log('File available at', downloadURL);
                const post = {
                    caption: caption,
                    image: downloadURL,
                    likesCount: 0,
                    timestamp: serverTimestamp(), 
                }
               await firebase.firestore()
                .collection('posts')
                .doc(firebase.auth().currentUser.uid)
                .collection('userPosts')
                .add(post)
                .then(() => {
                    props.navigation.navigate('Main');
                }).catch(error => {
                    console.log(error);
                })
            });
           
        });

    }

  return (
    <View>
        {image && <Image source={{ uri: image }} style={{ width: 'auto', height: 'auto' }} />}
        <TextInput placeholder='caption' onChangeText={(cap) => setCaption(cap)} />
        <Button title='Save' onPress={() => {
            uploadImages()
            } } />
    </View>
  )
}
