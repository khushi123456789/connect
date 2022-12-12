import * as mongodb from "mongodb";
import { Employee } from "./employee";

export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackExample");
    await applySchemaValidation(db);

    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "age", "slot","start_date","fees"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                age: {
                    bsonType: "string",
                    description: "'age' is required and is a string",
                    minLength: 5
                },
                slot: {
                    bsonType: "string",
                    description: "'slot' is required and is one of '6-7 AM', '7-8 AM', or '8-9 AM','5-6 PM'",
                    enum: ["6-7 AM", "7-8 AM", "8-9 AM","5-6 PM"],
                },
                start_date:{},
                fees: {
                    bsonType: "string",
                    description: "'age' is required and is a string",
                    minLength: 5
                },
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it 
   await db.command({
        collMod: "employees",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("employees", {validator: jsonSchema});
        }
    });
}
