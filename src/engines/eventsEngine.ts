import { BSDate, PersonalEvent } from '../types';

const STORAGE_KEY = 'namro_smart_patro_personal_events';

export const DEFAULT_SAMPLE_EVENTS: PersonalEvent[] = [
  {
    id: 'evt-1',
    title: 'आमाको जन्मदिन (Birthday)',
    description: 'आमाको दीर्घायु तथा स्वास्थ्यको लागि शुभकामना तथा उपहार।',
    bsDate: { year: 2083, month: 5, day: 15 },
    time: '08:00 AM',
    category: 'birthday',
    repeat: 'yearly_bs',
    notify: true,
    color: '#ec4899', // pink
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-2',
    title: 'सत्यनारायण पूजा तथा भजन',
    description: 'घरमा सत्यनारायण कथा, पञ्चामृत तथा ब्राह्मण भोजन।',
    bsDate: { year: 2083, month: 5, day: 20 },
    time: '09:30 AM',
    category: 'puja',
    repeat: 'none',
    notify: true,
    color: '#f59e0b', // amber
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-3',
    title: 'घरभाडा तथा बिजुली महसुल भुक्तानी',
    description: 'प्रत्येक महिनाको १ गते नियमित भुक्तानी।',
    bsDate: { year: 2083, month: 6, day: 1 },
    time: '10:00 AM',
    category: 'reminder',
    repeat: 'monthly_bs',
    notify: true,
    color: '#3b82f6', // blue
    createdAt: new Date().toISOString(),
  },
];

export function getStoredEvents(): PersonalEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_EVENTS));
      return DEFAULT_SAMPLE_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SAMPLE_EVENTS;
  }
}

export function saveStoredEvents(events: PersonalEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events to localStorage', err);
  }
}

export function getEventsForBSDate(bsDate: BSDate, allEvents: PersonalEvent[]): PersonalEvent[] {
  return allEvents.filter((evt) => {
    if (evt.repeat === 'none') {
      return evt.bsDate.year === bsDate.year && evt.bsDate.month === bsDate.month && evt.bsDate.day === bsDate.day;
    }
    if (evt.repeat === 'yearly_bs') {
      return evt.bsDate.month === bsDate.month && evt.bsDate.day === bsDate.day;
    }
    if (evt.repeat === 'monthly_bs') {
      return evt.bsDate.day === bsDate.day;
    }
    return false;
  });
}
