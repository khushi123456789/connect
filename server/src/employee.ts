import * as mongodb from "mongodb";

export interface Employee {
    name: string;
    age: string;
    slot: "6-7 AM" | "7-8 AM" | "8-9 AM" |"5-6 PM";
    start_date?: Date;
   fees?:number;
    _id?: mongodb.ObjectId;
}
