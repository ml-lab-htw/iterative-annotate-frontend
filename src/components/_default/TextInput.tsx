'use client'
import * as React from 'react';
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import {useEffect, useRef, useState} from "react";

type InputProps = {
  initValue?: string;
  placeholder?: string;
  label?: string;
  classNames?: string;
  onChange?: (value:string) => void;
  sendOnBlur?: () => void;
  isArea?: boolean
  selectAndFocus?: boolean
}
const TextInput: React.FC<InputProps> = (
    {
      initValue = '',
      label=null,
      classNames = '',
      placeholder = '',
      onChange,
      sendOnBlur,
      selectAndFocus=false,
      isArea = false}
) => {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [value, setValue] = useState<string>(initValue);

  const handleOnChange = () => {
    const currentRef = isArea ? textareaRef.current : inputRef.current;
    if (!currentRef) return;

    selectAndFocus = false;

    const newValue = currentRef.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue); // Call the onChange callback
    }
  }

  useEffect(() => {
    if(selectAndFocus){
      const currentRef = isArea ? textareaRef.current : inputRef.current;
      if (!currentRef) return;
      currentRef.focus();
      currentRef.select();
    }
  }, [selectAndFocus]);

  useEffect(() => {
    const currentRef = isArea ? textareaRef.current : inputRef.current;
    if (value.trim().length > 0) {
      if (!currentRef) return;
      currentRef.value = value;
      if (onChange) {
        onChange(value)
      }
    }

  }, [value])

  useEffect(() => {
    const currentRef = isArea ? textareaRef.current : inputRef.current;
    if (!currentRef) return;
    currentRef.value = initValue;
  }, [initValue]);

  return (
      <div className={`group w-full h-auto mb-8 ${classNames}`}>
        <label htmlFor={"textInput"} className={'pb-2 table relative whitespace-nowrap'}>
          <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]} classNames={'block duration:300 transition-all group-focus-within:translate-y-1 group-focus-within:scale-105 text-lightBlue group-focus-within:text-black'}>{label}</Typography>
        </label>
        {
          !isArea ? (
            <input type={"text"} name={"textInput"} id={"textInput"} placeholder={placeholder}
                   className={`w-full h-auto px-4 py-3 rounded-lg
               custom-box-shadow focus:custom-box-shadow-active outline-none placeholder-gray
               text-body md:text-body-md xl:text-body-xl`} onChange={handleOnChange} onBlur={() => {if(sendOnBlur) sendOnBlur()}} ref={inputRef} />
          ) : (
            <textarea name={"textInput"} id={"textInput"} placeholder={placeholder}
                      className={`w-full h-52 resize-none px-4 py-3 rounded-lg
               custom-box-shadow focus:custom-box-shadow-active outline-none placeholder-gray
               text-body md:text-body-md xl:text-body-xl`} onChange={handleOnChange} ref={textareaRef}>
            </textarea>
          )
        }
      </div>
  )
}

export default TextInput;