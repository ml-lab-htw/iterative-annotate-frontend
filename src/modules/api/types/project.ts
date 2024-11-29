interface IProjectInfo {
  bundle_count: number;
  image_count: number;
  snapshot_count: number;
}

interface IProject {
  id: number;
  name: string;
  description: string;
  model: string;
  created: string;
  info?: IProjectInfo;
}