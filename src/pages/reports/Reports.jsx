import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  MdTaskAlt, MdPendingActions, MdPeople, MdShowChart, MdCheckCircle, 
  MdSearch, MdDownload, MdClose, MdSchedule, MdAdd, MdRefresh,
  MdAssessment, MdTimeline, MdAssignmentTurnedIn, MdWarningAmber,
  MdFilterList, MdDeleteOutline, MdDescription, MdPerson, MdCalendarToday,
  MdEdit, MdStar, MdEventAvailable, MdAttachFile, MdQuiz, MdCategory, MdHistory,
  MdKeyboardArrowRight, MdTrendingUp, MdVisibility, MdArrowBack, MdRocketLaunch,
  MdAnalytics, MdOutlineCalendarMonth, MdLayers, MdAutoFixHigh, MdOutlineFactCheck,
  MdStream, MdArrowForward
} from 'react-icons/md';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const REPORTS_API = 'http://localhost:7001/api/reports';
const STUDENTS_API = 'http://localhost:7001/api/students';
const TASKS_API = 'http://localhost:7001/api/tasks';
const AUTH_TOKEN = () => localStorage.getItem('token');

const COURSES = [
  "Software-Development", "Data-Science", "Cyber-Security", "Cloud-Computing", 
  "Artificial-Intelligence", "Digital-Marketing", "UI-UX-Design", 
  "Business-Analytics", "Project-Management", "DevOps"
];

const BATCHES = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

// ── ELITE REPORT ENGINE (MODAL) ────────────────────────────────────────────────
const CreateReportModal = ({ onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([{ testName: '', marksObtained: '', totalMarks: '', date: new Date().toISOString().split('T')[0] }]);
  const [form, setForm] = useState({
    student: '', reportTitle: '', reportType: 'Monthly', fromDate: '', toDate: '',
    overallPerformance: 'Average', remarks: '', suggestions: '', totalClasses: '', present: '',
    conduct: { attentiveness: 85, punctuality: 85, neatness: 85, extracurriculars: 85 }
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(STUDENTS_API, { headers: { Authorization: `Bearer ${AUTH_TOKEN()}` } });
        setStudents(res.data.students || []);
      } catch (err) { console.error(err); }
    };
    fetchStudents();
  }, []);

  const addTest = () => setTests([...tests, { testName: '', marksObtained: '', totalMarks: '', date: new Date().toISOString().split('T')[0] }]);
  const removeTest = (index) => tests.length > 1 && setTests(tests.filter((_, i) => i !== index));
  const updateTest = (index, field, val) => {
    const newTests = [...tests];
    newTests[index][field] = val;
    setTests(newTests);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student) return toast.error('Target Identity required');
    setLoading(true);
    const loadToast = toast.loading('Synchronizing Intelligence...');
    try {
      await axios.post(REPORTS_API, { ...form, tests }, { headers: { Authorization: `Bearer ${AUTH_TOKEN()}` } });
      toast.success('Dossier Synchronized', { id: loadToast });
      onSaved();
      onClose();
    } catch (err) { toast.error('Satellite Fault', { id: loadToast }); }
    finally { setLoading(false); }
  };

  const inp = "w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300";
  const lbl = "block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em] ml-1";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.15)] w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20"
      >
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-indigo-100">
                <MdRocketLaunch />
             </div>
             <div>
               <h2 className="text-3xl font-black text-slate-800 tracking-tight font-display">Generate Report</h2>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Create a new academic performance record</p>
             </div>
          </div>
          <button onClick={onClose} className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><MdClose size={32} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-12 overflow-y-auto no-scrollbar custom-scrollbar flex-1">
           {/* Core Info */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                  <label className={lbl}>Select Student</label>
                  <select className={inp} value={form.student} onChange={e => setForm({...form, student: e.target.value})} required>
                     <option value="">Select Student...</option>
                     {students.map(s => <option key={s._id} value={s._id}>{s.fullName} ({s.studentId})</option>)}
                  </select>
               </div>
               <div className="lg:col-span-1">
                  <label className={lbl}>Report Title</label>
                  <input className={inp} value={form.reportTitle} onChange={e => setForm({...form, reportTitle: e.target.value})} placeholder="e.g. Annual Result" required />
               </div>
               <div>
                  <label className={lbl}>From Date</label>
                  <input type="date" className={inp} value={form.fromDate} onChange={e => setForm({...form, fromDate: e.target.value})} required />
               </div>
               <div>
                  <label className={lbl}>To Date</label>
                  <input type="date" className={inp} value={form.toDate} onChange={e => setForm({...form, toDate: e.target.value})} required />
               </div>
           </div>

           {/* Test Vectors Wall */}
           <div className="space-y-6">
              <div className="flex justify-between items-end px-2">
                 <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                       <MdOutlineFactCheck className="text-indigo-600" size={22} /> Assessment Vectors
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Define specific test outcomes for analysis</p>
                 </div>
                  <button type="button" onClick={addTest} className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                     <MdAdd size={18}/> Add Test Score
                  </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {tests.map((test, idx) => (
                   <motion.div 
                     key={idx} 
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="grid grid-cols-12 gap-5 items-end bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 hover:border-indigo-100 transition-all group"
                   >
                     <div className="col-span-5">
                       <label className={lbl}>Vector Identity (Subject/Test)</label>
                       <input className={`${inp} bg-white`} placeholder="e.g. Data structures" value={test.testName} onChange={e => updateTest(idx, 'testName', e.target.value)} required />
                     </div>
                     <div className="col-span-3">
                       <label className={lbl}>Marks Gained</label>
                       <input type="number" className={`${inp} bg-white text-center font-display text-lg`} placeholder="0" value={test.marksObtained} onChange={e => updateTest(idx, 'marksObtained', e.target.value)} required />
                     </div>
                     <div className="col-span-3">
                       <label className={lbl}>Maximum Potential</label>
                       <input type="number" className={`${inp} bg-white text-center font-display text-lg`} placeholder="100" value={test.totalMarks} onChange={e => updateTest(idx, 'totalMarks', e.target.value)} required />
                     </div>
                     <div className="col-span-1 flex justify-center">
                        <button type="button" onClick={() => removeTest(idx)} className="p-3 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                           <MdDeleteOutline size={26}/>
                        </button>
                     </div>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Evaluation Section */}
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className={lbl}>Performance Evaluation</label>
                    <select className={inp} value={form.overallPerformance} onChange={e => setForm({...form, overallPerformance: e.target.value})}>
                       {['Excellent', 'Good', 'Average', 'Needs Improvement', 'Critical'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className={lbl}>Official Remarks</label>
                    <textarea className={`${inp} min-h-[60px] resize-none`} value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} placeholder="Professional assessment..." />
                 </div>
              </div>
           </div>

           <button type="submit" disabled={loading} className="w-full py-7 bg-slate-900 text-white font-black text-[12px] uppercase tracking-[0.4em] rounded-[32px] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-4">
             <MdRocketLaunch size={28} /> {loading ? 'Synchronizing Intelligence...' : 'Authorize & Synchronize Hub'}
           </button>
        </form>
      </motion.div>
    </div>
  );
};

// ── MAIN REPORTS MODULE ────────────────────────────────────────────────────────
const Reports = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('performance');
  const [reports, setReports] = useState([]);
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewDetail, setViewDetail] = useState(false);

  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    try {
      const config = { headers: { Authorization: `Bearer ${AUTH_TOKEN()}` } };
      const [repRes, stuRes, tskRes] = await Promise.all([
        axios.get(REPORTS_API, config),
        axios.get(STUDENTS_API, config),
        axios.get(TASKS_API, config)
      ]);
      setReports(repRes.data.reports || []);
      setStudents(stuRes.data.students || []);
      setTasks(tskRes.data.tasks || []);
    } catch { toast.error('Sync Error'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const handleDelete = async (id) => {
    if (!confirm('Purge dossier?')) return;
    try {
      await axios.delete(`${REPORTS_API}/${id}`, { headers: { Authorization: `Bearer ${AUTH_TOKEN()}` } });
      toast.success('Purged');
      fetchAllData(true);
    } catch { toast.error('Purge Fault'); }
  };

  const handleOpenDetail = (report) => {
    setSelectedReport(report);
    setViewDetail(true);
  };

  const allQuestions = tasks.flatMap(t => 
    (t.questions || []).map(q => ({ ...q, course: t.course, taskTitle: t.Title, id: t._id }))
  );

  const stats = [
    { label: 'Active Dossiers', val: reports.length, icon: <MdDescription />, bg: 'bg-indigo-50', color: 'text-indigo-600' },
    { label: 'Scholar Stream', val: students.length, icon: <MdPeople />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Logic Archive', val: allQuestions.length, icon: <MdQuiz />, bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Deployed Hub', val: tasks.length, icon: <MdAssignmentTurnedIn />, bg: 'bg-amber-50', color: 'text-amber-600' },
  ];

  if (viewDetail && selectedReport) {
    const totalMarks = selectedReport.tests?.reduce((a, b) => a + (b.totalMarks || 0), 0) || 100;
    const obtainedMarks = selectedReport.tests?.reduce((a, b) => a + (b.marksObtained || 0), 0) || 0;
    const percentage = Math.round((obtainedMarks / totalMarks) * 100);

    const chartData = selectedReport.tests?.map((t, i) => ({
      name: t.testName.length > 8 ? `T${i+1}` : t.testName,
      full: t.testName,
      marks: Math.round((t.marksObtained / t.totalMarks) * 100)
    })) || [];

    return (
      <div className="w-full space-y-10 animate-in fade-in duration-700 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <button onClick={() => setViewDetail(false)} className="group flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-xl border border-slate-200/50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-indigo-600 transition-all shadow-sm active:scale-95">
              <MdArrowBack className="group-hover:-translate-x-1 transition-transform" size={20}/> Hub Registry
           </button>
           <button onClick={() => window.print()} className="px-8 py-4 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-600 transition-all flex items-center gap-3 active:scale-95">
              <MdDownload size={22}/> Export Intelligence Dossier
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[56px] border border-slate-200/50 shadow-sm flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600 opacity-[0.03] rounded-bl-full" />
               <div className="w-40 h-40 rounded-[44px] overflow-hidden shadow-2xl ring-8 ring-white shrink-0 relative z-10 transition-transform hover:scale-105 duration-500">
                  <img src={selectedReport.student?.profileImage ? `http://localhost:7001/${selectedReport.student.profileImage.replace(/\\/g, '/')}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedReport.student?.fullName}`} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Personnel Identity</p>
                        <h2 className="text-4xl font-black text-slate-800 font-display leading-tight tracking-tighter">{selectedReport.student?.fullName}</h2>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Mission Dossier</p>
                        <p className="text-2xl font-black text-indigo-600 font-display">{selectedReport.reportTitle}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-12 border-t border-slate-50 pt-8">
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Index ID</p>
                        <p className="text-base font-bold text-slate-700 font-display">{selectedReport.student?.studentId || 'N/A'}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Performance Status</p>
                        <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                           {selectedReport.overallPerformance}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] border border-slate-200/50 shadow-sm overflow-hidden flex flex-col h-full group hover:shadow-xl transition-all">
                  <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                     <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Test Vector Matrix</h3>
                     <MdLayers size={20} className="text-indigo-600" />
                  </div>
                  <div className="overflow-x-auto flex-1 custom-scrollbar">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50">
                              <th className="px-10 py-5">Logic Vector</th>
                              <th className="px-8 py-5 text-center">Score</th>
                              <th className="px-8 py-5 text-center">Max</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {selectedReport.tests?.map((t, i) => (
                             <tr key={i} className="hover:bg-indigo-50/40 transition-colors group">
                                <td className="px-10 py-5 text-sm font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{t.testName}</td>
                                <td className="px-8 py-5 text-center text-sm font-black text-slate-800">{t.marksObtained}</td>
                                <td className="px-8 py-5 text-center text-sm font-black text-slate-300">{t.totalMarks}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* 📊 ELITE ANALYTIC PROGRESSION CHART */}
               <div className="bg-white/40 backdrop-blur-[40px] p-10 rounded-[56px] border border-white/60 shadow-[0_32px_80px_rgba(0,0,0,0.06)] flex flex-col group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all relative overflow-hidden h-full">
                  {/* Decorative Chart Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
                  
                  <div className="flex justify-between items-center mb-12 relative z-10">
                     <div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Analytic Progression</h3>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> Live Vector Tracking
                        </p>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                        <MdTimeline size={24} />
                     </div>
                  </div>

                  <div className="flex-1 h-72 min-h-[320px] relative z-10">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <defs>
                              <linearGradient id="eliteProgression" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#E2E8F0" strokeOpacity={0.3} />
                           <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94A3B8', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em'}} 
                              dy={15} 
                           />
                           <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94A3B8', fontSize: 10, fontWeight: '900'}} 
                              dx={-10} 
                              domain={[0, 100]} 
                           />
                           <Tooltip 
                              cursor={{ stroke: '#6366f1', strokeWidth: 3, strokeDasharray: '6 6' }}
                              contentStyle={{
                                 backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                 backdropFilter: 'blur(20px)',
                                 borderRadius: '24px',
                                 border: '1px solid rgba(255, 255, 255, 0.5)',
                                 boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
                                 fontWeight: '900',
                                 fontSize: '11px',
                                 padding: '16px',
                                 color: '#1E293B'
                              }} 
                              itemStyle={{ color: '#6366f1' }}
                           />
                           <Area 
                              type="monotone" 
                              dataKey="marks" 
                              stroke="#6366f1" 
                              strokeWidth={6} 
                              fillOpacity={1} 
                              fill="url(#eliteProgression)" 
                              dot={{ r: 8, fill: '#6366f1', strokeWidth: 5, stroke: '#fff', shadow: '0 4px 15px rgba(99,102,241,0.4)' }} 
                              activeDot={{ r: 10, fill: '#6366f1', strokeWidth: 5, stroke: '#fff' }} 
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
             <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[56px] border border-slate-200/50 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12">Intelligence Quotient</h3>
                <div className="relative w-52 h-52 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90">
                      <circle cx="104" cy="104" r="90" fill="transparent" stroke="#F1F5F9" strokeWidth="15" />
                      <circle cx="104" cy="104" r="90" fill="transparent" stroke="#6366F1" strokeWidth="15" 
                         strokeDasharray={2 * Math.PI * 90} strokeDashoffset={2 * Math.PI * 90 * (1 - percentage/100)} 
                         strokeLinecap="round" className="transition-all duration-1000" />
                   </svg>
                   <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-black text-slate-800 tracking-tighter font-display leading-none">{percentage}%</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mt-2">Overall Index</span>
                   </div>
                </div>
                <div className="mt-12 space-y-2">
                   <p className="text-7xl font-black text-indigo-600 tracking-tighter leading-none font-display transition-transform group-hover:scale-110 duration-500">{percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : 'B'}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] pt-2">Verified Academic Rank</p>
                </div>
             </div>

             <div className="bg-slate-900 rounded-[56px] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full translate-x-40 -translate-y-40 blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="relative z-10">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
                     <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]" /> Official Assessment
                   </h4>
                   <p className="text-xl font-bold text-slate-300 leading-relaxed italic opacity-95">
                     "{selectedReport.remarks || "No evaluation record. Maintain continuous progression monitoring to calibrate academic indices."}"
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700 pb-20 relative">
      {/* Background Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <Toaster position="top-right" />
      
      {/* 🚀 ELITE HUB HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
           <h1 className="text-4xl font-black text-slate-800 tracking-tight font-display mb-1">Academic Hub</h1>
           <p className="text-slate-400 font-bold text-sm tracking-wide flex items-center gap-2">
             <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
             Multi-Engine Performance Monitoring Synced
           </p>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => fetchAllData(true)} className={`p-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/50 text-slate-400 hover:text-indigo-600 transition-all ${refreshing ? 'animate-spin' : ''}`}>
              <MdRefresh size={24} />
           </button>
           <button onClick={() => setModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95">
              <MdAnalytics size={22} /> Generate Intelligence
           </button>
        </div>
      </div>

      {/* 📊 BENTO GRID STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
         {stats.map(s => (
           <div key={s.label} className="bg-white/60 backdrop-blur-2xl p-8 rounded-[44px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-7 group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1">
              <div className={`w-16 h-16 rounded-[24px] ${s.bg} ${s.color} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform`}>{s.icon}</div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</p>
                 <p className="text-3xl font-black text-slate-800 font-display mt-0.5 tracking-tighter">{s.val}</p>
              </div>
           </div>
         ))}
      </div>

      {/* 🧩 ENGINE SELECTOR */}
      <div className="flex flex-wrap bg-white/40 backdrop-blur-md p-2 rounded-[36px] w-fit shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/60 relative z-10">
         {[
           { id: 'performance', label: 'Performance Wall', icon: <MdShowChart /> },
           { id: 'registry', label: 'Student Stream', icon: <MdPeople /> },
           { id: 'questions', label: 'Questions Lab', icon: <MdQuiz /> }
         ].map(tab => (
           <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-10 py-4 rounded-[28px] text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-[0_8px_25px_rgba(99,102,241,0.15)]' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab.icon} {tab.label}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'performance' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] border border-slate-200/50 shadow-sm overflow-hidden">
                 <div className="p-12 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight font-display">Intelligence Archive</h3>
                    <div className="relative w-full md:w-96 group">
                       <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={24} />
                       <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dossiers by identity..." className="w-full pl-16 pr-8 py-4.5 bg-slate-50/50 border border-transparent focus:border-indigo-100 rounded-2xl text-xs font-black outline-none transition-all placeholder:text-slate-300" />
                    </div>
                 </div>
                 <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-slate-50/30 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">
                             <th className="px-12 py-7">Personnel Identity</th>
                             <th className="px-10 py-7">Mission Dossier</th>
                             <th className="px-10 py-7 text-center">Score Index</th>
                             <th className="px-10 py-7 text-center">Outcome</th>
                             <th className="px-12 py-7 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {reports.filter(r => r.student?.fullName.toLowerCase().includes(search.toLowerCase())).map((r, idx) => (
                             <tr key={r._id} onClick={() => handleOpenDetail(r)} className="hover:bg-indigo-50/40 transition-all group cursor-pointer">
                                <td className="px-12 py-6">
                                   <div className="flex items-center gap-5">
                                      <div className="w-14 h-14 rounded-[22px] bg-white overflow-hidden ring-4 ring-slate-50 shadow-sm group-hover:ring-indigo-100 transition-all shrink-0">
                                         <img src={r.student?.profileImage ? `http://localhost:7001/${r.student.profileImage.replace(/\\/g, '/')}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.student?.fullName}`} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="min-w-0">
                                         <p className="text-base font-black text-slate-800 leading-tight mb-1 group-hover:text-indigo-600 transition-colors truncate">{r.student?.fullName}</p>
                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{r.student?.studentId}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-10 py-6 text-sm font-black text-slate-700 tracking-tight">{r.reportTitle}</td>
                                <td className="px-10 py-6 text-center">
                                   <div className="flex flex-col items-center">
                                      <span className="text-sm font-black text-slate-800 font-display">{r.attendancePercentage?.toFixed(0) || 100}%</span>
                                      <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden shadow-inner"><div className="h-full bg-indigo-500 rounded-full" style={{width:`${r.attendancePercentage || 100}%`}}/></div>
                                   </div>
                                </td>
                                <td className="px-10 py-6 text-center">
                                   <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${r.overallPerformance === 'Excellent' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200/50'}`}>{r.overallPerformance}</span>
                                </td>
                                <td className="px-12 py-6 text-right space-x-2" onClick={e=>e.stopPropagation()}>
                                   <button onClick={() => handleOpenDetail(r)} className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110"><MdVisibility size={20}/></button>
                                   <button onClick={() => handleDelete(r._id)} className="p-3 bg-white text-slate-400 hover:text-rose-500 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110"><MdDeleteOutline size={20}/></button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </motion.div>
        )}

        {/* ── STUDENT STREAM ENGINE ─────────────────────────────────────── */}
        {activeTab === 'registry' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {students.map((s, idx) => (
                <div key={s._id} className="bg-white/80 backdrop-blur-2xl p-10 rounded-[48px] border border-slate-200/50 shadow-sm relative group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all cursor-pointer overflow-hidden" onClick={() => navigate(`/students/${s._id}`)}>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-[0.02] rounded-bl-full" />
                   <div className="flex items-center gap-6 mb-10 relative z-10">
                      <div className="w-20 h-20 rounded-[28px] bg-slate-50 overflow-hidden ring-4 ring-white shadow-2xl group-hover:ring-indigo-50 transition-all transition-transform group-hover:scale-105">
                         <img src={s.profileImage ? `http://localhost:7001/${s.profileImage}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.fullName}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                         <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-1 group-hover:text-indigo-600 transition-colors truncate font-display">{s.fullName}</h4>
                         <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.course?.replace('-', ' ')}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-5 mb-10 relative z-10">
                      <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-100/50 group-hover:bg-indigo-50 transition-colors">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Index ID</p>
                         <p className="text-sm font-black text-slate-700 font-display">{s.studentId || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-100/50 group-hover:bg-indigo-50 transition-colors">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registry</p>
                         <p className="text-sm font-black text-slate-700 font-display">{s.batch}</p>
                      </div>
                   </div>
                   <div className="flex justify-between items-center pt-8 border-t border-slate-50 relative z-10">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-3">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Profile Synced
                      </span>
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 shadow-sm">
                         <MdArrowForward size={22} />
                      </div>
                   </div>
                </div>
              ))}
           </motion.div>
        )}

        {/* ── QUESTIONS LAB ENGINE ───────────────────────────────────────── */}
        {activeTab === 'questions' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {allQuestions.map((q, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-2xl p-10 rounded-[56px] border border-slate-200/50 shadow-sm relative group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all overflow-hidden flex flex-col min-h-[260px]">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-[0.03] rounded-bl-full" />
                   <div className="flex justify-between items-start mb-8 shrink-0 relative z-10">
                      <div className="px-5 py-2 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100">{q.course}</div>
                      <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest italic font-display">L_{i+1}</span>
                   </div>
                   <div className="flex-1 space-y-6 relative z-10">
                      <h4 className="text-lg font-black text-slate-700 leading-tight line-clamp-3 group-hover:text-indigo-600 transition-colors font-display">"{q.questionText}"</h4>
                      <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><MdLayers size={18} /></div>
                         {q.type} Processor
                      </div>
                   </div>
                   <div className="mt-10 pt-8 border-t border-slate-50 flex justify-between items-center relative z-10">
                      <div className="min-w-0">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Source Operation</p>
                         <p className="text-xs font-bold text-slate-500 truncate">{q.taskTitle}</p>
                      </div>
                      <button onClick={()=>navigate(`/tasks/${q.id}`)} className="w-12 h-12 bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-2xl flex items-center justify-center transition-all shadow-sm hover:scale-110">
                         <MdKeyboardArrowRight size={28} />
                      </button>
                   </div>
                </div>
              ))}
           </motion.div>
        )}
      </AnimatePresence>

      {modalOpen && <CreateReportModal onClose={() => setModalOpen(false)} onSaved={fetchAllData} />}
    </div>
  );
};

export default Reports;
