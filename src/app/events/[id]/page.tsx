// src/app/events/[id]/page.tsx
"use client";
import { useState, useEffect, FormEvent } from 'react';
import { Event as EventModel } from '../../../models/event';
import { remult } from "remult";
import { useRouter } from 'next/navigation';
import React from 'react';

const eventRepo = remult.repo(EventModel);

export default function EventEditPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<EventModel | null>(null);
  const router = useRouter();

  const params = React.use(paramsPromise);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const fetchedEvent = await eventRepo.findOne({
          where: { id: params.id }
        });
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        }
      } catch (error: any) {
        console.error('Error fetching event:', error.message);
      }
    }

    fetchEvent();
  }, [params.id]);

  async function updateEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (event) {
      try {
        await eventRepo.save(event);
        router.push('/');
      } catch (error: any) {
        console.error('Error updating event:', error.message);
      }
    }
  }

  function handleChange(field: keyof EventModel, value: EventModel[keyof EventModel]) {
    if (event) {
      setEvent(prevEvent => {
        if (prevEvent) {
          return { ...prevEvent, [field]: value, sendNotification: prevEvent.sendNotification };
        }
        return null;
      });
    }
  }

  if (!event) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={updateEvent}>
        <div className="mb-4">
          <label htmlFor="eventName" className="block text-gray-700 font-bold mb-2">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={event.eventName}
            onChange={e => handleChange('eventName', e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="eventDate" className="block text-gray-700 font-bold mb-2">
            Event Date
          </label>
          <input
            type="date"
            id="eventDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={event.eventDate}
            onChange={e => handleChange('eventDate', e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="eventLocation" className="block text-gray-700 font-bold mb-2">
            Event Location
          </label>
          <input
            type="text"
            id="eventLocation"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={event.eventLocation}
            onChange={e => handleChange('eventLocation', e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberOfAttendees" className="block text-gray-700 font-bold mb-2">
            Number of Attendees
          </label>
          <input
            type="number"
            id="numberOfAttendees"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={event.numberOfAttendees}
            onChange={e => handleChange('numberOfAttendees', Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}