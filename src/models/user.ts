import { Allow, Entity, Fields } from "remult";

@Entity("User", {
  allowApiCrud: Allow.authenticated,
})
export class User {
  @Fields.cuid()
  id = "";
  @Fields.string<User>({
    validate: (user) => {
      if (user.userName.length < 3) throw Error("Too short");
    },
  })
  userName = "";
  @Fields.createdAt()
  createdAt = new Date();
}