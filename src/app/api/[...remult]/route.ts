import   {remultNextApp} from "remult/remult-next";
import { createPostgresDataProvider } from "remult/postgres";

import { Event } from "@/models/event";

const api = remultNextApp({
    entities: [Event],
    dataProvider: createPostgresDataProvider({
        connectionString: process.env["DATABASE_URL"],
    }),
});

export const {GET, POST, PUT, DELETE} = api;