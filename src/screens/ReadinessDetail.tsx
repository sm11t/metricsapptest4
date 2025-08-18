import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

export default function ReadinessDetail(){
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.h1}>Readiness</Text>
        <Text style={styles.p}>Detail screen coming next (score trend, driver bars, and history).</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root:{ flex:1, backgroundColor:'#0b0b0b' },
  container:{ padding:16 },
  h1:{ color:'#fff', fontSize:22, fontWeight:'700' },
  p:{ color:'#9ca3af', marginTop:8 },
});
