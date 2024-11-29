'use client';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import ContentWrapper from "@/components/_layout/ContentWrapper";
import DropDown from "@/components/_default/DropDown";
import BaseButton, {ButtonStyle} from "@/components/_default/BaseButton";
import HeadAndText from "@/components/_default/HeadAndText";
import TextInput from "@/components/_default/TextInput";
import {formatDate} from "@/modules/timeDisplay";
import {BundleRequest} from "@/modules/api/bundle";
import {useRouter} from "next/navigation";
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import {crossIcon} from "@/components/icons";
import NumberInput from "@/components/_default/NumberInput";

type Props = {
  projectId: number,
  snapshots: ISnapshot[]
}
const UploadBundleFormular: React.FC<Props> = (
    {projectId, snapshots=[]}
) => {
  const router = useRouter();

  /* File Upload */
  const fileInputRef = useRef(null);
  const handleFileInputClick = () => {
    if(!fileInputRef.current) return;
    (fileInputRef.current as HTMLInputElement).click();
  };

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files);
      setSelectedFiles(fileArray);
    }
  };

  const removeSelectedImages = () => {
    if(!fileInputRef.current) return;

    setSelectedFiles([]);
    (fileInputRef.current as HTMLInputElement).value = "";
  }

  const startImageUpload = async () => {
    setBtnLoader(true);

    const bundleLoader = new BundleRequest();
    try{
      const uploadImages = await bundleLoader.uploadBundle(projectId, selectedFiles, baseModel, confidence);
      localStorage.setItem(`proj-${projectId}-confidence`, confidence.toString());

      const returnPath = `/project/${projectId}`;
      router.push(returnPath);

    } catch (err) {
      console.log('Catch', err);
      setBtnLoader(false);
    }
  }

  const [btnLoader, setBtnLoader] = useState<boolean>(false);


  /* Model snapshot dropdown */
  const [baseModel, setBaseModel] = useState<number>(-1);

  // find preselected snapshot for dropdown preset
  const preselectedDropdownIndex = snapshots.findIndex((elm) => elm.selected);

  // for dropdown selection -> get snapshot id from selection index
  const pushBaseModelIdFromIdx = (indx: number) => {
    const baseModel = snapshots.find((elm, index) => index == indx)
    if (!baseModel) {
      // could not find selected snapshot in list -> maybe deleted
      setBaseModel(-1);
      return;
    }

    setBaseModel(baseModel.id);
  }


  /* Confidence input */
  const [confidence, setConfidence] = useState<number>(0.75);

  /* get confidence settings from storage */
  useEffect(() => {
    // check if model settings are stored
    const possibleConfidenceStore =  localStorage.getItem(`proj-${projectId}-confidence`);
    if(!possibleConfidenceStore) return;

    setConfidence(parseFloat(possibleConfidenceStore));
  }, []);

  return (
  <>
    <ContentWrapper small={true} className={'pt-16'}>

      <HeadAndText headline={"Image selection"}
                   text={"Please upload up to 50 images at once. Allowed are jpg, jpeg and png with a filesize of up to 2mb each"} />
      <div className={`w-full py-3 flex gap-x-6 flex-row flex-nowrap ${selectedFiles.length < 1 ? 'items-center':'items-start'}`}>
        <input
            type="file"
            className={'hidden'}
            ref={fileInputRef}
            multiple
            onChange={handleFileSelection}
            accept="image/*"
        />
        <BaseButton type={ButtonStyle.SECONDARY} callback={handleFileInputClick} outline={true}>
          {selectedFiles.length<1?'Select images':'Change selection'}
        </BaseButton>
        {
          selectedFiles.length < 1 ? (
            <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]} classNames={'text-gray'}>No images selected</Typography>
          ) : (
              <div className={'block'}>
                <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL, TextStyles.BOLD]} classNames={'text-black block'}>{selectedFiles.length} selected</Typography>
                <div className={'flex flex-row flex-nowrap gap-x-2 items-center w-auto text-orange hover:text-[#f00] cursor-pointer mt-2'}
                onClick={removeSelectedImages}>
                  <div className={'w-3 h-3 block [&>svg]:w-full [&>svg]:h-full'}>{crossIcon()}</div>
                  <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]} classNames={'text-inherit'}>remove selected images</Typography>
                </div>
              </div>
          )
        }

      </div>

      <HeadAndText classNames={'pt-12'}
                   headline={"Auto label snapshot"}
                   text={"Select a base model or snapshot to auto-label the uploaded images."} />
      <DropDown items={snapshots.map((elm) => elm.name+' - '+formatDate(elm.created))} allowNoneType={true} placeholder={"Default model"}
                onSelect={(val:number)=>{pushBaseModelIdFromIdx(val)}} classNames={"w-full mb-16"} defaultIndex={preselectedDropdownIndex} />

      <HeadAndText classNames={'pt-12'}
                   headline={"Auto labeling confidence"}
          text={"The confidence level from .1 to .9, at which an annotation is included into the auto labeling inference results"} />

      {/*<TextInput label={'Inference confidence level [0.1, 0.9]'} initValue={confidenceString} onChange={setConfidenceString} classNames={'!mb-16'}/>*/}
      <NumberInput defaultPrefix={'0.'} label={'Inference confidence level [0.1, 0.9]'}
                   classNames={'!mb-16'} min={0.1} max={0.9}
                   initialValue={confidence} onChange={setConfidence} />
    </ContentWrapper>

    <ContentWrapper small={true} className={'pb-32'}>
      <BaseButton callback={startImageUpload} classNames={'ml-auto'} isLoading={btnLoader}>Upload bundle</BaseButton>
    </ContentWrapper>
  </>
  )
}

export default UploadBundleFormular;