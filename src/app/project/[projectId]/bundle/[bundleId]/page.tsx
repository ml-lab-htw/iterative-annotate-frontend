import BreadCrumb, {BreadCrumbEntry} from "@/components/_layout/BreadCrumb";
import Navigation from "@/components/_layout/Navigation";
import React from "react";
import ReviewManager from "@/app/project/[projectId]/bundle/[bundleId]/reviewUi";
import {BundleRequest} from "@/modules/api/bundle";
import {ProjectRequest} from "@/modules/api/project";

const BundleReview = async ({params}: { params: { projectId: number, bundleId: number } }) => {
  const currentProjectId = params.projectId;
  const currentBundleId = params.bundleId;

  const breadCrumbEntries = [
    {
      title: "All projects",
      path: '/'
    },
    {
      title: "Project #" + currentProjectId,
      path: '/project/' + currentProjectId
    },
    {
      title: "Bundle #"+ currentBundleId,
      path: false
    }
  ] as BreadCrumbEntry[];

  const projectLoader = new ProjectRequest();
  const project = await projectLoader.getProject(currentProjectId);


  const bundleLoader = new BundleRequest();
  const review = await bundleLoader.getBundle(currentBundleId);

  return (
      <>
        <Navigation>Review: {project.name}</Navigation>

        <main className="w-full min-h-screen py-12">
          <BreadCrumb entries={breadCrumbEntries}/>

          <ReviewManager projectId={currentProjectId} bundleId={currentBundleId} data={review}/>
        </main>
      </>
  )
}

export default BundleReview;