import React from 'react';
import { Text, TextProps } from 'react-native';

const CustomText: React.FC<TextProps> & { fontFamily: string } = (props) => {
  return <Text {...props} style={[props.style, { fontFamily: CustomText.fontFamily }]} />;
};

CustomText.fontFamily = 'CustomFont';

export default CustomText;
