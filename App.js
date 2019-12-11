import React, {Component} from 'react';
import {Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

const options = {
  title: 'Select Photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
  quality: 1,
};

export default class App extends Component {
  state = {
    imageSource: null,
    data: null 
  };

  selectPhoto = () => {
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imageSource: source,
          data: response.data
        });
      }
    });
  };

  uploadPhoto = () => {
    RNFetchBlob.fetch(
      'POST',
      'http://www.example.com/upload-form',
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [
        // custom content type
        {
          name: 'image',
          filename: 'image.png',
          type: 'image/png',
          data: this.state.data,
        },
      ],
    )
      .then(resp => {
        // ...
      })
      .catch(err => {
        // ...
      });
  };

  render() {
   
    return (
      <View style={{alignItems: 'center'}}>
        <ImageBackground
          style={{height: 200, width: 200, marginTop: 30, marginBottom: 20}}
          source={
            this.state.imageSource != null
              ? this.state.imageSource
              : require('./default.png')
          }
        />

        <TouchableOpacity
          style={{
            width: 250,
            height: 50,
            backgroundColor: 'grey',
            marginBottom: 5,
          }}
          onPress={this.selectPhoto.bind(this)}>
          <Text style={{color: 'white', fontSize: 30, textAlign: 'center'}}>
            Select
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{width: 250, height: 50, backgroundColor: 'grey'}}>
          <Text style={{color: 'white', fontSize: 30, textAlign: 'center'}}>
            Upload Now.
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
