import { User } from "../user/userTypes";

export interface book {
     _id:string,
     title:string,
     author:User,
     genre:string,
     coverImg:string,
     file:string,
     createdAt:Date,
     updatedAt:Date
}