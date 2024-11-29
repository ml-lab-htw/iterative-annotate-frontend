import * as React from 'react';
import BreadCrumb, {BreadCrumbEntry} from "@/components/_layout/BreadCrumb";
import Navigation from "@/components/_layout/Navigation";
import SnapshotCreateForm from "@/app/project/[projectId]/snapshot/new/[[...includedBundles]]/formular";
import {ProjectRequest} from "@/modules/api/project";
import {SnapshotRequest} from "@/modules/api/snapshot";
import {BundleRequest} from "@/modules/api/bundle";


const CreateNewSnapshot = async ({params}: { params: { projectId: number, includedBundles: string[] } }) => {
  const currentProjectId = params.projectId;

  const preSelectedBundleIds = !params.includedBundles ? [] : params.includedBundles.map((elm) => parseInt(elm))
  const bundleLoader = new BundleRequest();

  const projectBundles = (await bundleLoader.listBundles(currentProjectId)).filter((elm) => {
    return [2,3].includes(elm.status.code);
  });

  const preSelectedBundles = (preSelectedBundleIds.length > 0) ? projectBundles.filter((elm) => preSelectedBundleIds.includes(elm.id)) : projectBundles;

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
      title: "Project #"+currentProjectId,
      path: '/project/'+currentProjectId
    },
    {
      title: "New snapshot",
      path: false
    }
  ] as BreadCrumbEntry[];

  return (
      <>
        <Navigation>Train: {project.name}</Navigation>

        <main className="w-full min-h-screen py-12">
          <BreadCrumb entries={breadCrumbEntries} classNames={'mb-16'} />

          <SnapshotCreateForm projectId={currentProjectId} snapshots={allProjectSnapshots} selectedBundles={preSelectedBundles} />
        </main>
      </>
  )
}

export default CreateNewSnapshot;