import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { sessionService } from '../services';

export default function Calendar() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState('week'); // 'week' or 'month'

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sessionService.getAll();
      setSessions(data);
    } catch (err) {
      setError(err.message || 'Failed to load sessions');
      toast.error('Failed to load calendar');
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getSessionsForDay = (day) => {
    return sessions.filter(session => 
      isSameDay(new Date(session.datetime), day)
    );
  };

  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

  const handleSessionAction = async (sessionId, action) => {
    try {
      if (action === 'complete') {
        const updatedSession = await sessionService.update(sessionId, { 
          status: 'completed' 
        });
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? updatedSession : session
        ));
        toast.success('Session marked as completed! Credits have been added.');
      } else if (action === 'cancel') {
        await sessionService.delete(sessionId);
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        toast.success('Session cancelled successfully.');
      }
    } catch (err) {
      toast.error(`Failed to ${action} session`);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-background">
        <div className="bg-white border-b border-surface-200 px-4 py-6">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading text-gray-900">Calendar</h1>
            <p className="text-gray-600">Your skill exchange sessions</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-surface rounded-lg p-1">
            {['week', 'month'].map(viewType => (
              <motion.button
                key={viewType}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView(viewType)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === viewType
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevWeek}
            className="p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </motion.button>
          
          <h2 className="text-lg font-semibold text-gray-900">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </h2>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextWeek}
            className="p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </motion.button>
        </div>
      </div>

      <div className="p-4">
        {/* Week View */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map((day, index) => {
            const daysSessions = getSessionsForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`min-h-24 p-2 rounded-lg border transition-all ${
                  isToday 
                    ? 'bg-primary/5 border-primary/30' 
                    : 'bg-surface border-surface-200 hover:bg-surface-100'
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg font-semibold ${
                    isToday ? 'text-primary' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
                
                <div className="space-y-1">
                  {daysSessions.map((session, sessionIndex) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: sessionIndex * 0.1 }}
                      className={`text-xs p-1.5 rounded text-center font-medium cursor-pointer transition-all ${
                        session.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                      }`}
                      onClick={() => {
                        if (session.status === 'scheduled') {
                          // Show session details
                        }
                      }}
                    >
                      {format(new Date(session.datetime), 'HH:mm')}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
          
          {sessions.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions scheduled</h3>
              <p className="mt-2 text-gray-500">Connect with neighbors to schedule skill exchanges</p>
            </motion.div>
          ) : (
            sessions
              .filter(session => session.status !== 'cancelled')
              .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
              .map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200 max-w-full overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Skill Exchange Session</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          session.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : session.status === 'scheduled'
                            ? 'bg-secondary/20 text-secondary'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <ApperIcon name="Calendar" size={14} className="mr-2" />
                          {format(new Date(session.datetime), 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Clock" size={14} className="mr-2" />
                          {format(new Date(session.datetime), 'h:mm a')} • {session.duration} minutes
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="MapPin" size={14} className="mr-2" />
                          {session.location}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Coins" size={14} className="mr-2 text-secondary" />
                          {session.credits || 1} credits
                        </div>
                      </div>
                    </div>
                  </div>

                  {session.status === 'scheduled' && (
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSessionAction(session.id, 'complete')}
                        className="flex-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all"
                      >
                        Mark Complete
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSessionAction(session.id, 'cancel')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}