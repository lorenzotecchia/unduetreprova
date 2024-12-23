// src/models/user.ts
import { Allow, Entity, Fields } from "remult";

@Entity("users", {
	allowApiCrud: Allow.authenticated
})
export class User {
	@Fields.cuid()
	id = "";

	@Fields.string()
	name = "";

	@Fields.json()
	roles: string[] = [];

	@Fields.createdAt()
	createdAt = new Date();
}
