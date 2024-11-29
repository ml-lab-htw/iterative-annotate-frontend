import {fetchData} from "@/modules/restClient";

interface trainBody {
  snapshot_name: string;
  bundle_ids: number[];
  base_snapshot_id?: number;
  batch_size?: number;
  epochs?: number;
  learning_rate?: number;
}

export class TrainRequest {

  apiPrefix = 'train';

  async startTraining(snapshotName: string, bundleIdArr: number[], baseSnapshotId: number, settings: any):Promise<IStartSnapshot>{
    'use server'
    return new Promise((resolve, reject) => {
      let bodyData = {
        snapshot_name :snapshotName,
        bundle_ids : bundleIdArr,
        ...settings
      } as trainBody;

      if(baseSnapshotId >= 0){
        bodyData.base_snapshot_id = baseSnapshotId;
      }

      fetchData(`${this.apiPrefix}/bundles`, 'POST', bodyData)
          .then(responseData => {
            resolve(responseData as IStartSnapshot);
          })
          .catch(error => {
            reject(error);
          });
    });
  }
}
