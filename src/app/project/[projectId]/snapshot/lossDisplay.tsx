'use client'
import * as React from 'react';
import {useState} from 'react';
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import {crossIcon, IconTextContainer, plusIcon} from "@/components/icons";
import LossChangeChart from "@/app/project/[projectId]/snapshot/lossChangeChart";
import LossChart from "@/app/project/[projectId]/snapshot/lossChart";

type Props = {
  lossArray: number[];
  isGenerating: boolean;
}

const LossDisplay: React.FC<Props> = (
    {lossArray = [], isGenerating= false}
) => {

  isGenerating = true;
  const [toggle, setToggle] = useState<boolean>(isGenerating);

  const calculateIntegral = () => {
    let integral = 0;
    for (let i = 0; i < lossArray.length - 1; i++) {
      integral += (lossArray[i] + lossArray[i + 1]) / 2;
    }
    return integral;
  }

  const getColor = (loss:number) => {
    if (loss > 0.3) return 'pink';
    else if (loss > 0.1) return 'orange';
    else return 'blue';
  }

  const integral = calculateIntegral();
  const normalized = integral / lossArray.length;

  return (
    <>
      <div className={`w-full flex flex-row flex-nowrap justify-between items-end ${toggle?'mb-2 border-lightGray border-b-2 pb-2':'mb-3'}`}>
        <IconTextContainer
        title={`${toggle ? "Hide":"Click to show"} loss`}
        classNames={`cursor-pointer ${toggle ? 'text-gray hover:text-black' : 'text-blue hover:text-lightBlue'}`}
        callback={() => setToggle(!toggle)}>{toggle?crossIcon():plusIcon()}
        </IconTextContainer>
        <div className="w-full text-right">
          <Typography type={TextTypes.LINE} classNames={`block text-${getColor(normalized)}`} styles={[TextStyles.BOLD, TextStyles.SMALL]}>
            Normalized loss by epochs: {normalized.toFixed(3)}
          </Typography>
        </div>
      </div>
      { toggle && (
      <>
        <LossChart lossArray={lossArray} />
        <LossChangeChart lossArray={lossArray} />
      </>
      )}
    </>
  )
};

export default LossDisplay;