import { Timestamp } from "rxjs";

export interface Song{
    title: string,
    content: string,
    author: string,
    type: string,
    docid:number,
    updatedDate: number,
    deleted: boolean
  }