// components/CustomToast.js
import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const toastConfig = {
  centerToast: ({ text1, text2 }) => {
    const translateX = useRef(new Animated.Value(width)).current; 

    useEffect(() => {
      Animated.spring(translateX, {
        toValue: 0, 
        useNativeDriver: true,
        bounciness: 8,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          transform: [{ translateX }],
          height: 120,
          width: '80%',
          backgroundColor: '#0051ffff',
          borderRadius: 15,
          padding: 15,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          elevation: 5,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {text1}
        </Text>
        {text2 ? (
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              textAlign: 'center',
              marginTop: 5,
            }}
          >
            {text2}
          </Text>
        ) : null}
      </Animated.View>
    );
  },
};
