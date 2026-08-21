import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Calendar, ChevronRight } from 'lucide-react';
import { BSDate } from '../types';
import { bsToAd, toNepaliDigits } from '../engines/calendarEngine';

interface CountdownFestival {
  id: string;
  nameNepali: string;
  nameEnglish: string;
  bsDate: BSDate;
  descriptionNepali: string;
  badgeColor: string;
}

const UPCOMING_MAJOR_FESTIVALS: CountdownFestival[] = [
  {
    id: 'ghatasthapana',
    nameNepali: 'घटस्थापना (बडादशैं प्रारम्भ)',
    nameEnglish: 'Ghatasthapana (Dashain Starts)',
    bsDate: { year: 2083, month: 6, day: 25 },
    descriptionNepali: 'जमरा राख्ने र नवरात्र पूजाको पहिलो दिन',
    badgeColor: '#dc2626',
  },
  {
    id: 'vijayadashami',
    nameNepali: 'विजयादशमी (दशैंको मुख्य टीका)',
    nameEnglish: 'Dashain Tika (Vijaya Dashami)',
    bsDate: { year: 2083, month: 7, day: 4 },
    descriptionNepali: 'मान्यजनबाट रातो टीका, पहेँलो जमरा र आशीर्वाद ग्रहण',
    badgeColor: '#ea580c',
  },
  {
    id: 'laxmi_puja',
    nameNepali: 'लक्ष्मीपूजा (दीपावली / तिहार)',
    nameEnglish: 'Laxmi Puja (Deepawali)',
    bsDate: { year: 2083, month: 7, day: 24 },
    descriptionNepali: 'धनधान्यकी देवी महालक्ष्मीको आराधना र दीप प्रज्वलन',
    badgeColor: '#eab308',
  },
  {
    id: 'bhai_tika',
    nameNepali: 'भाइटीका (यमद्वितीया)',
    nameEnglish: 'Bhai Tika (Kija Puja)',
    bsDate: { year: 2083, month: 7, day: 26 },
    descriptionNepali: 'दिदीबहिनी र दाजुभाइ बीचको सप्तरङ्गी टीका र दीर्घायु कामना',
    badgeColor: '#9333ea',
  },
  {
    id: 'chhath',
    nameNepali: 'छठ पर्व (सूर्य षष्ठी)',
    nameEnglish: 'Chhath Parva (Surya Puja)',
    bsDate: { year: 2083, month: 7, day: 30 },
    descriptionNepali: 'अस्ताउँदो र उदाउँदो सूर्यदेव तथा छठी माताको पवित्र अर्घ्य',
    badgeColor: '#2563eb',
  },
  {
    id: 'maghe_sankranti',
    nameNepali: 'माघे सङ्क्रान्ति (मकर सङ्क्रान्ति)',
    nameEnglish: 'Maghe Sankranti (Makar Sankranti)',
    bsDate: { year: 2083, month: 10, day: 1 },
    descriptionNepali: 'सूर्य धनु राशिबाट मकर राशिमा प्रवेश, घ्यू-चाकु, तिलौरा र तरुल',
    badgeColor: '#16a34a',
  },
  {
    id: 'shivaratri',
    nameNepali: 'महाशिवरात्रि (Mahashivaratri)',
    nameEnglish: 'Maha Shivaratri',
    bsDate: { year: 2083, month: 11, day: 21 },
    descriptionNepali: 'भगवान् पशुपतिनाथको आराधना तथा चार प्रहर पूजा',
    badgeColor: '#0891b2',
  },
];

interface FestivalCountdownWidgetProps {
  onJumpToDate?: (bsDate: BSDate) => void;
}

export const FestivalCountdownWidget: React.FC<FestivalCountdownWidgetProps> = ({
  onJumpToDate,
}) => {
  const [timeLeftList, setTimeLeftList] = useState<
    Record<string, { days: number; hours: number; minutes: number; seconds: number; isPassed: boolean }>
  >({});

  useEffect(() => {
    const calculateAllTimeRemaining = () => {
      const now = new Date();
      const updated: Record<string, { days: number; hours: number; minutes: number; seconds: number; isPassed: boolean }> = {};

      UPCOMING_MAJOR_FESTIVALS.forEach((fest) => {
        const ad = bsToAd(fest.bsDate);
        const target = new Date(ad.year, ad.month - 1, ad.day, 6, 0, 0); // 6 AM of festival day
        const diffMs = target.getTime() - now.getTime();

        if (diffMs > 0) {
          const totalSeconds = Math.floor(diffMs / 1000);
          const days = Math.floor(totalSeconds / (3600 * 24));
          const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          updated[fest.id] = { days, hours, minutes, seconds, isPassed: false };
        } else {
          updated[fest.id] = { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
        }
      });

      setTimeLeftList(updated);
    };

    calculateAllTimeRemaining();
    const interval = setInterval(calculateAllTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const nextUpcoming = UPCOMING_MAJOR_FESTIVALS.find(
    (f) => timeLeftList[f.id] && !timeLeftList[f.id].isPassed
  ) || UPCOMING_MAJOR_FESTIVALS[0];

  const primaryRemaining = timeLeftList[nextUpcoming.id] || {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold">
              चाडपर्व काउन्टडाउन (Festival Countdown)
            </span>
          </div>
          <h4 className="text-xl sm:text-2xl font-extrabold mt-1 font-['Mukta',sans-serif]">
            {nextUpcoming.nameNepali}
          </h4>
          <p className="text-xs text-rose-100 mt-0.5">
            वि.सं. {toNepaliDigits(nextUpcoming.bsDate.year)}/{toNepaliDigits(nextUpcoming.bsDate.month)}/{toNepaliDigits(nextUpcoming.bsDate.day)} • {nextUpcoming.descriptionNepali}
          </p>
        </div>

        {/* Real-time Ticking Counter Blocks */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 min-w-[60px]">
            <span className="text-2xl font-black block font-mono">
              {toNepaliDigits(primaryRemaining.days)}
            </span>
            <span className="text-[10px] uppercase font-bold text-rose-100">दिन</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 min-w-[60px]">
            <span className="text-2xl font-black block font-mono">
              {toNepaliDigits(String(primaryRemaining.hours).padStart(2, '0'))}
            </span>
            <span className="text-[10px] uppercase font-bold text-rose-100">घण्टा</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 min-w-[60px]">
            <span className="text-2xl font-black block font-mono">
              {toNepaliDigits(String(primaryRemaining.minutes).padStart(2, '0'))}
            </span>
            <span className="text-[10px] uppercase font-bold text-rose-100">मिनेट</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 min-w-[60px]">
            <span className="text-2xl font-black block font-mono text-amber-200 animate-pulse">
              {toNepaliDigits(String(primaryRemaining.seconds).padStart(2, '0'))}
            </span>
            <span className="text-[10px] uppercase font-bold text-rose-100">सेकेन्ड</span>
          </div>
        </div>
      </div>
    </div>
  );
};
