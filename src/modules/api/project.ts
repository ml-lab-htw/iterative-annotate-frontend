import {fetchData} from "@/modules/restClient";

export class ProjectRequest {

  apiPrefix = 'project';

  async listProjects():Promise<IProject[]>{
    'use server'
    return new Promise((resolve, reject) => {
      fetchData(`${this.apiPrefix}/list`, 'GET')
          .then(responseData => {
            resolve(responseData as IProject[]);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async createProject(name:string, description: string): Promise<IProject>{
    'use server'
    return new Promise((resolve, reject) => {
      const bodyData = {
        'project_name' : name,
        'description' : description,
        'base_model' : "Single Shot Detection"
      }

      fetchData(`${this.apiPrefix}/create`, 'POST', bodyData)
          .then(responseData => {
            resolve(responseData as IProject);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async updateProject(projectId:number, name:string, description: string): Promise<IProject>{
    'use server'
    return new Promise((resolve, reject) => {
      const bodyData = {
        'project_name' : name,
        'description' : description,
        'project_id' : projectId
      }

      fetchData(`${this.apiPrefix}/edit`, 'POST', bodyData)
          .then(responseBool => {
            resolve(responseBool);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async getProject(projectId: number): Promise<IProject>{
    'use server'
    return new Promise((resolve, reject) => {
      fetchData(`${this.apiPrefix}/info`, 'POST', {'project_id':projectId})
          .then(projectData => {
            resolve(projectData as IProject);
          })
          .catch(error => {
            reject(error);
          });
    });
  }

  async removeProject(projectId: number): Promise<boolean>{
    'use server'
    return new Promise((resolve, reject) => {
      fetchData(`${this.apiPrefix}/delete`, 'POST', {'project_id':projectId})
          .then(_ => {
            resolve(true);
          })
          .catch(error => {
            reject(error);
          });
    });
  }
}