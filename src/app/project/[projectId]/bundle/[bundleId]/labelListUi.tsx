'use client'
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import BaseButton, {ButtonStyle} from "@/components/_default/BaseButton";
import {checkIcon, crossIcon, editIcon} from "@/components/icons";
import TextInput from "@/components/_default/TextInput";

type Props = {
  classNames?: string,
  labelData: IAnnotationModel[],

  selectedLabelId: number
  selectLabel: (idx: number) => void,

  pagination: number[],
  navigate: (dir: boolean) => void,

  startDrawing: () => void,
  drawingStopped: boolean,

  unFocus: () => void,
  emitDeleteEntry: (cnt: number) => void,
  emitUpdateLabel: () => void,
  focusInput: number
}
const LabelMananger: React.FC<Props> = (
    {
      labelData,
      classNames = '',

      selectedLabelId,
      selectLabel,

      pagination,
      navigate,

      startDrawing,
      drawingStopped = false,

      unFocus,
      emitUpdateLabel,
      emitDeleteEntry,
      focusInput = -1
    }
) => {

  const [activeLabel, setActiveLabel] = useState<number>(selectedLabelId);

  const setToActive=(id:number)=> {
    const newId = activeLabel == id ? -1 : id;
    if(editLabel && newId < 0) return;

    setEditLabel(false);
    setActiveLabel(newId);
    if(selectLabel) selectLabel(newId);
  }

  useEffect(() => {
    setEditLabel(false);
    setActiveLabel(selectedLabelId);
  }, [selectedLabelId]);

  const [waitingForDraw, setWaitingForDraw] = useState(false);

  useEffect(() => {
    if(waitingForDraw){
      startDrawing();
      setEditLabel(false);
      drawingStopped = false;
    }
  }, [waitingForDraw]);

  useEffect(() => {
    if(drawingStopped){
      // end draw mode display -> go back to regular btn
      setWaitingForDraw(false);
    }
  }, [drawingStopped]);

  const [editLabel, setEditLabel] = useState<boolean>(false);
  const [newLabelString, setNewLabelString] = useState<null|string>(null);

  const changeLabel = (event:React.MouseEvent<HTMLElement>,idx: number) => {
    event.stopPropagation();
    setNewLabelString(labelData[idx].label);
    setEditLabel(true);
  }

  const updateLabel = (val:string) => {
    if(!editLabel) return;
    setNewLabelString(val);
  }

  const acceptLabel = (event:React.MouseEvent<HTMLElement>|null,idx: number) => {
    if(event) event.stopPropagation();
    if(typeof newLabelString !== "string" || newLabelString.length < 1) return;

    labelData[idx].label = newLabelString;
    labelData[idx].edited = true;

    emitUpdateLabel();

    setNewLabelString(null);
    setEditLabel(false);
    deselectAll();

    unFocus();
  }
  const abortLabel = (event:React.MouseEvent<HTMLElement>,idx: number) => {
    event.stopPropagation();
    setNewLabelString(null);
    setEditLabel(false);

    unFocus();
  }

  const removeLabel = (event:React.MouseEvent<HTMLElement>,idx: number) => {
    event.stopPropagation();
    labelData[idx].active = false;
    emitDeleteEntry(1);
    deselectAll();
  }

  const clearAllAnnotations = () => {
    setActiveLabel(1);
    selectLabel(1);
    for(const x in labelData){
      labelData[x].active = false;
    }
    emitDeleteEntry(labelData.length);
    window.setTimeout(deselectAll, 100);
  }

  const deselectAll = () => {
    setActiveLabel(-1);
    selectLabel(-1);
  }
  const getRealDataLength = () => {
    const boolMap = labelData.map(elm => elm.active);
    return boolMap.filter(Boolean).length;
  }

  const [focusToggle, setFocusToggle] = useState<boolean>(false);

  useEffect(() => {

    if(focusInput >= 0) {
      console.log('start label edit: ', focusInput);

      setEditLabel(true);
      if (labelData[focusInput]){
        setNewLabelString(labelData[focusInput].label);
      }

      setFocusToggle(true);
      // focus and select all input elm

    }else{
      // get Idx by ID
      const saveLabelIdx = labelIdxFromId(selectedLabelId);
      if(saveLabelIdx < 0) return;
      acceptLabel(null, saveLabelIdx);
      setFocusToggle(false);
    }
  }, [focusInput]);

  const labelIdxFromId = (id:number) => {
    if (id >= 0) {
      for (let x in labelData) {
        if (labelData[x].id === id) {
          return parseInt(x);
        }
      }
    }
    return -1;
  }

  return (
      <div className={classNames}>
        <div className={'flex w-full flex-row justify-between items-center pb-4 md:pb-16'}>
          <BaseButton callback={() => navigate(false)} outline={true}
                      type={pagination[0] == 0 ? ButtonStyle.DISABLED : ButtonStyle.PRIMARY}>Previous
            Image</BaseButton>
          <BaseButton callback={() => navigate(true)} outline={true}
                      type={pagination[0] == pagination[1] - 1 ? ButtonStyle.DISABLED : ButtonStyle.PRIMARY}>Next
            Image</BaseButton>
        </div>

        {
            getRealDataLength() > 8 && (
                <BaseButton type={ButtonStyle.SECONDARY} classNames={'w-full mb-4'} outline={true} callback={clearAllAnnotations}>Clear all</BaseButton>
            )
        }

        <div className={'table w-full h-auto'}>
          {
            getRealDataLength() > 0 ? labelData.map((elm, ind) => {
              if(!elm.active) return;
              return (
                <div key={ind} onClick={() => setToActive(elm.id)}
                     className={
                    `label-entry w-full flex flex-row flex-nowrap justify-start px-6 py-2 mb-4 cursor-pointer 
                     transition-all duration-300 rounded-md 
                     ${activeLabel == elm.id ? 'custom-box-shadow-active border-l-8 border-pink' : 'custom-box-shadow hover:custom-box-shadow-active'}`
                }>
                  <div className={'table w-full'}>
                    { !editLabel && (<Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}
                                classNames={'block'}>Label {ind + 1}</Typography> ) }
                    <div className={'flex flex-row flex-nowrap items-center gap-x-3 w-full'}>
                      {
                        (!editLabel || elm.id !== activeLabel) ? (
                            <>
                              <Typography type={TextTypes.LINE}
                                          classNames={`${activeLabel == elm.id ? 'text-pink' : 'text-blue'}`}
                                          styles={(activeLabel == elm.id) ? [TextStyles.BOLD] : []}>{elm.label}</Typography>
                              {
                                (
                                    <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}
                                                  classNames={`${activeLabel == elm.id ? 'text-black' : 'text-gray'}`}>
                                      { (elm.edited === false) ? (
                                          <>{(elm.score * 100).toFixed(2)}%</>
                                      ) : (
                                          <>edited</>
                                      ) }
                                    </Typography>
                                )
                              }
                            </>
                        ) :  (
                            <TextInput label={'New label'} initValue={newLabelString || ''} placeholder={'New label'}
                                       onChange={(val) => updateLabel(val)} selectAndFocus={focusToggle}/>
                        )
                      }

                      {/* Edit and Delete Buttons */}
                      {
                          (activeLabel == elm.id) && (
                              (!editLabel) ? (
                                  <div className={'btn-group ml-auto flex flex-row flex-nowrap items-center w-auto'}>
                                    <div onClick={(event) => changeLabel(event, ind)}
                                         className={'edit-btn box-content text-black hover:bg-lightGray w-6 h-6 p-2 block cursor-pointer rounded-full [&>svg]:h-full [&>svg]:w-full '}>
                                      {editIcon()}
                                    </div>
                                    <div onClick={(event) => removeLabel(event, ind)}
                                         className={'delete-btn box-content text-orange hover:bg-orange hover:text-white w-4 h-4 p-2 block cursor-pointer rounded-full [&>svg]:h-full [&>svg]:w-full'}>
                                      {crossIcon()}
                                    </div>
                                  </div>
                              ) : (
                                  <div className={'btn-group ml-auto flex flex-row flex-nowrap items-center w-auto'}>
                                    <div onClick={(event) => acceptLabel(event, ind)}
                                         className={'edit-btn box-content text-blue hover:bg-blue hover:text-white w-6 h-6 p-2 block cursor-pointer rounded-full [&>svg]:h-full [&>svg]:w-full '}>
                                      {checkIcon()}
                                    </div>
                                    <div onClick={(event) => abortLabel(event, ind)}
                                         className={'delete-btn box-content text-orange hover:bg-orange hover:text-white w-4 h-4 p-2 block cursor-pointer rounded-full [&>svg]:h-full [&>svg]:w-full'}>
                                      {crossIcon()}
                                    </div>
                                  </div>
                              )
                          )
                      }
                    </div>
                  </div>
                </div>
              )
            }) : (
                <div
                    className={'flex flex-col flex-nowrap items-center text-lightGray w-full custom-box-shadow-active py-6 mb-4 rounded-md'}>
                  <Typography type={TextTypes.BODY} classNames={'text-center'}>No labels</Typography>
                  <Typography type={TextTypes.BODY} styles={[TextStyles.SMALL]} classNames={'text-center'}>Press the button below to add new labels to the image</Typography>
                </div>
            )
          }
        </div>
        {!waitingForDraw ? (
            <BaseButton callback={() => setWaitingForDraw(true)} type={ButtonStyle.SECONDARY}>Add label</BaseButton>
        ) : (
            <div className={`label-entry w-auto bg-white border-[1px] border-orange flex flex-row flex-nowrap justify-start transition-all duration-300 rounded-md px-6 py-2 mb-4 custom-box-shadow-active`}>
              <Typography type={TextTypes.BODY} classNames={'py-5 max-w-sm text-orange'}>
                Click and drag on the image to add a new bounding box.
              </Typography>
            </div>
        )}
      </div>
  )
}

export default LabelMananger;