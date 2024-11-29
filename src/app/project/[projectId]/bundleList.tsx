'use client';
import * as React from 'react';
import {useState} from 'react';
import ContentWrapper from "@/components/_layout/ContentWrapper";
import Link from "next/link";
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import {formatDate, formatTime} from "@/modules/timeDisplay";
import BaseButton, {ButtonStyle} from "@/components/_default/BaseButton";
import {useRouter} from "next/navigation";
import {checkIcon, crossIcon, failIcon, IconContainer, IconTextContainer} from "@/components/icons";
import {revalidatePath} from "next/cache";
import {BundleRequest} from "@/modules/api/bundle";

type Props = {
  projectId: number;
  bundles: IImageBundleModel[];
}
const BundleList: React.FC<Props> = (
    {projectId, bundles}
) => {

  const router = useRouter();
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

  const [bundleArray, setBundleArray] = useState<IImageBundleModel[]>(bundles);

  const getBgColor = (code:number):string =>  {
    switch (code) {
      case 2:
        return 'pink';
        // annotated
      case 3:
        return 'blue';
        // reviewed
      default:
        // uploaded or failed
        return 'gray';
    }
  }

  const trainBundles = () => {
    let pagePath = `/project/${projectId}/snapshot/new`;
    if(selectedEntries.length > 0) {
      pagePath += '/'+ selectedEntries.join('/')
    }
    router.push(pagePath);
  }

  const toggleBundleSelection = (event: React.MouseEvent<HTMLElement>, ind: number) => {
    event.stopPropagation();
    event.preventDefault();

    if(event.isPropagationStopped()){
      setSelectedEntries((prevSelectedEntries) => {
        if (prevSelectedEntries.includes(ind)) {
          // Remove the included value from the array
          return prevSelectedEntries.filter((entry) => entry !== ind);
        } else {
          // Add the value to the array
          return [...prevSelectedEntries, ind];
        }
      });
    }
  };

  const trainableBundles = bundleArray.filter((entry) => [2,3].includes(entry.status.code));
  const trainableBundleIds = trainableBundles.map((entry) => entry.id);

  const removeBundle = async (id: number) => {
    const userConfirmed = window.confirm("Are you sure you want to delete this bundle?");

    // If the user clicks "OK", proceed with deletion logic
    if (userConfirmed) {
      const bundleLoader = new BundleRequest();
      const success = await bundleLoader.deleteBundle(id);

      console.log(`Delete ${id} with`, success);
      if (success) {
        setBundleArray((prev) => prev.filter(elm => elm.id !== id));
      }
    }
  };


  return (
      <ContentWrapper>
        <div className={'flex flex-row flex-nowrap justify-end items-center gap-x-6 pb-6 w-full'}>
          { selectedEntries.length > 0 && (
              <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>
                Selected {selectedEntries.length}/{trainableBundles.length}
              </Typography>
          )}
          { bundleArray.length > 0 && (
              <BaseButton callback={trainBundles} type={ButtonStyle.WARNING}>
                { selectedEntries.length > 0 ? 'Train with selected' : 'Start training'}
              </BaseButton>
          )}
        </div>

        {
          bundleArray.map((elm, indx) => {
            const bgColor = getBgColor(elm.status.code);
            const selected = selectedEntries.includes(elm.id);
            return (
                <Link href={`/project/${projectId}/bundle/${elm.id}`} key={indx}
                      className={`mb-6 custom-box-shadow hover:custom-box-shadow-active transition-all duration-300  rounded-lg 
                                flex flex-row flex-nowrap items-center justify-stretch gap-3 sm:gap-6 md:gap-12
                                w-full h-auto py-4 px-10`}>
                  <div className={'bundle-id table flex-shrink-0 w-28'}>
                    <Typography type={TextTypes.LINE} styles={[TextStyles.BOLD]}>{bundleArray.length - indx}.</Typography>
                    <Typography type={TextTypes.LINE} classNames={'pl-4'}>Bundle</Typography>
                  </div>
                  <div
                      className={'bundle-images flex flex-col md:flex-row flex-nowrap gap-x-4 items-start md:items-center'}>
                    <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}
                                classNames={'block whitespace-nowrap w-20'}>{elm.images.length} Images</Typography>
                    <div className={'hidden xl:flex flex-row flex-nowrap gap-0'}>
                      {
                        elm.images.map((img, ind) => {
                          if (ind > 4) return;
                          return (
                              <img src={img.thump} key={ind}
                                   className={'!w-12 !h-12 block transition-all object-cover bg-lightGray hover:scale-125 rounded-sm hover:rounded-md'}
                                   alt={`Preview image: bundle #${indx + 1}`}/>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className={'bundle-date hidden lg:table'}>
                    <Typography type={TextTypes.LINE} classNames={'block'}
                                styles={[TextStyles.SMALL, TextStyles.BOLD]}>{formatDate(elm.uploaded)}</Typography>
                    <Typography type={TextTypes.LINE} classNames={'block'}
                                styles={[TextStyles.SMALL]}>{formatTime(elm.uploaded)}</Typography>
                  </div>

                  { trainableBundleIds.includes(elm.id) && (
                      <div className={`bundle-selector group !cursor-pointer ml-auto flex flex-row flex-nowrap items-center gap-3 px-3 py-2 rounded-full border-2
                      transition-all duration-300
                      ${selected ? 'border-orange hover:border-lightOrange font-medium' : ' border-lightGray hover:border-gray'}`}
                           onClick={(ev) => toggleBundleSelection(ev, elm.id)}>
                        <label htmlFor={`checkSelect`} className={`transition-all duration-300 ${selected ? 'text-orange group-hover:text-lightOrange':'text-lightGray group-hover:text-gray'}`}>
                          {selected ? 'Selected' : 'Select'}
                        </label>
                        <IconContainer children={ selected ? checkIcon() : crossIcon()} classNames={`transition-all duration-300 ${selected?'text-orange group-hover:text-lightOrange':'text-lightGray group-hover:text-gray'}`}/>
                      </div>
                  )}

                  <IconTextContainer bigText={false} title={'delete'}
                                     classNames={'text-[#f00] hover:underline'} callback={() => removeBundle(elm.id)}>
                    {failIcon()}
                  </IconTextContainer>

                  <div className={`${!trainableBundleIds.includes(elm.id) ? 'ml-auto' : ''} w-36 flex-grow-0 flex-shrink-0`}>
                    <div className={`bundle-status w-auto table float-right rounded-full px-4 py-2 border-2 border-${bgColor} text-${bgColor}`}>
                      {elm.status.value}
                    </div>
                  </div>
                </Link>
            )
          })
        }
      </ContentWrapper>
  )
}

export default BundleList;