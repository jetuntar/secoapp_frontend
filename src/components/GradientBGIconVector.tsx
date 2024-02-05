import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SPACING } from '../theme/theme';
import Icon from 'react-native-vector-icons/SimpleLineIcons'; // Import the desired icon library

interface GradientBGIconVectorProps {
  onPress: () => void;
  nameVector: string; // Prop for vector icon name
  colorVector: string; // Prop for vector icon color
  sizeVector: number; // Prop for vector icon size
}

const GradientBGIconVector: React.FC<GradientBGIconVectorProps> = ({
  onPress,
  nameVector,
  colorVector,
  sizeVector,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.Container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
        style={styles.LinearGradientBG}>
        <Icon name={nameVector} color={colorVector} size={sizeVector} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderWidth: 2,
    borderColor: COLORS.secondaryDarkGreyHex,
    borderRadius: SPACING.space_12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryDarkGreyHex,
    overflow: 'hidden',
  },
  LinearGradientBG: {
    height: SPACING.space_36,
    width: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GradientBGIconVector;
