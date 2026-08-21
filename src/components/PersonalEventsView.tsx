import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Trash2,
  Bell,
  Clock,
  Tag,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { BSDate, PersonalEvent } from '../types';
import {
  formatBSDateNepali,
  NEPALI_MONTHS,
  toNepaliDigits,
} from '../engines/calendarEngine';
import { saveStoredEvents } from '../engines/eventsEngine';

interface PersonalEventsViewProps {
  events: PersonalEvent[];
  onUpdateEvents: (events: PersonalEvent[]) => void;
  onJumpToDate?: (bsDate: BSDate) => void;
}

export const PersonalEventsView: React.FC<PersonalEventsViewProps> = ({
  events,
  onUpdateEvents,
  onJumpToDate,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(2083);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [time, setTime] = useState('08:00 AM');
  const [category, setCategory] = useState<'birthday' | 'puja' | 'anniversary' | 'reminder' | 'custom'>('puja');
  const [repeat, setRepeat] = useState<'none' | 'yearly_bs' | 'monthly_bs'>('yearly_bs');
  const [color, setColor] = useState('#f59e0b');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: PersonalEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      bsDate: { year, month, day },
      time,
      category,
      repeat,
      notify: true,
      color,
      createdAt: new Date().toISOString(),
    };

    const updated = [newEvent, ...events];
    onUpdateEvents(updated);
    saveStoredEvents(updated);

    // Reset Form
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    onUpdateEvents(updated);
    saveStoredEvents(updated);
  };

  const categoryLabels = {
    birthday: '🎂 जन्मदिन (Birthday)',
    puja: '🪔 पूजा तथा धार्मिक (Puja)',
    anniversary: '💍 वैवाहिक वर्षगाँठ (Anniversary)',
    reminder: '⏰ नियमित रिमाइन्डर (Reminder)',
    custom: '📌 व्यक्तिगत कार्य (Custom)',
  };

  const repeatLabels = {
    none: 'एक पटक मात्र (One time)',
    yearly_bs: 'प्रत्येक वर्ष यही विक्रम संवत् तिथि/गते (Yearly BS)',
    monthly_bs: 'प्रत्येक महिना यही गते (Monthly BS)',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 dark:bg-pink-950/70 text-pink-800 dark:text-pink-300">
              व्यक्तिगत घटना तथा रिमाइन्डर (Personal Events)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
            तपाईंका पूजा, जन्मदिन, वर्षगाँठ तथा महत्त्वपूर्ण साइतहरू
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            विक्रम संवत् गते वा चान्द्र तिथि अनुसार स्वतः दोहोरिने सुरक्षित स्थानीय क्यालेन्डर
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>नयाँ घटना थप्नुहोस् (Add Event)</span>
        </button>
      </div>

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: evt.color || '#f59e0b' }}
                  />
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                    {evt.title}
                  </h4>
                </div>

                <button
                  onClick={() => handleDeleteEvent(evt.id)}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                  title="मेटाउनुहोस् (Delete)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-bold text-red-600 dark:text-rose-400 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatBSDateNepali(evt.bsDate)}</span>
                {evt.time && <span className="text-slate-400 font-normal">({evt.time})</span>}
              </div>

              {evt.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {evt.description}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>{categoryLabels[evt.category] || evt.category}</span>
              <span className="font-semibold text-slate-500 dark:text-slate-300">
                {repeatLabels[evt.repeat]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                नयाँ व्यक्तिगत घटना थप्नुहोस्
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  शीर्षक (Title)*
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा: आमाको जन्मदिन, कुलपूजा, घरभाडा..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    वर्ष (Year BS)
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    महिना (Month)
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-['Mukta',sans-serif]"
                  >
                    {NEPALI_MONTHS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nameNepali}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    गते (Day)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={32}
                    value={day}
                    onChange={(e) => setDay(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Category & Repeat */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    वर्ग (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="puja">पूजा / धार्मिक</option>
                    <option value="birthday">जन्मदिन</option>
                    <option value="anniversary">वर्षगाँठ</option>
                    <option value="reminder">रिमाइन्डर</option>
                    <option value="custom">व्यक्तिगत</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    दोहोरिने नियम (Repeat)
                  </label>
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="yearly_bs">प्रत्येक वर्ष (BS)</option>
                    <option value="monthly_bs">प्रत्येक महिना (BS)</option>
                    <option value="none">एक पटक मात्र</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  कैफियत / विवरण (Note)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="कुनै थप विवरण..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  सुरक्षित गर्नुहोस् (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
