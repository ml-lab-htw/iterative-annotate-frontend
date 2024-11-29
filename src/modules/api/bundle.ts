import {fetchData, fetchFormData} from "@/modules/restClient";

export class BundleRequest {

  apiPrefix = 'bundle';

  async listBundles(projectId:number):Promise<IImageBundleModel[]>{
    'use server'
    return new Promise((resolve, reject) => {
      fetchData(`${this.apiPrefix}/list`, 'POST', {"project_id":projectId})
          .then(responseData => {
            resolve(responseData as IImageBundleModel[]);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async getBundle(bundleId:number):Promise<IAnnotatedImageModel[]>{
    'use server'
    return new Promise((resolve, reject) => {
      fetchData(`${this.apiPrefix}/annotation/get`, 'POST', {"bundle_id":bundleId})
          .then(responseData => {
            resolve(responseData as IAnnotatedImageModel[]);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async deleteBundle(bundleId:number):Promise<boolean>{
    'use server'
    return new Promise((resolve, reject) => {
      fetchData(`${this.apiPrefix}/delete`, 'POST', {"bundle_id":bundleId})
          .then(responseData => {
            resolve(responseData as boolean);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async uploadBundle(projectId:number, imageArr:File[], baseSnapshotId:number, confidenceLevel:number):Promise<IImageBundleModel> {
    'use server'
    return new Promise((resolve, reject) => {

      const formData = new FormData();
      formData.append('project_id', projectId.toString());

      formData.append('inference_confidence_threshold', confidenceLevel.toString());

      imageArr.forEach(file => {
        formData.append('files', file);
      });

      if(baseSnapshotId >= 0){
        formData.append('base_snapshot_id', baseSnapshotId.toString());
      }

      fetchFormData(`${this.apiPrefix}/images/upload`, formData)
          .then(responseData => {
            resolve(responseData as IImageBundleModel);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async reviewImage(imageId:number, annotationsList:IAnnotationModel[]):Promise<IAnnotatedImageModel>{
    'use server'
    return new Promise((resolve, reject) => {
      fetchData(`${this.apiPrefix}/annotation/review`, 'POST', {
        "image_id": imageId,
        "reviewed_annotations" : annotationsList.map(elm => {
          return {
            "id": elm.id,
            "label": elm.label,
            "box": elm.box,
            "edited": elm.edited,
            "active": elm.active
          } as IAnnotationModel

        })
      })
          .then(responseData => {
            resolve({
              "id" : responseData.image_id,
              "annotations" : responseData.reviewed_annotations
            } as IAnnotatedImageModel);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async sendTestInfo(bundleId: number, duration:number, infoData: ITestDataCounter) {
    'use server'
    return new Promise((resolve, reject) => {
      fetchData(`${this.apiPrefix}/test`, 'POST', {
        "bundle_id": bundleId,
        "duration": duration,
        "data" : {
          "box_created_cnt" : infoData.boxCreatedCnt,
          "box_removed_cnt" : infoData.boxRemovedCnt,
          "box_moved_cnt" : infoData.boxMovedCnt,
          "label_updated_cnt" : infoData.labelUpdatedCnt,
          "navigated_img_cnt" : infoData.navigateImgCnt
        }
      })
          .then(_d => {
            resolve(true);
          })
          .catch(error => {
            reject(error);
          });
    });
  }
}