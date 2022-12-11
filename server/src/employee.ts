import * as mongodb from "mongodb";

export interface Employee {
    name: string;
    age: string;
    slot: "junior" | "mid" | "senior";
    _id?: mongodb.ObjectId;
}
