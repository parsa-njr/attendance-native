import { View, Text } from 'react-native'
import React from 'react'

const Container = ({children,className=""}) => {
  return (
    <View style={{paddingHorizontal:32, paddingTop:4}} className={`bg-white rounded-t-3xl relative ${className}`}>
      {children}
    </View>
  )
}

export default Container