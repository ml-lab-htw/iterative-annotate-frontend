interface ISmallImageModel {
  id: number;
  thump: string;
}

interface IBundleStatusModel {
  value: string;
  code: number;
}

interface IImageBundleModel {
  id: number;
  images: ISmallImageModel[];
  uploaded: Date;
  status: IBundleStatusModel;
}

/* Test Data */
interface ITestData {
  start: number;
  end: null|number;
  data: ITestDataCounter
}

interface ITestDataCounter {
  boxCreatedCnt: number,
  boxRemovedCnt: number,
  labelUpdatedCnt: number,
  boxMovedCnt: number,
  navigateImgCnt: number
}


/* Annotation */
interface IAnnotationBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IAnnotationModel {
  id: number;
  label: string;
  score: number;
  active: boolean;
  edited: boolean;
  box: IAnnotationBox;
}

interface IImagePathModel {
  thumbnail: string;
  transformed: string;
  original: string;
}

interface IAnnotatedImageModel {
  id: number;
  paths?: IImagePathModel;
  annotations: IAnnotationModel[];
}
