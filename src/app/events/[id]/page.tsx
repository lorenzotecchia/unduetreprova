// src/app/events/[id]/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { Event as EventModel } from '../../../models/event';
import { remult } from "remult";
import { useRouter } from 'next/navigation';

const eventRepo = remult.repo(EventModel);

export default function EventEditPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<EventModel | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const fetchedEvent = await eventRepo.findOne({
          where: { id: params.id }
        });
        if (fetchedEvent) {
          setEvent(fetchedEvent);
          setMarkdownContent(fetchedEvent.eventName);
        }
      } catch (error: any) {
        console.error('Error fetching event:', error.message);
      }
    }

    fetchEvent();
  }, [params.id]);

  async function updateEvent() {
    if (event) {
      try {
        event.eventName = markdownContent;
        await eventRepo.save(event);
        router.push('/');
      } catch (error: any) {
        console.error('Error updating event:', error.message);
      }
    }
  }

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Event</h1>
      <textarea
        value={markdownContent}
        onChange={e => setMarkdownContent(e.target.value)}
      />
      <button onClick={updateEvent}>Save</button>
    </div>
  );
}