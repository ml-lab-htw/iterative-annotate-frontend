import * as React from 'react';
import TextInput from "@/components/_default/TextInput";
import {useEffect, useState} from "react";

type Props = {
  initialValue: number;
  classNames?: string;
  isFloat?: boolean;
  min?: number;
  max?: number;
  label: string;
  defaultPrefix?: string;
  onChange: (value:number) => void;
}
const NumberInput: React.FC<Props> = (
    {classNames = '',
      label,
      defaultPrefix = "",
      min, max,
      isFloat= true,
      initialValue,
      onChange}
) => {

  /* Confidence input */
  if(!isFloat) initialValue = Math.floor(initialValue);
  else initialValue *= 1.0;

  const [displayString, setDisplayString] = useState<string>(initialValue.toString());

  const validateInput = () => {
    if(displayString.length < 1) {
      setDisplayString(defaultPrefix);
      return;
    }

    const dotVal = (isFloat) ? displayString.replace(',','.') : displayString;
    const regex = (isFloat) ? /-?([0-9]*[.])[0-9]+/ : /-?([0-9]+)/;
    const valueMatch = dotVal.match(regex);
    if(!valueMatch) {
      setDisplayString(defaultPrefix);
      return;
    }
    const inputVal = (isFloat) ? parseFloat(valueMatch[0]) : parseInt(valueMatch[0]);
    onChange(inputVal);
    setDisplayString(valueMatch[0]);
  }

  useEffect(() => {
    validateInput();
  }, [displayString]);

  useEffect(() => {
    setDisplayString(initialValue.toString())
  }, [initialValue]);

  const validateRangeOnBlur = () => {
    console.log("Element defocused");
    const inputVal = (isFloat) ? parseFloat(displayString) : parseInt(displayString);
    const clamped = Math.min(Math.max(min ?? inputVal, inputVal), max ?? inputVal);

    onChange(clamped);
    setDisplayString(clamped.toString());
  }

  return (
      <TextInput label={label} initValue={displayString} onChange={setDisplayString} sendOnBlur={validateRangeOnBlur} classNames={classNames}/>
  )
}

export default NumberInput;