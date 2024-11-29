'use client';
import * as React from 'react';
import {useState} from 'react';
import ContentWrapper from "@/components/_layout/ContentWrapper";
import TextInput from "@/components/_default/TextInput";
import BaseButton, {ButtonStyle} from "@/components/_default/BaseButton";
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import Link from "next/link";
import {ProjectRequest} from "@/modules/api/project";
import {useRouter} from "next/navigation";
import {revalidatePath} from "next/cache";

type Props = {
  classNames?: string
  projectId: number,
  preset: IFormData
}

interface IFormData {
  title: string;
  text: string;
}

const ProjectEditForm: React.FC<Props> = (
    {classNames = '', projectId, preset}
) => {


  const [formTitle, setFormTitle] = useState<string>(preset.title);
  const [formText, setFormText] = useState<string>(preset.text);
  const router = useRouter();
  const projectLoader = new ProjectRequest();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const updateProjectData = async () => {
    setBtnLoading(true);

    try {
      await projectLoader.updateProject(projectId, formTitle, formText);
      const returnPath = `/project/${projectId}`;
      router.push(returnPath);
    } catch (e:any){
      setBtnLoading(false);
      console.log(e);
    }
  }

  const removeProject = async () => {
    setBtnLoading(true);

    try{
      await projectLoader.removeProject(projectId);
      router.push('/');

    } catch (e:any){
      setBtnLoading(false);
      console.log(e);
    }

  }

  return (
      <ContentWrapper small={true} className={`pt-16 ${classNames}`}>
        <TextInput label={"Title of the project"} placeholder={'Project xyz'} initValue={preset.title} onChange={setFormTitle} />
        <TextInput isArea={true} label={"Short project description"} placeholder={'This project aims to...'} initValue={preset.text} onChange={setFormText}/>

        <div className={'flex flex-row flex-nowrap w-full justify-between items-center'}>
          <BaseButton callback={removeProject} type={ButtonStyle.WARNING} outline={true} isLoading={btnLoading}>Delete</BaseButton>
          <BaseButton callback={updateProjectData} isLoading={btnLoading}>Save and open</BaseButton>
        </div>
      </ContentWrapper>
  )
}

export default ProjectEditForm;