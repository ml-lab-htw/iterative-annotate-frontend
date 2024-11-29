import * as React from 'react';
import Navigation from "@/components/_layout/Navigation";
import ContentWrapper from "@/components/_layout/ContentWrapper";
import BreadCrumb, {BreadCrumbEntry} from "@/components/_layout/BreadCrumb";
import BaseButton, {ButtonStyle} from "@/components/_default/BaseButton";
import HeadAndText from "@/components/_default/HeadAndText";
import {BundleRequest} from "@/modules/api/bundle";
import {ProjectRequest} from "@/modules/api/project";
import BundleList from "@/app/project/[projectId]/bundleList";

const ProjectDetailPage = async ({params}: { params: { projectId: number } }) => {
  const currentProjectId = params.projectId;

  const bundleLoader = new BundleRequest();
  const bundles = await bundleLoader.listBundles(currentProjectId);

  const projectLoader = new ProjectRequest();
  const project = await projectLoader.getProject(currentProjectId);

  const breadCrumbEntries = [
    {
      title: "All projects",
      path: '/'
    },
    {
      title: "Project #"+currentProjectId,
      path: false
    }
  ] as BreadCrumbEntry[];

  return (
      <>
        <Navigation>
          {project.name}
        </Navigation>
        <main className="w-full min-h-screen py-12">
          <BreadCrumb entries={breadCrumbEntries} />

          <ContentWrapper className={'pb-12'}>
            <HeadAndText
                headline={"Project overview"}
                text={"Overview and management of your selected project. Review bundle status, update configurations, and monitor performance metrics to keep your fine-tuning on track."} />

            <div className={'flex flex-row flex-nowrap gap-x-6 w-full'}>
              <BaseButton path={`/project/${currentProjectId}/upload`}>Upload image bundle</BaseButton>
              <BaseButton path={`/project/${currentProjectId}/edit`} outline={true}>Edit project</BaseButton>
              <BaseButton path={`/project/${currentProjectId}/snapshot`} type={ButtonStyle.WARNING} outline={true} classNames={'ml-auto'}>
                All snapshots
              </BaseButton>
            </div>
           </ContentWrapper>

          <BundleList bundles={bundles} projectId={currentProjectId} />
        </main>
      </>
  );
}

export default ProjectDetailPage;