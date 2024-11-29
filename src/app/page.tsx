import React from "react";
import Navigation from "@/components/_layout/Navigation";
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import ContentWrapper from "@/components/_layout/ContentWrapper";
import BaseButton from "@/components/_default/BaseButton";
import BreadCrumb, {BreadCrumbEntry} from "@/components/_layout/BreadCrumb";
import Link from "next/link";
import HeadAndText from "@/components/_default/HeadAndText";
import {ProjectRequest} from "@/modules/api/project";
import ProjectCard from "@/app/projectCard";


const Dashboard: React.FC = async () => {

  const breadCrumbEntries = [
    {
      title: "All projects",
      path: false
    }
  ] as BreadCrumbEntry[];


  const projectLoader = new ProjectRequest();
  const projects = await projectLoader.listProjects();

  return (
    <>
      <Navigation>CNN Object detection model</Navigation>

      <main className="w-full min-h-screen py-12">
        <BreadCrumb entries={breadCrumbEntries} />

        <ContentWrapper className={'pb-12'}>
          <HeadAndText
              headline={"Your Model Projects"}
              text={"Manage and view all your model training projects in one place. Easily access project details and track progress to ensure successful model development."} />

          <BaseButton path={"/project/create"}>Add new project</BaseButton>
        </ContentWrapper>

        <ContentWrapper>
          <div className={'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'}>
            {
              projects.map((elm,indx)=> <ProjectCard project={elm} key={indx} />)
            }
          </div>
        </ContentWrapper>
      </main>
    </>
  );
}

export default Dashboard;