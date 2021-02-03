import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import Calculator from "./Calculator";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Calculator />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkslategray',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 30 : 0
  },
});
