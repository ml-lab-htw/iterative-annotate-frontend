import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";

type Props = {
  lossArray: number[],
}
const LossChangeChart: React.FC<Props> = (
    {lossArray}
) => {

  const cumulativeChange = useRef<number>(0);
  const [barDegree, setBarDegree] = useState<number>(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const calculateLossChange = () => {
    return lossArray.map((loss, index) => {
      if (index === 0) return 0; // No change at the start
      return loss - lossArray[index - 1];
    });
  }

  const lossChanges = calculateLossChange();
  const maxChange = Math.max(...lossChanges.map(Math.abs));

  const firstCapital = (str:string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  useEffect(() => {
    cumulativeChange.current = lossChanges.reduce((sum, change) => sum + change, 0);

    positionBar();
  }, [lossChanges]);

  const positionBar = () => {
    if (chartContainerRef.current) {
      const containerWidth = chartContainerRef.current.clientWidth;
      const containerHeight = chartContainerRef.current.clientHeight;

      if (containerWidth > 0 && containerHeight > 0) {
        const aspectRatio = containerWidth / containerHeight;
        const maxRotation = (Math.atan(1 / aspectRatio) * 180) / Math.PI;
        const clampedChange = Math.max(-5, Math.min(5, cumulativeChange.current));
        const rotationPercentage = (clampedChange + 5) / 10;
        const rotationDegree = (rotationPercentage - 0.5) * maxRotation * 2;

        setBarDegree(-rotationDegree);
      }
    }
  }


  const listener = useRef<any>(null);

  useEffect(() => {

    listener.current = (event: UIEvent) => {
      positionBar();
    }

    addEventListener('resize', listener.current);

    return () => {
      if(listener.current === null) return;

      removeEventListener('resize', listener.current);
      listener.current = null;
    };

  }, []);


  let moduloCount = 1;
  if(lossArray.length > 5) moduloCount = 5;
  if(lossArray.length > 50) moduloCount = 10;
  if(lossArray.length > 100) moduloCount = 25;
  if(lossArray.length > 250) moduloCount = 50;

  return (
      <div className="loss-change-chart table w-full h-auto">
        <div className={'flex flex-row flex-nowrap items-center justify-between'}>
          <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>
            Loss change (y-axis) per epoch (x-axis)
          </Typography>
          <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL, TextStyles.MEDIUM]} classNames={`${Math.abs(barDegree)>1?`${barDegree<0?'text-orange':'text-blue'}`:'text-black'}`}>
            Running total {cumulativeChange.current.toFixed(3)}
          </Typography>
        </div>
        <div className={"block w-full h-auto pt-2 pb-6 mb-12"}>
          <div ref={chartContainerRef} className={"w-full h-44 flex flex-row flex-nowrap gap-x-0.5 items-center justify-between relative"}>
          <div className={`absolute origin-center left-0 w-full h-[2px] ${Math.abs(barDegree)>1?`${barDegree<0?'bg-orange':'bg-blue'}`:'bg-gray'} block z-[5]`}
          style={{transform:`rotate(${barDegree}deg)`}}/>

          {lossChanges.map((change, index) => {
            const epochIndex = index + 1;

            const deltaChange = (Math.abs(change) / maxChange);
            const topOffset = `${50 - (50 * deltaChange)}%`;
            const absHeight = `${deltaChange * 50}%`;

            const barColor = change >= 0 ? 'orange' : 'blue';

            const styleObject = change >= 0 ? {
              top: topOffset,
            } : {
              bottom: topOffset
            }

            let lossDisplay = change.toFixed(2).replace('.', ',');
            if (Math.abs(change) > 1) lossDisplay = change.toFixed(1).replace('.', ',');
            if (Math.abs(change) > 10) lossDisplay = Math.floor(change).toLocaleString('de-DE')
            if (Math.abs(change) > 10e6) lossDisplay = '∞';

            return (
                <div key={index} className={`group w-full h-full relative bg-lightGray transition-all duration-100 hover:bg-white rounded-md
                after:absolute after:left-0 after:top-[49.5%] after:w-full after:h-[1%] after:block after:bg-white after:z-[50] z-[3]`}>
                  <Typography type={TextTypes.LINE}
                              classNames={`text-gray group-hover:text-black absolute bottom-0 hidden left-0 translate-y-6 w-full overflow-visible whitespace-nowrap text-center
                              ${(epochIndex % moduloCount == 0) ? '!block' : 'bg-white group-hover:!block'}`}
                              styles={[TextStyles.SMALL, TextStyles.MEDIUM]}>
                    {epochIndex}
                  </Typography>

                  <div className={`w-full h-full block relative`}>
                    <div
                        className={`w-full bg-light${firstCapital(barColor)} group-hover:bg-${barColor} absolute left-0 z-[10] ${change > 0 ? 'rounded-t-sm' : 'rounded-b-sm'}`}
                        style={{...styleObject, height: absHeight}}/>
                  </div>

                  <div className={`absolute pointer-events-none touch-none top-0 group-hover:z-[100] w-32 left-1/2 -translate-x-1/2 -translate-y-10 opacity-0 
                      group-hover:-translate-y-8 group-hover:opacity-100 overflow-visible transition-all duration-100 text-center
                      flex flex-col flex-nowrap gap-y-2`}>
                    <Typography type={TextTypes.LINE}
                                classNames={`text-${barColor} text-center whitespace-nowrap px-2 py-1 rounded-full bg-white custom-box-shadow-active`}
                                styles={[TextStyles.SMALL, TextStyles.MEDIUM]}>
                      {change > 0 && '+'}{lossDisplay} change
                    </Typography>
                  </div>

                </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default LossChangeChart;