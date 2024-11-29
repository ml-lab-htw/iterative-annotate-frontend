import React from "react";
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";

export const loadingIcon = () => (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"
strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
)

export const failIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"
strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
)

export const nextIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
)

export const backIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 29 26">
<path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="1.5" d="M28 13H3"/>
<path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="1.5"
d="M12 24 1 13 12 2"/>
    </svg>
)

export const plusIcon = () => (
    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="6.66666" width="2.66667" height="16"/>
    <rect x="16" y="6.66675" width="2.66667" height="16" transform="rotate(90 16 6.66675)"/>
    </svg>
)

export const checkIcon = () => (
    <svg viewBox="0 0 16 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.666992" y="5.34497" width="2.66667" height="8" transform="rotate(-45 0.666992 5.34497)"
    fill="currentColor"/>
    <rect x="13.334" y="0.220276" width="2.66667" height="12.5807" transform="rotate(45 13.334 0.220276)"
    fill="currentColor"/>
    </svg>
)

export const editIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"
         strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
        <polyline points="4 7 4 4 20 4 20 7"></polyline>
        <line x1="9" y1="20" x2="15" y2="20"></line>
        <line x1="12" y1="4" x2="12" y2="20"></line>
    </svg>
)

export const crossIcon = () => (
    <svg viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.333008" y="2.33325" width="2.66667" height="16" transform="rotate(-45 0.333008 2.33325)"
              fill="currentColor"/>
        <rect x="11.666" y="0.333252" width="2.66667" height="16" transform="rotate(45 11.666 0.333252)"
    fill="currentColor"/>
    </svg>

)

type IconProps = {
  big?: boolean,
  children: React.ReactNode,
  classNames?: string
}

export const IconContainer: React.FC<IconProps> = ({
                                                     big = false,
                                                     children,
                                                     classNames = ''}) => {

  return <span className={`${big ? 'w-6 h-6' : 'w-3 h-3'} flex justify-center items-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:block text-inherit ${classNames}`}>{children}</span>
}


type IconTextProps = {
  title: string,
  children: React.ReactNode,
  classNames?: string,
  callback?: () => void,
  bigText?: boolean
}

export const IconTextContainer: React.FC<IconTextProps> = ({
    title, children, classNames='', callback, bigText = false
}) => {
  const textStyle = bigText ? [TextStyles.MEDIUM] : [TextStyles.MEDIUM, TextStyles.SMALL]

    const stepFunction = (ev: React.MouseEvent) =>{
      ev.stopPropagation();
      ev.preventDefault();
      if(!callback) return;
      callback();
    }
    const clickCallback = (callback ? {onClick: stepFunction} : {});

  return (
      <div
          className={`flex flex-row flex-nowrap items-center justify-start w-auto gap-x-1 ${callback?'cursor-pointer':''} ${classNames}`}
          {...clickCallback}>
        <IconContainer big={bigText}>{children}</IconContainer>
        <Typography type={TextTypes.LINE} styles={textStyle}
                    classNames={'block w-full whitespace-nowrap'}>{title}</Typography>
      </div>
  )
}