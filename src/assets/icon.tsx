import { SvgXml } from 'react-native-svg';
import { ReactElement } from 'react';
import { IconName } from '../constants/interfaces/iconInterface';

import ChevronLeft from './icons/ChevronLeft';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 24, color = '#000' }: IconProps) {
  const icons: Record<IconName, ReactElement> = {
    chevronLeft: <SvgXml xml={ChevronLeft(color)} width={size} height={size} />,
  };

  return icons[name];
}
