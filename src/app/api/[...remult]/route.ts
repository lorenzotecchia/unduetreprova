import { remultNextApp } from "remult/remult-next";
import { createPostgresDataProvider } from "remult/postgres";
import { Event } from "@/models/event";
import { User } from "@/models/user";
import { Notification } from "@/models/notification";
import { getUserOnServer } from "../../../app/utils/authOptions"

const api = remultNextApp({
	entities: [Event, Notification, User],
	//admin: true,
	getUser: getUserOnServer,
	dataProvider: createPostgresDataProvider({
		connectionString: process.env["DATABASE_URL"] || process.env["DATABASE_URL_LOCAL"],
		configuration: {
			ssl: Boolean(process.env["DATABASE_URL"]),
		},
	}),

});

export const { GET, POST, PUT, DELETE } = api;
