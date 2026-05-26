export interface CollectionView {
  [key: string]: string | undefined;
}

export interface PagedCollection<T> {
  [key: string]: any;
  "hydra:member"?: T[];
  "hydra:view"?: CollectionView;
}
