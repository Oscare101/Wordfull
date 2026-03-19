import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { IconName } from '../../constants/interfaces/iconInterface';
import colors from '../../constants/themes/colors';
import { ThemeType } from '../../constants/themes/themeType';
import Icon from '../../assets/icon';

const width = Dimensions.get('screen').width;

export default function ButtonBlock(props: {
  title: string;
  action: () => void;
  disabled?: boolean;
  styles?: any;
  titleStyles?: any;
  icon?: IconName;
  iconSize?: number;
  theme: ThemeType;
}) {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={[
        styles.button,
        props.styles,
        {
          // opacity: props.disabled ? 0.5 : 1,
          backgroundColor: props.disabled
            ? colors[props.theme].buttonInactive
            : colors[props.theme].buttonActive,
          justifyContent: props.icon ? 'space-between' : 'center',
        },
      ]}
      activeOpacity={0.8}
      onPress={props.action}
    >
      <Text
        style={[
          styles.title,
          props.titleStyles,
          {
            color: props.disabled
              ? colors[props.theme].buttonTitleInactive
              : colors[props.theme].buttonTitleActive,
          },
        ]}
      >
        {props.title}
      </Text>
      {props.icon && (
        <Icon
          name={props.icon}
          size={props.iconSize || 24}
          color={
            props.disabled
              ? colors[props.theme].buttonTitleInactive
              : colors[props.theme].buttonTitleActive
          }
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: width * 0.92,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
});
