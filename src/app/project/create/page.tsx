import React from "react";
import Navigation from "@/components/_layout/Navigation";
import ContentWrapper from "@/components/_layout/ContentWrapper";
import BreadCrumb, {BreadCrumbEntry} from "@/components/_layout/BreadCrumb";
import HeadAndText from "@/components/_default/HeadAndText";
import ProjectCreateForm from "@/app/project/create/formular";

const CreateProject: React.FC = () => {
  const breadCrumbEntries = [
    {
      title: "All projects",
      path: '/'
    },
    {
      title: "New project",
      path: false
    }
  ] as BreadCrumbEntry[];

  return (
      <>
        <Navigation>Create a new project</Navigation>

        <main className="w-full min-h-screen py-12">
          <BreadCrumb entries={breadCrumbEntries} />

          <ContentWrapper>
            <HeadAndText
                headline={"Create a new project"}
                text={"Set up a new model training project from scratch. Define project parameters, select data sources, and configure initial settings to kickstart your model development journey."}/>
          </ContentWrapper>

          <ProjectCreateForm />
        </main>
      </>
  );
}

export default CreateProject;