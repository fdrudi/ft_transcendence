import React from 'react';
import Image from "next/image";

import theme from "@/themes/Style";
import Logo42 from './42.svg';
import Google from './Google.svg';

interface IconProps {
  size?: number;
  color?: string;
}

const Icon42: React.FC<IconProps> = ({size, color}) => <Image src={Logo42} height={size || 30} width={size || 30} color={color || theme.color.dark} alt="logo 42" />;
const GoogleIcon: React.FC<IconProps> = ({size, color}) => <Image src={Google} height={size || 30} width={size || 30} color={color || theme.color.dark} alt="logo google" />;

export {
  Icon42,
  GoogleIcon
};
