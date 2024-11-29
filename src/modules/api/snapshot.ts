import {fetchData} from "@/modules/restClient";

export class SnapshotRequest {

  apiPrefix = 'snapshot';

  async listSnapshots(projectId: number):Promise<ISnapshot[]>{
    'use server'
    return new Promise((resolve, reject) => {
      const bodyData = {
        'project_id' :projectId
      }
      fetchData(`${this.apiPrefix}/list`, 'POST', bodyData)
          .then(responseData => {
            resolve(responseData as ISnapshot[]);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async removeSnapshot(snapshotId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const bodyData = {
        'snapshot_id' : snapshotId
      }
      fetchData(`${this.apiPrefix}/delete`, 'POST', bodyData)
          .then(responseBool => {
            resolve(responseBool as boolean);
          })
          .catch(error => {
            reject(error);
          });
    });
  }
}
