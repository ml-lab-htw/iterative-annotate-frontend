import * as React from 'react';
import Link from "next/link";
import {backIcon, nextIcon} from "@/components/icons";
import {next} from "sucrase/dist/types/parser/tokenizer";
import {off} from "next/dist/client/components/react-dev-overlay/pages/bus";
import ContentWrapper from "@/components/_layout/ContentWrapper";

type Props = {
  entries: BreadCrumbEntry[]
  classNames?: string
}

export type BreadCrumbEntry = {
  title: string,
  path: false | string
}

const BreadCrumb: React.FC<Props> = (
    {entries, classNames = ''}
) => {
  return (
      <ContentWrapper className={'mb-24'}>
        <div className={`flex flex-row gap-x-1 gap-y-4 flex-wrap sm:flex-nowrap justify-start items-center ${classNames}`}>
        {
          entries.map((elm, indx) => {
            let elmClass = "px-4 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0 flex-grow-0";
            if(elm.path === false){
              // un clickable link
              elmClass+= " custom-box-shadow-active text-gray cursor-default";
              return (
                <div key={indx} className={'flex flex-row flex-nowrap gap-1 items-center'}>
                  <div className={elmClass}>{elm.title}</div>
                  <div className={'w-6 h-6 block text-gray [&>svg]:w-full [&>svg]:h-full'}>{nextIcon()}</div>
                </div>
              );
            }else{
              elmClass+= " custom-box-shadow hover:custom-box-shadow-active text-blue cursor-pointer";
              return (
                <div key={indx} className={'flex flex-row flex-nowrap gap-1 items-center'}>
                  <Link href={elm.path} className={elmClass}>{elm.title}</Link>
                  <div className={'w-6 h-6 block text-gray [&>svg]:w-full [&>svg]:h-full'}>{nextIcon()}</div>
                </div>
              );
            }
          })
        }
      </div>
      </ContentWrapper>
  );

}

export default BreadCrumb;