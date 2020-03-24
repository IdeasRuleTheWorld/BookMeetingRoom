
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Alert
} from 'react-native';
import { RNCamera } from 'react-native-camera';


export default class qrscanner extends Component {
	onBarCodeRead = e => {
    const url = e.data
		this.props.navigation.navigate("confirm", { url: url })
  };
  
  render() {
      return(
          <View style={styles.container}>
              <RNCamera
                  ref={ref => {
                      this.camera = ref;
                  }}
                  style={{ flex: 1, alignItems: 'center' }}
                  flashMode={RNCamera.Constants.FlashMode.on}
                  onBarCodeRead={this.onBarCodeRead}
                  captureAudio={false}
                  androidCameraPermissionOptions={{
                      title: 'Permission to use camera',
                      message: 'We need your permission to use your camera',
                      buttonPositive: 'Ok',
                      buttonNegative: 'Cancel',
                  }}>
              </RNCamera>
          </View>

      )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black'
    }
  })