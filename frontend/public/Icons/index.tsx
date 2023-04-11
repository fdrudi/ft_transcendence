import React from 'react';
import Image from "next/image";

import theme from "@/themes/Style";
import Logo42 from './42.svg';
import Google from './Google.svg';

interface IconProps {
  size?: number;
  color?: string;
}

const Icon42: React.FC<IconProps> = ({size, color}) => <Image src={Logo42} style={{ width: size || 'auto', height: size || 'auto'}} color={color || theme.color.dark} alt="logo 42" />;
const GoogleIcon: React.FC<IconProps> = ({size, color}) => <Image src={Google} style={{ width: size || 'auto', height: size || 'auto'}} color={color || theme.color.dark} alt="logo google" />;

export {
  Icon42,
  GoogleIcon
};
