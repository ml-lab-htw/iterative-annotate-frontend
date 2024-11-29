import React from "react";
import Navigation from "@/components/_layout/Navigation";
import ContentWrapper from "@/components/_layout/ContentWrapper";
import BreadCrumb, {BreadCrumbEntry} from "@/components/_layout/BreadCrumb";
import BaseButton, {ButtonStyle} from "@/components/_default/BaseButton";
import HeadAndText from "@/components/_default/HeadAndText";
import DropDown from "@/components/_default/DropDown";
import UploadBundleFormular from "@/app/project/[projectId]/upload/formular";
import {ProjectRequest} from "@/modules/api/project";
import {SnapshotRequest} from "@/modules/api/snapshot";

const UploadToProject = async ({params}: { params: { projectId: number } }) => {
  const currentProjectId = params.projectId;

  // Load project information
  const projectLoader = new ProjectRequest();
  const project = await projectLoader.getProject(currentProjectId);

  // load previous snapshots
  const snapshotLoader = new SnapshotRequest();
  const allProjectSnapshots = (await snapshotLoader.listSnapshots(currentProjectId)).filter((elm) => {
    return elm.status.code === 3;
  });

  const breadCrumbEntries = [
    {
      title: "All projects",
      path: '/'
    },
    {
      title: "Project #" + currentProjectId,
      path: '/project/'+currentProjectId
    },
    {
      title: "Upload images",
      path: false
    }
  ] as BreadCrumbEntry[];

  return (
      <>
        <Navigation>Upload bundle: {project.name}</Navigation>

        <main className="w-full min-h-screen py-12">
          <BreadCrumb entries={breadCrumbEntries} classNames={'mb-16'} />

          <ContentWrapper>
            <HeadAndText
                headline={"Upload images as bundle"}
                text={"You can upload a bundle of images to this project. After the upload, all new images will be processed in the background with the object detection model snapshot you selected below."} />
          </ContentWrapper>

          <UploadBundleFormular projectId={currentProjectId} snapshots={allProjectSnapshots}/>
        </main>
      </>
  );
}

export default UploadToProject;