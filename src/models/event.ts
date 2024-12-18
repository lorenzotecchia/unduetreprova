import {Allow, Entity, Fields} from "remult";

@Entity("Event", {
    allowApiCrud: Allow.authenticated,
})

export class Event{
    @Fields.cuid()
    id= '';
    @Fields.string<Event>({
        validate: event => { 
            if (event.eventName.length < 3)
            throw Error("Too short");
        }}
    )
    eventName= '';
    @Fields.string()
    eventDate= '';
    @Fields.boolean()
    lunchTime = false;
    @Fields.string()
    eventLocation= '';
    @Fields.number()
    numberOfAttendees= 0;
    @Fields.createdAt()
    createdAt = new Date();
}
