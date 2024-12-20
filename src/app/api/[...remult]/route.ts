import   {remultNextApp} from "remult/remult-next";
import { createPostgresDataProvider } from "remult/postgres";
import { Event } from "@/models/event";
import { getUserOnServer } from "../auth/[...nextauth]/route";
import { User } from "@/models/user";
import { Notification } from "@/models/notification";

const api = remultNextApp({
    entities: [Event, Notification, User],
    //admin: true,
    getUser: getUserOnServer,
    dataProvider: createPostgresDataProvider({
        connectionString: process.env["DATABASE_URL"],
    }),
});

export const {GET, POST, PUT, DELETE} = api;