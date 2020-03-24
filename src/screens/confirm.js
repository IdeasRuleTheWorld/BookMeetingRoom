import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

export default class confirm extends Component {
  render() {
    const url = this.props.route.params.url
    return <WebView source={{ uri: url }} />;
  }
}