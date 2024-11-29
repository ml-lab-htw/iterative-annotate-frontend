import React from "react";
import Navigation from "@/components/_layout/Navigation";
import ContentWrapper from "@/components/_layout/ContentWrapper";
import BreadCrumb, {BreadCrumbEntry} from "@/components/_layout/BreadCrumb";
import HeadAndText from "@/components/_default/HeadAndText";
import ProjectEditForm from "@/app/project/[projectId]/edit/formular";
import {ProjectRequest} from "@/modules/api/project";

const EditProject = async ({params}: { params: { projectId: number } }) => {
  const currentProjectId = params.projectId;

  const projectLoader = new ProjectRequest();
  const project = await projectLoader.getProject(currentProjectId);

  const breadCrumbEntries = [
    {
      title: "All projects",
      path: '/'
    },
    {
      title: "Project #"+currentProjectId,
      path: '/project/'+currentProjectId
    },
    {
      title: "Edit project",
      path: false
    }
  ] as BreadCrumbEntry[];



  return (
      <>
        <Navigation>Edit: {project.name}</Navigation>

        <main className="w-full min-h-screen py-12">
          <BreadCrumb entries={breadCrumbEntries} classNames={'mb-16'} />

          <ContentWrapper>
            <HeadAndText
                headline={"Edit project title and description"}
                text={"Modify the title and description of your project. Update and refine your project scope to align with your objectives."} />
          </ContentWrapper>

          <ProjectEditForm projectId={currentProjectId} preset={{title:project.name, text:project.description}} />
        </main>
      </>
  );
}

export default EditProject;