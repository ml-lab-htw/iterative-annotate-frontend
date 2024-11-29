interface ISnapshot {
  id: number;
  name: string;
  path: string;
  status: ISnapshotStatus;
  info: ISnapshotTraining;
  selected: boolean;
  created: string;
  bundles: IBundleEntry[]
}

interface IBundleEntry {
  id: number;
  created: string;
  image_count:number;
  included?:boolean;
}

interface ISnapshotStatus {
  value: string;
  code: number;
}

interface ISnapshotTraining {
  learning_rate: number;
  batch_size: number;
  loss: number[];
}
