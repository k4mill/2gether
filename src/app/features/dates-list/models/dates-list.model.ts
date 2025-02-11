export interface BinResponse {
  record: DateEvent[];
  metadata: any;
}

export interface DateEvent {
  id: number;
  title: string;
  description: string;
  categories: Category[];
  dateAdded: Date;
  dateOfCompletion: Date;
  completed: boolean;
}

export enum Category {
  Romantic = 0,
  FoodAndDrink = 1,
  CreativeArtistic = 2,
  Active = 3,
  CultureEducation = 4,
  AtHome = 5,
  Seasonal = 6,
  EntertainmentSilly = 7,
}

export interface CategoryOption {
  label: string;
  value: Category;
}
