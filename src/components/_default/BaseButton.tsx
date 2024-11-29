import * as React from 'react';
import Typography, {TextTypes} from "@/components/_default/Typography";
import Link from "next/link";
import {loadingIcon} from "@/components/icons";

export enum ButtonStyle {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  WARNING = 'warning',
  DISABLED = 'disabled'
}

type BtnProps = {
  children?: React.ReactNode;
  classNames?: string;
  type?: ButtonStyle;
  outline?: boolean;
  isLoading?: boolean;
  path?: string;
  callback?: () => void;
}

const BaseButton: React.FC<BtnProps> = (
    {
      children,
      classNames = '',
      type = ButtonStyle.PRIMARY,
      outline = false,
      isLoading = false,
      path,
      callback,
    }
) => {
  const buttonStyle = `group table w-auto h-auto py-3 px-8 rounded-lg text-center`;

  const btnClick = () => {
    if (type == ButtonStyle.DISABLED || isLoading) return;
    if (callback) callback();
  }


  const getBtnColorType = () => {
    if(isLoading) type = ButtonStyle.DISABLED;

    switch(type){
      case ButtonStyle.PRIMARY:
        return 'blue';
      case ButtonStyle.SECONDARY:
        return 'pink';
      case ButtonStyle.WARNING:
        return 'orange';
      case ButtonStyle.DISABLED:
        return 'gray';
    }
  }
  const btnColor = getBtnColorType();


  const firstCapital = (str:string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getAdditionalStyles = () => {
    if(isLoading) type = ButtonStyle.DISABLED;

    const appearance = `${outline ? `border-2 border-light${firstCapital(btnColor)}` : `bg-${btnColor}`}`;
    const hoverAppearance = `${outline ? `hover:border-${btnColor}` : `hover:bg-light${firstCapital(btnColor)}`}`;

    switch(type){
      case ButtonStyle.DISABLED:
        return `${appearance} cursor-not-allowed custom-box-shadow-active scale-[0.98] touch-none`;
      default:
        return `${appearance} ${hoverAppearance} hover:scale-[0.98] cursor-pointer transition-all duration-300 custom-box-shadow hover:custom-box-shadow-active`;
    }
  }

  const btnContent = isLoading ? (
      <div className={'flex flex-nowrap flex-row items-center gap-x-2'}>
        <Typography type={TextTypes.H3} classNames={`${outline?`text-gray`:'text-white'}`}>Loading</Typography>
        <div className={`w-6 h-6 block animate-spin [&>svg]:w-full [&>svg]:block ${outline?`text-gray`:'text-white'}`}>{loadingIcon()}</div>
      </div>
  ) : (
      <Typography type={TextTypes.H3}
                  classNames={`${outline?`text-light${firstCapital(getBtnColorType())} group-hover:text-${getBtnColorType()} transition-all duration-300`:'text-white'}`}>
        {children}
      </Typography>
  );

  return (path && path.length > 0) ? (
      <Link href={path} className={`${buttonStyle} ${getAdditionalStyles()} ${classNames}`}>
        {btnContent}
      </Link>
    ) : (
      <div onClick={btnClick} className={`${buttonStyle} ${getAdditionalStyles()} ${classNames}`}>
        {btnContent}
      </div>
    )
}

export default BaseButton;