export interface RadioStation {
  id: string;
  nameNepali: string;
  nameEnglish: string;
  frequency: string;
  locationNepali: string;
  locationEnglish: string;
  category: 'national' | 'news' | 'music' | 'community';
  categoryNepali: string;
  streamUrl: string;
  websiteUrl: string;
  logoColor: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'radio_nepal',
    nameNepali: 'रेडियो नेपाल (Radio Nepal)',
    nameEnglish: 'Radio Nepal (National Broadcaster)',
    frequency: '100.0 MHz',
    locationNepali: 'सिंहदरबार, काठमाडौं',
    locationEnglish: 'Singha Durbar, Kathmandu',
    category: 'national',
    categoryNepali: 'राष्ट्रिय प्रसारण',
    streamUrl: 'https://radionepal.gov.np/stream',
    websiteUrl: 'https://radionepal.gov.np',
    logoColor: '#dc2626',
  },
  {
    id: 'radio_kantipur',
    nameNepali: 'रेडियो कान्तिपुर (Radio Kantipur)',
    nameEnglish: 'Radio Kantipur 96.1 MHz',
    frequency: '96.1 MHz',
    locationNepali: 'पुल्चोक, ललितपुर',
    locationEnglish: 'Pulchowk, Lalitpur',
    category: 'news',
    categoryNepali: 'समाचार तथा मनोरञ्जन',
    streamUrl: 'https://radio-broadcast.radiokantipur.com/stream',
    websiteUrl: 'https://radiokantipur.com',
    logoColor: '#2563eb',
  },
  {
    id: 'ujyaalo_90',
    nameNepali: 'उज्यालो ९० नेटवर्क (Ujyaalo 90)',
    nameEnglish: 'Ujyaalo 90 Network',
    frequency: '90.0 MHz',
    locationNepali: 'धोबीघाट, ललितपुर',
    locationEnglish: 'Dhobighat, Lalitpur',
    category: 'news',
    categoryNepali: 'समाचार तथा खोजमूलक',
    streamUrl: 'https://stream.zeno.fm/h527zwd11rduv',
    websiteUrl: 'https://ujyaaloonline.com',
    logoColor: '#ea580c',
  },
  {
    id: 'bbc_nepali',
    nameNepali: 'बीबीसी नेपाली सेवा (BBC Nepali)',
    nameEnglish: 'BBC World Service Nepali',
    frequency: '103.0 MHz',
    locationNepali: 'लन्डन / काठमाडौं',
    locationEnglish: 'London / Kathmandu',
    category: 'news',
    categoryNepali: 'अन्तर्राष्ट्रिय समाचार',
    streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_nepali_radio',
    websiteUrl: 'https://bbc.com/nepali',
    logoColor: '#b91c1c',
  },
  {
    id: 'hits_fm',
    nameNepali: 'हिट्स एफएम ९१.२ (Hits FM)',
    nameEnglish: 'Hits FM 91.2',
    frequency: '91.2 MHz',
    locationNepali: 'नयाँ बानेश्वर, काठमाडौं',
    locationEnglish: 'New Baneshwor, Kathmandu',
    category: 'music',
    categoryNepali: 'युवा तथा संगीत',
    streamUrl: 'https://hitsfm.com.np/live',
    websiteUrl: 'https://hitsfm.com.np',
    logoColor: '#7c3aed',
  },
  {
    id: 'capital_fm',
    nameNepali: 'क्यापिटल एफएम ९२.४ (Capital FM)',
    nameEnglish: 'Capital FM 92.4',
    frequency: '92.4 MHz',
    locationNepali: 'अनामनगर, काठमाडौं',
    locationEnglish: 'Anamnagar, Kathmandu',
    category: 'community',
    categoryNepali: 'समसामयिक तथा अन्तर्वार्ता',
    streamUrl: 'https://stream.zeno.fm/08w2fcf7szquv',
    websiteUrl: 'https://capitalfm.com.np',
    logoColor: '#059669',
  },
];
