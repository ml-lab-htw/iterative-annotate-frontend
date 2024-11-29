'use client'
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import ContentWrapper from "@/components/_layout/ContentWrapper";
import {nextIcon} from "@/components/icons";
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import BaseButton, {ButtonStyle} from "@/components/_default/BaseButton";
import CanvasImageUi from "@/app/project/[projectId]/bundle/[bundleId]/canvasUi";
import LabelMananger from "@/app/project/[projectId]/bundle/[bundleId]/labelListUi";
import {BundleRequest} from "@/modules/api/bundle";
import {useRouter} from "next/navigation";

type Props = {
  projectId: number;
  bundleId: number;
  data: IAnnotatedImageModel[];
  classNames?: string
}

const ReviewManager: React.FC<Props> = (
    {classNames = '', projectId,bundleId, data}
) => {

  const [currentId, setCurrentId] = useState<number>(0);
  const [currentLabelId, setCurrentLabelId] = useState<number>(-1);

  const testData = useRef<ITestData>({
    start: Date.now(),
    end: null,
    data: {
      boxCreatedCnt: 0,
      boxRemovedCnt: 0,
      labelUpdatedCnt: 0,
      boxMovedCnt: 0,
      navigateImgCnt: 0
    }
  });

  const nextImage = (dir:boolean) => {
    setCurrentLabelId(-1);

    testData.current.data.navigateImgCnt += 1;

    // save data to backend
    if(data[currentId].annotations.length > 0) {
      saveReviewData();
      changeImageIndex(dir);

    }else changeImageIndex(dir);
  }

  const saveReviewData = () => {
    saveImageAnnotations(data[currentId].id).then((newData) => {
      // update data in object
      for (var x in newData.annotations) {
        const entry = newData.annotations[x];
        const displayEntry = data[currentId].annotations[x];

        if (entry.label === displayEntry.label && displayEntry.id !== entry.id) {
          console.log(`Changed entry ID for new Annotation from ${displayEntry.id} to ${entry.id}`);
          displayEntry.id = entry.id;
        }
      }
    }).catch((err: Error) => {
      // go further anyway
      console.log(err);
    });
  }

  const changeImageIndex = (dir:boolean)=> {
    const maxIndex = data.length-1;

    if(dir && currentId < maxIndex) setCurrentId(currentId +1);
    else if(!dir && currentId > 0) setCurrentId(currentId -1);
  }

  const saveImageAnnotations = async (imageId: number) : Promise<IAnnotatedImageModel> => {
    return new Promise(async (resolve,reject) => {
      try{
        const bundleLoader = new BundleRequest();
        const newImageData = await bundleLoader.reviewImage(imageId, data[currentId].annotations);
        resolve(newImageData);
      } catch (e:any) {
        console.log(e);
        reject();
      }
    });
  }

  const [viewMode, setViewMode] = useState<boolean>(false);
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [focusInput, setFocusInput] = useState<number>(-1);

  const toggleViewMode = () => {
    setViewMode(!viewMode);
    setFocusInput(-1);
    setCurrentLabelId(-1);
  }

  const startDrawModus = () => {
    setDrawMode(true);
    setFocusInput(-1);
    setCurrentLabelId(-1);

    document.body.addEventListener('click', function killDraw(event: MouseEvent) {
      if(!event.target) return;
      const elm = (event.target as HTMLElement);

      if(elm.tagName !== "CANVAS"){
        // abbrechen weil woanders hingeclicked
        setDrawMode(false);
        document.body.removeEventListener('click', killDraw);
      }
    })
  }
  const endDrawMode = (selectId:number) => {
    setDrawMode(false);
    setCurrentLabelId(selectId);
    setFocusInput(selectId);
    testData.current.data.boxCreatedCnt +=1;
  }

  // keyboard mappings
  useEffect(() => {
    document.addEventListener('keydown', keyboardNavigation);
    return () => {
      document.removeEventListener('keydown', keyboardNavigation);
    };
  }, [drawMode, focusInput, currentId, currentLabelId]);

  const labelIdxFromId = (id:number) => {
    if (id >= 0) {
      for (let x in data[currentId].annotations) {
        const elm = data[currentId].annotations[x];
        if (elm.id === id) {
          return parseInt(x);
        }
      }
    }
    return -1;
  }

  // Functions to alter the test data object state
  const deleteFromList = (cnt: number) => {
    testData.current.data.boxRemovedCnt += cnt;
  }

  const moveBoundingBox = () => {
    testData.current.data.boxMovedCnt += 1;
  }

  const updateLabeling = () => {
    testData.current.data.labelUpdatedCnt += 1;
  }

  const router = useRouter();
  const endReview = () => {
    testData.current.end = Date.now();
    console.log(testData.current);
    saveTestInfo().then(()=> {
      router.push(`/project/${projectId}`)
    });
  }

  const saveTestInfo = async () : Promise<boolean> => {
    return new Promise(async (resolve,reject) => {
      try{
        const bundleLoader = new BundleRequest();
        const tempData = testData.current;
        if(!tempData || !tempData.end) return;

        const duration = tempData.end - tempData.start;
        await bundleLoader.sendTestInfo(bundleId, duration, tempData.data);
        resolve(true);
      } catch (e:any) {
        console.log(e);
        reject();
      }
    });
  }

  const keyboardNavigation = (evt:KeyboardEvent) => {
    const keyCode = evt.key;
    const annotationIdx = labelIdxFromId(currentLabelId);

    if (!drawMode) {

      // normal navigation
      switch (keyCode) {
        case 'ArrowRight':
          if (focusInput >= 0) return;
          nextImage(true);
          break;
        case 'ArrowLeft':
          if (focusInput >= 0) return;
          nextImage(false);
          break;
        case 'b':
          // new bounding box
          if (focusInput >= 0) return;
          startDrawModus();
          break;
        case 'q':
          // enterViewMode
          console.log("switch view");
          toggleViewMode();
          break;
        case 'e':
          // edit label
          if (focusInput >= 0) return;
          if (annotationIdx >= 0) {
            console.log("Init label edit", currentLabelId);
            setFocusInput(annotationIdx);
          }
          break;
        case 'Enter':
          if (focusInput >= 0 && annotationIdx >= 0) {
            console.log("Init save new label", currentLabelId);
            setFocusInput(-1);
          }
          break;
        case 'Backspace':
          // delete annotation
          if (focusInput < 0 && annotationIdx >= 0) {
            data[currentId].annotations[annotationIdx].active = false;
            deleteFromList(1);
            setCurrentLabelId(-1);
          }
          break;
      }
    }
  }

  return (
      <>
        <ContentWrapper className={`flex flex-col-reverse md:flex-row items-center gap-y-6 flex-nowrap justify-between ${classNames} pb-4 md:pb-16`}>
          <div className={'mini-nav w-auto h-auto flex flex-row gap-x-4 flex-nowrap items-center select-none'}>
            <div className={'w-6 h-6 block p-2 box-content [&>svg]:w-full [&>svg]:h-full rotate-180 cursor-pointer rounded-full hover:text-blue hover:bg-lightGray'} onClick={()=>nextImage(false)}>{nextIcon()}</div>
            <div>
              <Typography type={TextTypes.LINE} styles={[TextStyles.BOLD]}>Image {currentId+1}</Typography>
              <Typography type={TextTypes.LINE} styles={[]}> / {data.length}</Typography>
            </div>
            <div className={'w-6 h-6 block p-2 box-content [&>svg]:w-full [&>svg]:h-full cursor-pointer rounded-full hover:text-blue hover:bg-lightGray'} onClick={()=>nextImage(true)}>{nextIcon()}</div>
          </div>

          <div className={'flex flex-col md:flex-row flex-nowrap items-center gap-y-2 md:gap-x-8 custom-box-shadow-active px-6 py-4 rounded-xl'}>
            <Typography type={TextTypes.BODY} classNames={'text-orange'}>1% reviewed</Typography>
            <BaseButton callback={endReview} type={ButtonStyle.WARNING}>End review</BaseButton>
          </div>
        </ContentWrapper>

        <ContentWrapper>
          <div className={'flex flex-col md:flex-row flex-nowrap run dewrap justify-stretch gap-8'}>
            <CanvasImageUi classNames={'w-[900px] flex-shrink-0 flex-grow-0'}
                           imageData={data[currentId]}
                           selectLabel={setCurrentLabelId} selectedLabelId={currentLabelId}
                           drawMode={drawMode} endDrawMode={endDrawMode}
                           viewMode={viewMode}
                           emitMoveEntry={moveBoundingBox}
            />
            <LabelMananger classNames={'flex-grow'}
                           labelData={data[currentId].annotations}
                           selectLabel={setCurrentLabelId} selectedLabelId={currentLabelId}
                           pagination={[currentId, data.length]} navigate={nextImage}
                           startDrawing={startDrawModus} drawingStopped={!drawMode}
                           emitDeleteEntry={deleteFromList} emitUpdateLabel={updateLabeling}
                           focusInput={focusInput} unFocus={() => setFocusInput(-1)}
            />
          </div>
        </ContentWrapper>
        <ContentWrapper>
          <Typography type={TextTypes.H3}>Keyboard short cuts</Typography>
          <table border={1}>
            <thead>
              <tr>
                <td>Title</td>
                <td>Key</td>
              </tr>
            </thead>

            <tbody>
            <tr>
              <td>Add new bounding box</td>
              <td>b</td>
            </tr>
            <tr>
              <td>Toggle Label visibility</td>
              <td>q</td>
            </tr>
            <tr>
              <td>Edit annotation label</td>
              <td>e</td>
            </tr>
            <tr>
              <td>Next image</td>
              <td>next</td>
            </tr>
            <tr>
              <td>Previous image</td>
              <td>prev</td>
            </tr>
            <tr>
              <td>Remove selected annotation</td>
              <td>Backspace</td>
            </tr>
            <tr>
              <td>Accept new label string</td>
              <td>Enter</td>
            </tr>
            </tbody>
          </table>
        </ContentWrapper>
      </>
  )
}

export default ReviewManager;