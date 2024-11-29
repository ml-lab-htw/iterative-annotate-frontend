import * as React from 'react';
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import Link from "next/link";
import {formatDate, formatTime} from "@/modules/timeDisplay";

type Props = {
  classNames?: string;
  project: IProject
}
const ProjectCard: React.FC<Props> = (
    {classNames = '', project}
) => {
  return (
      <Link href={`/project/${project.id}`}
            className={
              `p-12 rounded-md custom-box-shadow text-black  ${classNames}
                      transition-all duration-300 group flex flex-col flex-nowrap
                      hover:custom-box-shadow-active`
            }>
        <div
            className={'flex flex-row flex-nowrap justify-between items-center gap-x-4 w-full pb-2 mb-2 border-b-[1px] border-lightBlue'}>
          <Typography type={TextTypes.H3}>{project.name}</Typography>
          <div className={'table text-right'}>
            <Typography type={TextTypes.LINE} classNames={'block transition-all duration-300 group-hover:text-blue'}
                        styles={[TextStyles.SMALL, TextStyles.BOLD]}>{formatDate(project.created)}</Typography>
            <Typography type={TextTypes.LINE} classNames={'block'}
                        styles={[TextStyles.SMALL]}>{formatTime(project.created)}</Typography>
          </div>
        </div>
        <Typography type={TextTypes.BODY} styles={[TextStyles.SMALL]}
                    classNames={'pb-8'}>{project.description}</Typography>
        <div className={'flex flex-row flex-nowrap justify-end gap-4 items-center mt-auto'}>
          <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>CNN model:</Typography>
          <Typography type={TextTypes.LINE} classNames={'text-blue'}
                      styles={[TextStyles.SMALL, TextStyles.MEDIUM]}>{project.model}</Typography>
        </div>

        <div className={'flex flex-row flex-wrap justify-end gap-2 items-center mt-4'}>
          <Typography type={TextTypes.LINE} classNames={'px-4 py-1.5 whitespace-nowrap rounded-full transition-background duration-300 text-white bg-lightBlue group-hover:bg-blue'} styles={[TextStyles.SMALL]}>{project.info?.bundle_count} Bundle{project.info?.bundle_count !== 1 && 's'}</Typography>
          <Typography type={TextTypes.LINE} classNames={'px-4 py-1.5 whitespace-nowrap rounded-full transition-background duration-300 text-white bg-lightPink group-hover:bg-pink'} styles={[TextStyles.SMALL]}>{project.info?.image_count} Image{project.info?.image_count !== 1 && 's'}</Typography>
          <Typography type={TextTypes.LINE} classNames={'px-4 py-1.5 whitespace-nowrap rounded-full transition-background duration-300 text-white bg-lightOrange group-hover:bg-orange'} styles={[TextStyles.SMALL]}>{project.info?.snapshot_count} Snapshot{project.info?.snapshot_count !== 1 && 's'}</Typography>
        </div>
      </Link>
  )
}

export default ProjectCard;