// src/models/notification.ts
import { Allow, Entity, Fields, Relations } from "remult";
import { Event } from "./event";
import { User } from "./user";

@Entity("notifications", {
  allowApiCrud: Allow.authenticated
})
export class Notification {
  @Fields.cuid()
  id = "";

  @Fields.string()
  message = "";

  @Fields.string()
  userId = "";

  @Fields.string()
  eventId = "";

  @Fields.boolean()
  read = false;

  @Fields.createdAt()
  createdAt = new Date();

  @Relations.toOne(() => Event, { field: "eventId" })
  event?: Event;

  @Relations.toOne(() => User, { field: "userId" })
  user?: User;
}