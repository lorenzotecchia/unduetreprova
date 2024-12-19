import { Allow, Entity, Fields } from "remult";

@Entity("Notification", {
  allowApiCrud: Allow.authenticated,
})
export class Notification {
  @Fields.cuid()
  id = "";
  @Fields.string()
  notificationName= "";
  @Fields.string()
  notificationDate = "";
  @Fields.boolean()
  lunchTime = false;
  @Fields.createdAt()
  createdAt = new Date();
}