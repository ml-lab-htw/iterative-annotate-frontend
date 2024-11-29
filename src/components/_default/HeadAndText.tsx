import * as React from 'react';
import Typography, {TextTypes} from "@/components/_default/Typography";

type Props = {
  classNames?: string,
  headline: string,
  text: string
}
const HeadAndText: React.FC<Props> = (
    {headline, text, classNames = ''}
) => {
  return (
      <div className={`max-w-xl ${classNames}`}>
        <Typography type={TextTypes.H2}>{headline}</Typography>
        <Typography type={TextTypes.BODY} classNames={"pt-2 pb-8 pre-wrap text-pre"}>{text}</Typography>
      </div>
  )
}

export default HeadAndText;