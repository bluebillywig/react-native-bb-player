import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const BlueBillywigLogo = ({ height = 40 }: { height?: number }) => {
  return (
    <View style={styles.logoContainer}>
      <Text style={[styles.logoText, { fontSize: height * 0.6 }]}>
        <Text style={styles.logoAccent}>Blue Billywig</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    color: '#002837',
    letterSpacing: -0.5,
  },
  logoAccent: {
    color: '#649BD2',
  },
});
