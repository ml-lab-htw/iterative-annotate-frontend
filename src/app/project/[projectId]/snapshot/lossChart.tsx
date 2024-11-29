import * as React from 'react';
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";

type Props = {
  lossArray: number[]
}
const LossChart: React.FC<Props> = (
    {lossArray}
) => {

  const maxLoss = Math.max(...lossArray);

  const calculateCumulativeLoss = () => {
    return lossArray.reduce<number[]>((acc, loss, index) => {
      if (index === 0) {
        // Start the accumulation with the first element
        return [loss];
      } else {
        // Push the sum of the current loss and the last accumulated value
        acc.push(acc[index - 1] + loss);
        return acc;
      }
    }, []); // The initial value is an empty array of numbers
  }


  const getColor = (loss:number) => {
    const ratio = loss / maxLoss;
    if (ratio > 0.6) return 'pink';
    else if (ratio > 0.3) return 'orange';
    else return 'blue';
  };

  const getModulo = () => {
    if(lossArray.length > 250) return 50;
    if(lossArray.length > 100) return  25;
    if(lossArray.length > 50) return 10;
    if(lossArray.length > 5) return 5;
    return 1;
  }

  const firstCapital = (str:string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const cumulativeLosses = calculateCumulativeLoss();


  return (
    <>
      <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>
        Loss and cumulative losses (y-axis) per epoch (x-axis)
      </Typography>
      <div className={`flex flex-row flex-nowrap ${lossArray.length > 100 ? 'gap-x-[1px]' : 'gap-x-1'} items-end justify-between h-72 pt-2 pb-6`}>
      {
        lossArray.map((elm, ind) => {

          const height = Math.floor((elm / maxLoss) * 100);
          const cumulativeHeight = (cumulativeLosses[ind] / Math.max(...cumulativeLosses)) * 100;

          const epochIndex = ind + 1;
          const pilarColor = getColor(elm);

          let lossDisplay = elm.toString().replace('.', ',');
          if(elm > 2) lossDisplay = elm.toFixed(2).replace('.', ',');
          if(elm > 10) lossDisplay = Math.floor(elm).toLocaleString( 'de-DE' );
          if(elm > 10e6) lossDisplay = '∞';


          let cumulativeLossDisplay = cumulativeLosses[ind].toString().replace('.', ',');
          if(cumulativeLosses[ind]  > 2) cumulativeLossDisplay = cumulativeLosses[ind] .toFixed(2).replace('.', ',');
          if(cumulativeLosses[ind]  > 10) cumulativeLossDisplay = Math.floor(cumulativeLosses[ind]).toLocaleString( 'de-DE' );
          if(cumulativeLosses[ind]  > 10e6) cumulativeLossDisplay = '∞';

          return (
              <div key={ind} className={`group bg-lightGray w-full h-full relative rounded-md`}>
                <Typography type={TextTypes.LINE}
                            classNames={`text-gray group-hover:text-black !bg-white absolute bottom-0 hidden w-12 left-1/2 -translate-x-1/2 translate-y-6 overflow-visible whitespace-nowrap text-center
                              ${(epochIndex % getModulo() == 0) ? '!block' : 'group-hover:!block'}`}
                            styles={[TextStyles.SMALL, TextStyles.MEDIUM]}>
                  {epochIndex}
                </Typography>
                <div
                    className={`absolute z-[5] group-hover:z-[20] bottom-0 left-0 w-full block rounded-md bg-light${firstCapital(pilarColor)} group-hover:bg-${pilarColor}`}
                    style={{height: `${height}%`}}>
                  <div className={`absolute pointer-events-none touch-none z-[10] group-hover:z-[30] bottom-[100%] w-32 left-1/2 -translate-x-1/2 -translate-y-10 opacity-0 
                    group-hover:-translate-y-3 group-hover:opacity-100 overflow-visible transition-all duration-100 text-center
                    flex flex-col flex-nowrap gap-y-1`}>
                    <Typography type={TextTypes.LINE}
                                classNames={`text-${pilarColor} text-center whitespace-nowrap px-2 py-1 rounded-full bg-white custom-box-shadow-active`}
                                styles={[TextStyles.SMALL, TextStyles.BOLD]}>
                      {lossDisplay} loss
                    </Typography>
                    <Typography type={TextTypes.LINE}
                                classNames={`text-gray text-center whitespace-nowrap px-2 py-1 rounded-full bg-white custom-box-shadow-active`}
                                styles={[TextStyles.SMALL]}>
                      {cumulativeLossDisplay} cumulative
                    </Typography>
                  </div>
                </div>

                <div className="absolute left-0 bottom-0 h-1 w-full block bg-white opacity-50 rounded-md group-hover:opacity-100 z-[3]"
                     style={{height: `${cumulativeHeight}%`}}></div>

              </div>
          )
        })
      }
    </div>
    </>
  )
}

export default LossChart;