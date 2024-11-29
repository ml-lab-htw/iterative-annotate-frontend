'use client';
import * as React from 'react';
import Typography, {TextStyles, TextTypes} from "@/components/_default/Typography";
import {formatDate, formatTime} from "@/modules/timeDisplay";
import LossDisplay from "@/app/project/[projectId]/snapshot/lossDisplay";
import {crossIcon, IconTextContainer} from "@/components/icons";
import {SnapshotRequest} from "@/modules/api/snapshot";
import {useEffect, useRef, useState} from "react";

type Props = {
  snapshotList: ISnapshot[];
  projectId: number;
}

const SnapshotList: React.FC<Props> = (
    {snapshotList, projectId}
) => {

  // static helper functions
  const getBgColor = (code:number):string =>  {
    switch (code) {
      case 2:
        // fine-tune
        return 'blue';
      case 3:
        // completed
        return 'orange';
      default:
        // created
        return 'gray';
    }
  }

  const orderById = (snapshots: ISnapshot[]) => {
    return snapshots.sort((a, b) => b.id - a.id);
  }

  const [snaps, setSnaps] = useState<ISnapshot[]>(orderById(snapshotList));
  const tm = useRef<null|NodeJS.Timeout>(null);

  // logic methods
  const removeSnapshotEntry = async (snapshotId: number) => {
    const snapshotLoader = new SnapshotRequest();
    await snapshotLoader.removeSnapshot(snapshotId)

    const snapsCopy: ISnapshot[] = [];
    for(let x in snaps){
      const snap = snaps[x];
      if(snap.id != snapshotId) snapsCopy.push(snaps[x]);
    }
    setSnaps(snapsCopy);
    console.log(`Snapshot with id ${snapshotId} removed`);
  }

  const checkRunningStatus = (snapshots: ISnapshot[]) => {
    return snapshots.some(snap => [1, 2].includes(snap.status.code));
  }

  const pingFunction = async (): Promise<void> => {
    // update data
    return new Promise(async (resolve,reject) => {
      try{
        const snapshotLoader = new SnapshotRequest();
        const newSnapshots = await snapshotLoader.listSnapshots(projectId);
        setSnaps(orderById(newSnapshots));
        resolve();
      } catch (e: any) {
        reject();
      }
    })
  }

  const endThePing = (snapshotList: ISnapshot[]) => {
    const trainingRunning = checkRunningStatus(snapshotList);
    if (tm.current !== null) {

      // -> return if ping should not be ended yet
      if ( trainingRunning ) return;

      //  -> Ping function can be removed
      clearInterval(tm.current);
      tm.current = null;

    } // else if( trainingRunning ) {
      // console.error("-> No ping set");
    // }
  }

  useEffect(() => {
    // Start Ping if needed
    if (checkRunningStatus(snapshotList) && tm.current === null) {
      console.log("Start ping");
      tm.current = setInterval(() => {
        pingFunction().then(()=>{console.log("Ping executed")}).catch(err=>console.log(err))
      }, 2500);
    }

    // Cleanup function
    return () => {
      endThePing(snapshotList);
    };
  }, [snapshotList]); // Only re-run this effect if snapshotList changes

  useEffect(() => {
    endThePing(snaps);
  }, [snaps]); // Only re-run this when snaps changes

  return (
      <table className={'w-full table-static border-collapse'} border={2}>
        <thead>
        <tr className={'[&>th]:pb-3 text-left text-lightBlue'}>
          <th className={'w-64'}>
            <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Name</Typography>
          </th>
          <th className={'w-64'}>
            <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Created</Typography>
          </th>
          <th className={'w-32'}>
            <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Info</Typography>
          </th>
          <th className={'min-w-32'}>
            <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Training</Typography>
          </th>
          <th className={'text-right'}>
            <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Action</Typography>
          </th>
          <th className={'text-right w-60'}>
            <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]}>Status</Typography>
          </th>
        </tr>
        </thead>
        <tbody>
        {snaps.length > 0 && snaps.map((snapshot, ind) => {
          const totalImages = snapshot.bundles.reduce((acc, elm) => acc + elm.image_count, 0);
          const bgColor = getBgColor(snapshot.status.code);

          return (
              <React.Fragment key={snapshot.id}>
                <tr
                    className={'[&>td]:align-top [&>td]:py-3 [&>td]:border-gray [&>td]:border-t-2'}>
                  <td>
                    <Typography type={TextTypes.LINE}
                                styles={[TextStyles.SMALL, TextStyles.BOLD]}>{snapshot.name}</Typography>
                  </td>
                  <td className={'text-gray'}>
                    <Typography type={TextTypes.LINE} styles={[TextStyles.BOLD, TextStyles.SMALL]}
                                classNames={'block'}>
                      {formatDate(snapshot.created)}
                    </Typography>
                    <Typography type={TextTypes.LINE} styles={[TextStyles.SMALL]} classNames={'block'}>
                      {formatTime(snapshot.created)}
                    </Typography>
                  </td>
                  <td>
                    <Typography classNames={'block text-blue'} type={TextTypes.LINE} styles={[TextStyles.SMALL]}>
                      {snapshot.bundles.length} bundle{snapshot.bundles.length == 1 ? '' : 's'}
                    </Typography>
                    <Typography classNames={'block text-orange'} type={TextTypes.LINE} styles={[TextStyles.SMALL]}>
                      {totalImages} image{totalImages == 1 ? '' : 's'}
                    </Typography>
                  </td>
                  <td>
                    {
                        (snapshot.status.code && [2, 3].includes(snapshot.status.code)) && (
                            <Typography classNames={'block text-gray'} type={TextTypes.LINE} styles={[TextStyles.SMALL]}>
                              {snapshot.info.loss.length} epochs <br/>
                              {snapshot.info.learning_rate} learning rate <br/>
                              {snapshot.info.batch_size} batch size
                            </Typography>
                        )}
                  </td>
                  <td>
                    {
                        (snapshot.status.code && ![1].includes(snapshot.status.code))&&(
                            <IconTextContainer classNames={'text-lightOrange hover:text-orange float-right'} title={"Remove snapshot"} callback={
                              () => {removeSnapshotEntry(snapshot.id)}
                            }>
                              {crossIcon()}
                            </IconTextContainer>
                        )
                    }
                  </td>
                  <td className={'text-right'}>
                    <Typography
                        classNames={`bundle-status inline whitespace-nowrap rounded-full px-4 py-2 border-2 border-${bgColor} text-${bgColor}`}
                        type={TextTypes.LINE}
                        styles={[TextStyles.SMALL, TextStyles.BOLD]}>{snapshot.status.value}</Typography>
                  </td>
                </tr>
                {
                  (snapshot.status.code && [2, 3].includes(snapshot.status.code)) && (
                        <tr>
                          <td colSpan={6}>
                            <LossDisplay isGenerating={snapshot.status.code == 2} lossArray={snapshot.info.loss}/>
                          </td>
                        </tr>
                    )
                }
              </React.Fragment>
          )
        })}
        </tbody>
      </table>
  )
}

export default SnapshotList;