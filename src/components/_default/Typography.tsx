import * as React from 'react';

export enum TextTypes {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  BODY = 'p',
  LINE = 'span'
}

export enum TextStyles {
  BOLD = 'bold',
  MEDIUM = 'medium',
  SMALL = 'small'
}

type TypographyProps = {
  children?: React.ReactNode
  classNames?: string
  type: TextTypes,
  styles?: TextStyles[]
}
const Typography: React.FC<TypographyProps> = (
    {
      children,
      classNames = '',
      type = TextTypes.H1,
      styles = []
    }
) => {
  let classString = "";
  switch (type){
    case TextTypes.H1:
      classString = "text-h1 md:text-h1-md xl:text-h1-xl font-medium";
      break;
    case TextTypes.H2:
      classString = "text-h2 md:text-h2-md xl:text-h2-xl font-bold";
      break;
    case TextTypes.H3:
      classString = "text-h3 md:text-h3-md xl:text-h3-xl font-medium";
      break;
    case TextTypes.BODY:
    case TextTypes.LINE:
      if(styles.includes(TextStyles.SMALL)){
        classString = "text-body-small md:text-body-small-md xl:text-body-small-xl";

        if(styles.includes(TextStyles.BOLD)){
          classString += " font-bold";
        }else if(styles.includes(TextStyles.MEDIUM)){
          classString += " font-medium";
        }else {
          classString += " !font-normal";
        }
      }else{
        classString = "text-body md:text-body-md xl:text-body-xl";

        if(styles.includes(TextStyles.BOLD)){
          classString += " font-bold";
        }else if(styles.includes(TextStyles.MEDIUM)){
          classString += " font-medium";
        }
      }
      break;
  }
  return React.createElement(type, { className: `${classString} ${classNames}` }, children);
}

export default Typography;