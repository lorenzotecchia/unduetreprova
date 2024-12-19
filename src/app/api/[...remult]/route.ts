import   {remultNextApp} from "remult/remult-next";
import { createPostgresDataProvider } from "remult/postgres";
import { Event } from "@/models/event";
import { getUserOnServer } from "../auth/[...nextauth]/route";

const api = remultNextApp({
    entities: [Event],
    //admin: true,
    getUser: getUserOnServer,
    dataProvider: createPostgresDataProvider({
        connectionString: process.env["DATABASE_URL"],
    }),
});

export const {GET, POST, PUT, DELETE} = api;