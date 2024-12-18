"use client";
import { useState, useEffect, FormEvent } from 'react';
import { Event as EventModel} from '../../models/event'
import {remult} from "remult";
import { useSession, signIn, signOut } from "next-auth/react";

const taskRepo = remult.repo(EventModel)

export default function Event() {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") signIn()
    else if (session.status === "authenticated")
      return taskRepo.liveQuery({
        orderBy: {
          createdAt: 'desc'
        },
        where: {
          lunchTime: undefined,
        }
      }).subscribe((info: any) => setEvents(info.applyChanges));
    }, [session]);

  async function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const eventTitle = await taskRepo.insert({ eventName: newEventTitle });
      setEvents([...events, eventTitle]);
      setNewEventTitle("");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function deleteEvent(event: EventModel) {
    try {
      await taskRepo.delete(event);
      setEvents(events.filter(t => t.id !== event.id));
    } catch (error: any) {
      alert(error.message);
    }
  }

//if (session.status === "unauthenticated") return <> </>
return (
  <div>
    <h1>Events {events.length}</h1>
    <main>
      <form onSubmit={addEvent}>
        <input
          value={newEventTitle}
          placeholder="Event Name"
          onChange={e => setNewEventTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <div className="event-list">
        {events.map(event => (
          <div key={event.id} className="event-item">
            <span>{event.eventName}</span>
            <button onClick={() => deleteEvent(event)}>Delete</button>
          </div>
        ))}
      </div>
    </main>
  </div>
);
}
