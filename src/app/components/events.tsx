// src/app/components/events.tsx
"use client";
import { useState, useEffect, FormEvent } from 'react';
import { Event as EventModel} from '../../models/event'
import {remult, UserInfo} from "remult";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

const taskRepo = remult.repo(EventModel);

export default function Event() {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    remult.user = session.data?.user as UserInfo;
    if (session.status === "unauthenticated") signIn();
    else if (session.status === "authenticated")
      return taskRepo.liveQuery({
        orderBy: {
          createdAt: 'desc'
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

  function handleEventClick(event: EventModel) {
    router.push(`/events/${event.id}`);
  }

  if (session.status === "unauthenticated") return <> </>;
  
  return (
    <div>
      <h1>Events {events.length}</h1>
      <main>
        <div>
          <span>Hello {remult.user?.name}</span>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
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
            <div key={event.id} className="event-item" onClick={() => handleEventClick(event)}>
              <h2>{event.eventName}</h2>
              <p>{new Date(event.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}