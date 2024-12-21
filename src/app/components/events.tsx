// src/app/components/events.tsx
"use client";
import { useState, useEffect, FormEvent } from 'react';
import { Event as EventModel} from '../../models/event';
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

  const isMaitre = remult.user?.roles?.includes('maitre');

  if (session.status === "unauthenticated") return <> </>;
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Events ({events.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <div key={event.id} className="bg-white shadow-md rounded-lg p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105" onClick={() => handleEventClick(event)}>
            <h2 className="text-xl font-semibold mb-2">{event.eventName}</h2>
            <p className="text-gray-600 mb-4">{event.eventLocation}</p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{new Date(event.eventDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">{event.numberOfAttendees} attendees</p>
            </div>
          </div>
        ))}
      </div>
      {isMaitre && (
        <div className="fixed bottom-4 right-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => router.push('/events/new')}
          >
            Add Event
          </button>
        </div>
      )}
    </div>
  );
}