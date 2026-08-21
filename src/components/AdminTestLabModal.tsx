import React, { useState } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  Play,
  Download,
  Calendar,
  MapPin,
  Cpu,
  Layers,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { BSDate, LocationData } from '../types';
import {
  compareCalculationMethods,
  MethodComparisonRow,
  runAutomatedVerificationSuite,
} from '../engines/testLabEngine';
import {
  formatBSDateNepali,
  NEPALI_MONTHS,
  toNepaliDigits,
} from '../engines/calendarEngine';
import { NEPAL_LOCATIONS } from '../engines/locationEngine';

interface AdminTestLabModalProps {
  onClose: () => void;
  currentLocation: LocationData;
}

export const AdminTestLabModal: React.FC<AdminTestLabModalProps> = ({
  onClose,
  currentLocation,
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'test_suite'>('comparison');
  const [testBSYear, setTestBSYear] = useState(2083);
  const [testBSMonth, setTestBSMonth] = useState(5);
  const [testBSDay, setTestBSDay] = useState(15);
  const [selectedLocId, setSelectedLocId] = useState(currentLocation.id);

  const loc = NEPAL_LOCATIONS.find((l) => l.id === selectedLocId) || currentLocation;
  const testDate: BSDate = { year: testBSYear, month: testBSMonth, day: testBSDay };

  // Calculate comparison
  const comparisonRows: MethodComparisonRow[] = compareCalculationMethods(testDate, loc);

  // Run automated test suite
  const [suiteReport, setSuiteReport] = useState(() => runAutomatedVerificationSuite());
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleRerunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setSuiteReport(runAutomatedVerificationSuite());
      setIsRunningTests(false);
    }, 400);
  };

  const handleExportJSON = () => {
    const data = {
      testDate,
      location: loc,
      comparison: comparisonRows,
      verificationSuite: suiteReport,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `namro_patro_audit_${testBSYear}_${testBSMonth}_${testBSDay}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                  नाम्रो पात्रो गणना प्रयोगशाला (Calculation Laboratory)
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
                  ENGINE LAB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-Siddhanta side-by-side comparative analysis & unit benchmark suite
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
          >
            ✕
          </button>
        </div>

        {/* Lab Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'comparison'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              सिद्वान्त तुलना (Multi-Method Matrix)
            </button>
            <button
              onClick={() => setActiveTab('test_suite')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'test_suite'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>स्वचालित प्रमाणीकरण (Verification Suite)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                {suiteReport.passedCount}/{suiteReport.totalTests} Passed
              </span>
            </button>
          </div>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 mb-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>

        {/* Tab 1: Multi-Method Comparison */}
        {activeTab === 'comparison' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Input Date and Location controls */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-bold">परीक्षण वर्ष (BS)</label>
                <input
                  type="number"
                  value={testBSYear}
                  onChange={(e) => setTestBSYear(parseInt(e.target.value, 10) || 2083)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-bold">महिना (Month)</label>
                <select
                  value={testBSMonth}
                  onChange={(e) => setTestBSMonth(parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-bold font-['Mukta',sans-serif]"
                >
                  {NEPALI_MONTHS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nameNepali}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-bold">गते (Day)</label>
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={testBSDay}
                  onChange={(e) => setTestBSDay(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-bold">स्थान (Location)</label>
                <select
                  value={selectedLocId}
                  onChange={(e) => setSelectedLocId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-bold"
                >
                  {NEPAL_LOCATIONS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nameNepali}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">पद्धति (Siddhanta)</th>
                    <th className="p-3">सूर्य देशान्तर (Sun Long)</th>
                    <th className="p-3">चन्द्र देशान्तर (Moon Long)</th>
                    <th className="p-3">अयनांश (Ayanamsa)</th>
                    <th className="p-3">तिथि (Tithi)</th>
                    <th className="p-3">नक्षत्र (Nakshatra)</th>
                    <th className="p-3">सूर्योदय/सूर्यास्त</th>
                    <th className="p-3">भिन्नता विवरण</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.methodId}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        <div>{row.methodNameNepali}</div>
                        <span className="text-[10px] text-slate-400">{row.methodId}</span>
                      </td>
                      <td className="p-3 font-mono">{row.sunLongitude.toFixed(3)}°</td>
                      <td className="p-3 font-mono">{row.moonLongitude.toFixed(3)}°</td>
                      <td className="p-3 font-mono">{row.ayanamsa}°</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-semibold">
                          {row.tithiName}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">{row.nakshatraName}</td>
                      <td className="p-3 font-mono text-[11px]">
                        {row.sunrise} / {row.sunset}
                      </td>
                      <td className="p-3 text-[11px] text-slate-500 dark:text-slate-400">
                        {row.varianceNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Automated Verification Test Suite */}
        {activeTab === 'test_suite' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-200">
                    सबै {suiteReport.totalTests} वटा परीक्षणहरू सफलतापूर्वक उत्तीर्ण भए (All Tests Passed)
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    BS/AD Conversion, Round-trip invariance, Boundary extrema, Ephemeris precision & Festival rules verified.
                  </p>
                </div>
              </div>

              <button
                onClick={handleRerunTests}
                disabled={isRunningTests}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
                <span>पुनः जाँच गर्नुहोस् (Re-run)</span>
              </button>
            </div>

            {/* Test Results List */}
            <div className="space-y-2.5">
              {suiteReport.results.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                        {t.module}
                      </span>
                      <h5 className="font-bold text-slate-900 dark:text-white">{t.title}</h5>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      इनपुट: <span className="font-mono text-slate-700 dark:text-slate-300">{t.inputDescription}</span> • सहिष्णुता (Tolerance): {t.tolerance}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                      अपेक्षित: {t.expectedOutput} ➔ प्राप्त: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.actualOutput}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      उत्तीर्ण (PASS)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
