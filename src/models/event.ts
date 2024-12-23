import { Allow, Entity, Fields, Relations, BackendMethod, remult } from "remult";
import { Notification } from "./notification";

@Entity("Event", {
	allowApiCrud: Allow.authenticated,
	allowApiInsert: "maitre",
	allowApiDelete: "maitre",
	allowApiUpdate: "maitre",
})
export class Event {
	@Fields.cuid()
	id = "";

	@Fields.string<Event>({
		validate: (event) => {
			if (event.eventName.length < 3) throw Error("Too short");
		},
	})
	eventName = "";

	@Fields.string()
	eventDate = "";

	@Fields.boolean()
	lunchTime = false;

	@Fields.string()
	eventLocation = "";

	@Fields.number()
	numberOfAttendees = 0;

	@Fields.createdAt()
	createdAt = new Date();

	@Fields.string({
		valueConverter: {
			fieldTypeInDb: 'text'
		}
	})
	description = "";

	@Relations.toMany(() => Notification)
	notifications?: Notification[];

	@Fields.string({ dbName: 'waiters' })
	waiters: string[] = [];

	@BackendMethod({ allowed: true })
	async sendNotification(userIds: string[]) {
		const notificationRepo = remult.repo(Notification);

		for (const userId of userIds) {
			await notificationRepo.insert({
				message: `You've been invited to ${this.eventName}`,
				userId,
				eventId: this.id,
				read: false
			});
		}
	}
}
