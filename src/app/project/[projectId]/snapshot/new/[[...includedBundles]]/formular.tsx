'use client';
import * as React from 'react';
import {useEffect, useState} from 'react';
import ContentWrapper from "@/components/_layout/ContentWrapper";
import TextInput from "@/components/_default/TextInput";
import BaseButton, {ButtonStyle} from "@/components/_default/BaseButton";
import HeadAndText from "@/components/_default/HeadAndText";
import DropDown from "@/components/_default/DropDown";
import {formatDate, formatTime} from "@/modules/timeDisplay";
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import {TrainRequest} from "@/modules/api/train";
import {useRouter} from "next/navigation";
import {revalidatePath} from "next/cache";
import NumberInput from "@/components/_default/NumberInput";

type Props = {
  classNames?: string,
  projectId: number,
  snapshots: ISnapshot[],
  selectedBundles: IImageBundleModel[]
}


const SnapshotCreateForm: React.FC<Props> = (
    {classNames = '', projectId, snapshots=[], selectedBundles = []}
) => {

  const [baseModel, setBaseModel] = useState<number>(-1);

  const [snapTitle, setSnapTitle] = useState<string>(`${snapshots.length + 1}. Snapshot`);
  const [epochCount, setEpochCount] = useState<number>(50);
  const [batchSize, setBatchSize] = useState<number>(20);
  const [stepSize, setStepSize] = useState<number>(0.0001);

  const [waiting, setWaiting] = useState<boolean>(false);
  const [combinedBundles, setCombinedBundles] = useState<IBundleEntry[]>([]);

  const mappedSelectedBundles = selectedBundles.map(elm => {
    return {
      id: elm.id,
      created: elm.uploaded.toString(),
      image_count: elm.images.length,
      included: false
    } as IBundleEntry;
  });

  // find preselected snapshot for dropdown preset
  const preselectedDropdownIndex = snapshots.findIndex((elm) => elm.selected);

  const router = useRouter();

  // for dropdown selection -> get snapshot id from selection index
  const pushBaseModelIdFromIdx = (indx: number) => {
    if (indx < 0) {
      // Deselect snapshot
      setBaseModel(-1);
      setCombinedBundles(mappedSelectedBundles);
      return;
    }

    const baseModel = snapshots.find((elm, index) => index == indx)
    if (!baseModel) return;

    setBaseModel(baseModel.id);
    // display used bundles for selected snapshot
    combineBundles(baseModel.bundles, mappedSelectedBundles);
  }

  useEffect(() => {
    // check if model settings are stored
    // pushBaseModelIdFromIdx(baseModel);

    const possibleSettingStore =  localStorage.getItem(`proj-${projectId}-advanced`);
    if(!possibleSettingStore) return;

    const sessionSetting = JSON.parse(possibleSettingStore);
    if(!sessionSetting) return;

    console.log(sessionSetting);

    if(sessionSetting.batch_size) setBatchSize(sessionSetting.batch_size);
    if(sessionSetting.epochs) setEpochCount(sessionSetting.epochs);
    if(sessionSetting.learning_rate) setStepSize(sessionSetting.learning_rate);

  }, []);

  useEffect(() => {
    console.log("Updated combinedBundles:", combinedBundles);
  }, [combinedBundles]);

  const combineBundles = (snapshotBundles: IBundleEntry[], selectedBundles: IBundleEntry[]) => {
    // Convert snapshotBundles to a Map for O(1) lookup times
    const snapshotBundleMap = new Map(snapshotBundles.map(bundle => [bundle.id, bundle]));

    // Mark bundles as included if found in snapshotBundles and remove from the Map
    for (const bundle of mappedSelectedBundles) {
      if (snapshotBundleMap.has(bundle.id)) {
        bundle.included = true;
        snapshotBundleMap.delete(bundle.id); // Remove to avoid processing it again
      }
    }

    const remainingBundles = Array.from(snapshotBundleMap.values()).map(bundle => ({...bundle, included: true}));
    const combined = mappedSelectedBundles.concat(remainingBundles);
    setCombinedBundles(combined);
  }

  const initializeTraining = async () => {

    const bundleIdArr = combinedBundles.map(elm => elm.id);
    setWaiting(true);

    let settings = {
      batch_size: batchSize,
      epochs: epochCount,
      learning_rate: stepSize
    }

    try{
      const trainingsLoader = new TrainRequest();
      const snapshotInfo = await trainingsLoader.startTraining(snapTitle, bundleIdArr, baseModel, settings);
      console.log(snapshotInfo);
      setWaiting(false);
      localStorage.setItem(`proj-${projectId}-advanced`, JSON.stringify(settings));

      const returnPath = `/project/${projectId}/snapshot`;
      router.push(returnPath);

    } catch (e: any) {
      console.log('An error occurred');
      setWaiting(false);
    }

  }

  return (
      <ContentWrapper className={classNames}>
        <div className={'flex flex-col sm:flex-row justify-between items-start gap-16 md:gap-32'}>
          <div className={'left-container flex-grow w-full h-auto'}>
            <HeadAndText
                headline={"Choose new snapshot name"}
                text={"Please choose a name for the model snapshot or go with the default one."} />
            <TextInput label={'Snapshot title'} initValue={snapTitle} onChange={setSnapTitle} classNames={'!mb-16'}/>

            <HeadAndText
                headline={"Select base snapshot"}
                text={"Choose a base snapshot and adjust training settings. Customize parameters to optimize model performance and create a robust training environment."}/>
            <DropDown items={snapshots.map((elm) => elm.name+' - '+formatDate(elm.created))} allowNoneType={true} placeholder={"Default model"}
                      onSelect={(val:number)=>{pushBaseModelIdFromIdx(val)}} classNames={"w-full mb-16"} defaultIndex={preselectedDropdownIndex} />

            <HeadAndText
                headline={"Advanced settings"}
                text={"Select the number of trainings epochs, how big the trainings batch should be for each epoch. And an appropriate learning-rate value."} />
            <div className={'flex flex-row flex-nowrap gap-x-16'}>
              <NumberInput defaultPrefix={''} label={'Number of epochs'}
                           min={5} max={250} isFloat={false}
                           initialValue={epochCount} onChange={setEpochCount} />
              <NumberInput defaultPrefix={''} label={'Trainings batch size'}
                           min={1} max={100} isFloat={false}
                           initialValue={batchSize} onChange={setBatchSize} />
              <NumberInput defaultPrefix={'0.'} label={'Learning rate'}
                           min={0.000001} max={0.1}  isFloat={true}
                           initialValue={stepSize} onChange={setStepSize} />
            </div>

            <BaseButton callback={initializeTraining} type={ButtonStyle.WARNING} isLoading={waiting} classNames={'ml-auto'}>Start training</BaseButton>
          </div>

          <div className={'right-container flex-grow w-full h-auto'}>
            <HeadAndText
                headline={"Image batch inclusion"}
                text={"Here you can see the selected image batches for training, and if the selected snapshot already has been trained on them."}/>

            <table className={'w-full table-fixed border-collapse'} border={2}>
              <thead>
                <tr className={'[&>th]:pb-3 text-left text-lightBlue'}>
                  <th className={'w-20'}>
                    <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Id</Typography>
                  </th>
                  <th className={'w-52'}>
                    <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Upload date</Typography>
                  </th>
                  <th className={'w-32'}>
                    <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Images</Typography>
                  </th>
                  <th>
                    <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Status</Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {combinedBundles.map((bundle, ind) => (
                    <tr key={ind} className={'[&>td]:align-middle [&>td]:py-3 [&>td]:border-lightGray [&>td]:border-t-2'}>
                      <td className={`${bundle.included?'text-gray':'text-blue'}`}>
                        <Typography type={TextTypes.LINE} styles={[TextStyles.MEDIUM]}>#{bundle.id}</Typography>
                      </td>
                      <td className={`${bundle.included?'text-gray':'text-black'}`}>
                        <Typography type={TextTypes.LINE} styles={[TextStyles.BOLD, TextStyles.SMALL]}
                                    classNames={'block'}>
                          {formatDate(bundle.created)}
                        </Typography>
                        <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]} classNames={'block'}>
                          {formatTime(bundle.created)}
                        </Typography>
                      </td>
                      <td>
                        <Typography type={TextTypes.LINE} classNames={`${bundle.included?'text-gray':'text-blue'}`}>{bundle.image_count}</Typography>
                      </td>
                      <td>
                        {
                          bundle.included ? (
                              <>
                                <Typography type={TextTypes.LINE} classNames={'text-orange block'}
                                            styles={[TextStyles.BOLD, TextStyles.SMALL]}>Included in selected
                                  snapshot</Typography>
                                <Typography type={TextTypes.LINE} classNames={'text-lightGray block'}
                                            styles={[TextStyles.SMALL]}>This bundle is already included</Typography>
                              </>
                          ) : (
                              <Typography type={TextTypes.LINE} classNames={'text-blue'}
                                          styles={[TextStyles.BOLD, TextStyles.SMALL]}>Ready to train</Typography>
                          )
                        }
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ContentWrapper>
  )
}

export default SnapshotCreateForm;