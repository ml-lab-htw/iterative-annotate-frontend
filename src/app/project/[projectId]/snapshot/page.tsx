import * as React from 'react';
import BreadCrumb, {BreadCrumbEntry} from "@/components/_layout/BreadCrumb";
import Navigation from "@/components/_layout/Navigation";
import ContentWrapper from "@/components/_layout/ContentWrapper";
import HeadAndText from "@/components/_default/HeadAndText";
import {SnapshotRequest} from "@/modules/api/snapshot";
import {ProjectRequest} from "@/modules/api/project";
import BaseButton, {ButtonStyle} from "@/components/_default/BaseButton";
import SnapshotList from "@/app/project/[projectId]/snapshot/snapshotList";


const SnapshotOverview = async ({params}: { params: { projectId: number } }) => {
  const currentProjectId = params.projectId;

  const projectLoader = new ProjectRequest();
  const project = await projectLoader.getProject(currentProjectId);

  const breadCrumbEntries = [
    {
      title: "All projects",
      path: '/'
    },
    {
      title: `Project #${project.id}`,
      path: '/project/'+currentProjectId
    },
    {
      title: "All snapshots",
      path: false
    }
  ] as BreadCrumbEntry[];


  const snapshotLoader = new SnapshotRequest();
  const snapshots = await snapshotLoader.listSnapshots(currentProjectId);

  return (
      <>
        <Navigation>Snapshots: {project.name}</Navigation>

        <main className="w-full min-h-screen py-12">
          <BreadCrumb entries={breadCrumbEntries} classNames={'mb-16'} />
          <ContentWrapper>
            <HeadAndText
                headline={"Snapshot overview"}
                text={"View and manage all snapshots for this project. Monitor snapshot status, compare different versions, and ensure your model is evolving as expected."} />
            <div className={'flex flex-row flex-nowrap justify-between w-full gap-x-4'}>
              <BaseButton type={ButtonStyle.PRIMARY} path={`/project/${currentProjectId}/upload`}>
                Upload image bundle
              </BaseButton>
              <BaseButton type={ButtonStyle.WARNING} path={`/project/${currentProjectId}/snapshot/new`}>
                Start training
              </BaseButton>
            </div>
          </ContentWrapper>
          {
            snapshots.length > 0 && (
              <ContentWrapper small={false} className={'mt-16'}>
                <SnapshotList snapshotList={snapshots} projectId={currentProjectId} />
              </ContentWrapper>
            )
          }

        </main>
      </>
  )
}

export default SnapshotOverview;