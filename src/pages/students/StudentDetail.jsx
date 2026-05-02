import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  MdArrowBack, MdEmail, MdPhone, MdLocationOn, MdCake, MdSchool, 
  MdClass, MdCalendarToday, MdTrendingUp, MdAssignment, MdCheckCircle,
  MdWarning, MdPerson, MdEdit, MdAssessment, MdOutlineClass, MdRefresh,
  MdLayers, MdAutoFixHigh, MdOutlineCalendarMonth, MdAnalytics, MdKeyboardArrowRight,
  MdDescription, MdVisibility
} from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:7001/api/students';
const REPORTS_API = 'http://localhost:7001/api/reports';
const AUTH_TOKEN = () => localStorage.getItem('token');

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = useCallback(async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${AUTH_TOKEN()}` } };
      const [stuRes, repRes] = await Promise.all([
        axios.get(`${API}/${id}`, config),
        axios.get(REPORTS_API, config)
      ]);
      setStudent(stuRes.data);
      // Filter reports for this specific student
      const studentReports = (repRes.data.reports || []).filter(r => r.student?._id === id || r.student === id);
      setReports(studentReports);
    } catch (err) {
      toast.error('Sync Error');
      navigate('/students');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchStudentData(); }, [fetchStudentData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing Personnel Dossier...</p>
    </div>
  );

  if (!student) return null;

  const attendanceRate = student.totalClasses ? ((student.present / student.totalClasses) * 100).toFixed(1) : 0;
  
  const stats = [
    { label: 'Attendance', value: `${attendanceRate}%`, icon: <MdOutlineCalendarMonth/>, color: 'text-emerald-600' },
    { label: 'Avg. Score', value: `${student.averageMarks || 0}%`, icon: <MdAnalytics/>, color: 'text-indigo-600' },
    { label: 'Tasks Done', value: student.tasksCompleted || 0, icon: <MdCheckCircle/>, color: 'text-purple-600' },
    { label: 'Intelligence', value: reports.length, icon: <MdDescription/>, color: 'text-amber-600' },
  ];

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <Toaster position="top-right" />
      
      {/* 🚀 HEADER */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/students')} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm uppercase tracking-widest active:scale-95">
          <MdArrowBack size={20}/> Directory
        </button>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
          <MdEdit size={18} /> Modify Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 👤 LEFT: PROFILE CARD */}
        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[40px] border border-slate-200/50 shadow-sm text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-slate-900 to-indigo-900 opacity-[0.03]" />
             <div className="w-32 h-32 rounded-[32px] bg-slate-50 mx-auto overflow-hidden ring-4 ring-white shadow-inner relative z-10">
                <img 
                  src={student.profileImage ? `http://localhost:7001/${student.profileImage}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.fullName}`} 
                  alt={student.fullName} 
                  className="w-full h-full object-cover"
                />
             </div>
             <h2 className="text-2xl font-black text-slate-800 mt-6 tracking-tight font-display relative z-10">{student.fullName}</h2>
             <p className="text-indigo-600 font-bold uppercase tracking-widest text-[9px] mt-1 relative z-10">{student.course?.replace(/-/g, ' ')}</p>
             
             <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left relative z-10">
                <div className="flex items-center gap-4 text-slate-500">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><MdEmail size={16} /></div>
                   <span className="text-xs font-bold truncate">{student.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><MdPhone size={16} /></div>
                   <span className="text-xs font-bold">{student.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><MdSchool size={16} /></div>
                   <span className="text-xs font-bold">Batch {student.batch} • Class {student.className || '--'}</span>
                </div>
             </div>
          </div>

          {/* 📋 REPORTS PREVIEW WALL */}
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full translate-x-16 -translate-y-16 blur-2xl group-hover:scale-110 transition-transform duration-1000"></div>
             <div className="relative z-10">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" /> Active Intelligence
                </h3>
                <div className="space-y-4">
                   {reports.length > 0 ? reports.slice(0, 3).map((r, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer" onClick={() => navigate('/reports')}>
                         <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-slate-300">{r.reportTitle}</p>
                            <span className="text-[9px] font-black text-indigo-400">{r.overallPerformance}</span>
                         </div>
                      </div>
                   )) : (
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">No dossiers found in registry.</p>
                   )}
                   {reports.length > 3 && <button onClick={() => navigate('/reports')} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:underline mt-2">View All Reports</button>}
                </div>
             </div>
          </div>
        </div>

        {/* 📊 RIGHT: ANALYTICS & TIMELINE */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-2xl p-6 rounded-[32px] border border-slate-200/50 shadow-sm text-center group hover:shadow-xl transition-all">
                   <div className={`${s.color} mb-3 flex justify-center group-hover:scale-110 transition-transform`}>{s.icon}</div>
                   <p className="text-xl font-black text-slate-800 font-display leading-none">{s.value}</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              ))}
           </div>

           <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] border border-slate-200/50 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                 <h3 className="text-lg font-black text-slate-800 font-display">Mission Timeline</h3>
                 <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                    {student.assignedTasks?.length || 0} Modules
                 </span>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-50 bg-slate-50/20">
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Operation</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {student.assignedTasks && student.assignedTasks.length > 0 ? student.assignedTasks.map((task, i) => (
                         <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                            <td className="px-8 py-5">
                               <p className="text-sm font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{task.Title || "Untitled Task"}</p>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{task.course}</p>
                            </td>
                            <td className="px-8 py-5 text-center">
                               <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl ${task.Status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
                                  {task.Status}
                               </span>
                            </td>
                         </tr>
                       )) : (
                         <tr>
                            <td colSpan="2" className="py-20 text-center opacity-30 text-[10px] font-bold uppercase tracking-widest">No Operational History</td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* EVALUATION BLOCK */}
           <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[40px] border border-slate-200/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-[0.02] rounded-bl-full" />
              <div className="relative z-10 flex items-start gap-6">
                 <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><MdAutoFixHigh size={24}/></div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Professional Evaluation</h4>
                    <p className="text-base font-bold text-slate-600 leading-relaxed italic">
                       "{student.remarks || "No professional evaluation found. Continuous performance mapping required to maintain academic indices."}"
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDetail;
