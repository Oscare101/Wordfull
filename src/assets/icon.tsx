import { SvgXml } from 'react-native-svg';
import { ReactElement } from 'react';
import { IconName } from '../constants/interfaces/iconInterface';

import ChevronLeft from './icons/ChevronLeft';
import ChevronRight from './icons/ChevronRight';
import List from './icons/List';
import Close from './icons/Close';
import ArrowRight from './icons/ArrowRight';
import ArrowLeft from './icons/ArrowLeft';
import Person from './icons/Person';
import Palette from './icons/Palette';
import Language from './icons/Language';
import Play from './icons/Play';
import Open from './icons/Open';
import Fire from './icons/Fire';
import Check from './icons/Check';
import Settings from './icons/Settings';
import SpeedLow from './icons/SpeedLow';
import SpeedHigh from './icons/SpeedHigh';
import Stats from './icons/Stats';
import Info from './icons/Info';
import InfinityIcon from './icons/Infinity';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 24, color = '#000' }: IconProps) {
  const icons: Record<IconName, ReactElement> = {
    chevronLeft: <SvgXml xml={ChevronLeft(color)} width={size} height={size} />,
    chevronRight: (
      <SvgXml xml={ChevronRight(color)} width={size} height={size} />
    ),
    arrowLeft: <SvgXml xml={ArrowLeft(color)} width={size} height={size} />,
    arrowRight: <SvgXml xml={ArrowRight(color)} width={size} height={size} />,
    close: <SvgXml xml={Close(color)} width={size} height={size} />,
    list: <SvgXml xml={List(color)} width={size} height={size} />,
    person: <SvgXml xml={Person(color)} width={size} height={size} />,
    palette: <SvgXml xml={Palette(color)} width={size} height={size} />,
    language: <SvgXml xml={Language(color)} width={size} height={size} />,
    play: <SvgXml xml={Play(color)} width={size} height={size} />,
    open: <SvgXml xml={Open(color)} width={size} height={size} />,
    fire: <SvgXml xml={Fire(color)} width={size} height={size} />,
    check: <SvgXml xml={Check(color)} width={size} height={size} />,
    settings: <SvgXml xml={Settings(color)} width={size} height={size} />,
    speedLow: <SvgXml xml={SpeedLow(color)} width={size} height={size} />,
    speedHigh: <SvgXml xml={SpeedHigh(color)} width={size} height={size} />,
    stats: <SvgXml xml={Stats(color)} width={size} height={size} />,
    info: <SvgXml xml={Info(color)} width={size} height={size} />,
    infinity: <SvgXml xml={InfinityIcon(color)} width={size} height={size} />,
  };

  return icons[name];
}
