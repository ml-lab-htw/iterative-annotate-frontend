'use client';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import {nextIcon} from "@/components/icons";
import {EventListener} from "undici-types/patch";

type Props = {
  items: string[];
  classNames?: string;
  defaultIndex?: number;
  placeholder?: string;
  maxWidth?: string;
  allowNoneType?: boolean;
  onSelect: (index: number) => void;
}

const DropDown: React.FC<Props> = (
    {
      items= [],
      classNames = '',
      defaultIndex= -1,
      allowNoneType= true,
      maxWidth = 'max-w-none',
      placeholder = "select option",
      onSelect
    }
) => {

  if (defaultIndex >= 0) {
    if (!items[defaultIndex]) {
      defaultIndex = -1;
    }
  }

  let startHeadline = (defaultIndex >=0) ? items[defaultIndex] : placeholder;
  const [boxHeadline, setBoxHeadline] = useState<string>(startHeadline);

  const [open, setOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(defaultIndex);

  const closeView = (event: MouseEvent) => {
    document.body.removeEventListener('click', closeView);
    setOpen(false);
  }

  useEffect(() => {
    onSelect(currentIndex);
  }, []);

  const openDropdown = () => {
    document.body.addEventListener('click', closeView);
    setOpen(true);
  }


  const selectOption = (ind:number) => {
    let nextHeadline = (ind >=0) ? items[ind] : placeholder;
    setBoxHeadline(nextHeadline);

    setCurrentIndex(ind);
    onSelect(ind);
    setOpen(false);
  }

  return (
      <div className={`relative w-auto table ${classNames} select-none !p-0`}>
        <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]} classNames={'mb-2 table'}>
          Select the auto label snapshot
        </Typography>
        <div className={
          `show-box ${!open?'custom-box-shadow' : '!custom-box-shadow-active'} hover:custom-box-shadow-active cursor-pointer
           flex flex-row flex-nowrap items-center justify-between min-w-[300px] ${maxWidth} w-full ${open ? 'rounded-b-none rounded-t-xl' : 'rounded-xl'}
           py-2 px-3 duration-300 transition-all ${open && '!pointer-events-none !touch-none'}`
        } onClick={()=>openDropdown()}>
          <Typography type={TextTypes.LINE} styles={[TextStyles.BOLD]} classNames={'text-blue pr-8'}>
            {boxHeadline}
          </Typography>
          <span className={`w-6 h-6 text-blue transition-transform ${!open?'rotate-90':'-rotate-90'}`}>
            {nextIcon()}
          </span>
        </div>
        <div className={`overlay-box bg-white transition-all duration-300 custom-box-shadow hover:custom-box-shadow-active 
        absolute left-0 top-[100%] w-auto min-w-[100%] z-[100] max-h-[350px] overflow-y-auto overflow-x-hidden block
        ${open?'translate-y-0 rounded-t-none rounded-b-xl opacity-100':'translate-y-5 rounded-xl opacity-0 !pointer-events-none !touch-none'} duration-400 transition-all`}>
          {
              allowNoneType && <div className={`py-2 px-3 h-auto border-lightGray border-b-2 ${currentIndex < 0 ? 'cursor-default text-blue' : 'cursor-pointer text-gray hover:bg-lightGray'}`} onClick={() => selectOption(-1)}>
                  <Typography type={TextTypes.LINE} classNames={'text-inherit'}>{placeholder}</Typography>
              </div>
          }
          {
            items.map((elm, ind) => {
              return (
                  <div className={`py-2 px-3 h-auto 
                  ${ind == currentIndex ? '!font-medium text-blue' : 'text-black cursor-pointer hover:bg-lightGray'}`} key={ind}
                       onClick={() => selectOption(ind)}>
                    <Typography type={TextTypes.LINE} classNames={'text-inherit'}>{elm}</Typography>
                </div>
              )
            })
          }
        </div>

      </div>
  )
}

export default DropDown;