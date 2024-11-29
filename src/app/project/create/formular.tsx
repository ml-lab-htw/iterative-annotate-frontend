'use client';
import * as React from 'react';
import ContentWrapper from "@/components/_layout/ContentWrapper";
import TextInput from "@/components/_default/TextInput";
import BaseButton from "@/components/_default/BaseButton";
import {useEffect, useState} from "react";
import {ProjectRequest} from "@/modules/api/project";
import {useRouter} from "next/navigation";
import {revalidatePath} from "next/cache";

type Props = {
  classNames?: string
}

const ProjectCreateForm: React.FC<Props> = (
    {classNames = ''}
) => {

  const [formTitle, setFormTitle] = useState<string>('');
  const [formText, setFormText] = useState<string>('');
  const router = useRouter();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);


  const createNewProject = async () => {
    setBtnLoading(true);
    try {
      const projectLoader = new ProjectRequest();
      const projectData = await projectLoader.createProject(formTitle, formText);

      const returnPath = `/project/${projectData.id}`;
      router.push(returnPath);

    } catch (e:any){
      console.log(e);
      setBtnLoading(false);
    }
  }


  return (
      <ContentWrapper small={true} className={`pt-16 ${classNames}`}>
        <TextInput label={"Title of the project"} placeholder={'My project name'} onChange={setFormTitle} />
        <TextInput isArea={true} label={"Short project description"} placeholder={'This project aims to...'} onChange={setFormText} />
        <BaseButton callback={createNewProject} classNames={'ml-auto'} isLoading={btnLoading}>Create and open</BaseButton>
      </ContentWrapper>
  )
}

export default ProjectCreateForm;