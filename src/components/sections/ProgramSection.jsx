import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiClock, HiMusicNote, HiUser, HiStar } from 'react-icons/hi';
import { useEvent } from '../../context/EventContext';

const ProgramSection = () => {
  const { t, i18n } = useTranslation();
  const { event, content } = useEvent();
  const [selectedDay, setSelectedDay] = useState(0);

  // Get schedule from event or content
  const schedule = event?.schedule || content?.program || [];

  // Group schedule by day if event spans multiple days
  const getDays = () => {
    if (!event?.startDate) return [{ label: t('program.day1'), date: new Date() }];

    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : start;
    const days = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        label: d.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }),
        date: new Date(d),
      });
    }

    return days;
  };

  const days = getDays();

  // Filter schedule items for selected day
  const getScheduleForDay = (dayIndex) => {
    if (!schedule.length) return [];
    const day = days[dayIndex];
    if (!day) return schedule;

    return schedule.filter((item) => {
      if (!item.startTime) return dayIndex === 0;
      const itemDate = new Date(item.startTime);
      return itemDate.toDateString() === day.date.toDateString();
    });
  };

  const currentDaySchedule = getScheduleForDay(selectedDay);

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section id="program" className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-secondary-600/20 text-secondary-300 rounded-full text-sm font-medium mb-4">
            {t('program.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('program.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('program.description')}
          </p>
        </motion.div>

        {/* Day Tabs */}
        {days.length > 1 && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white/10 rounded-xl p-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedDay === index
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 -translate-x-1/2" />

          <div className="space-y-8">
            {currentDaySchedule.map((item, index) => (
              <motion.div
                key={item._id || index}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Time Badge (center on desktop) */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <HiClock className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                    {/* Time (mobile) */}
                    <div className="md:hidden flex items-center gap-2 text-primary-600 font-medium mb-3">
                      <HiClock className="w-5 h-5" />
                      <span>{formatTime(item.startTime)}</span>
                      {item.endTime && (
                        <>
                          <span>-</span>
                          <span>{formatTime(item.endTime)}</span>
                        </>
                      )}
                    </div>

                    {/* Time (desktop) */}
                    <div className="hidden md:block text-primary-600 font-medium mb-3">
                      {formatTime(item.startTime)}
                      {item.endTime && ` - ${formatTime(item.endTime)}`}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title || item.name}
                    </h3>

                    {/* Performer */}
                    {item.performer && (
                      <div className={`flex items-center gap-2 text-gray-600 mb-3 ${
                        index % 2 === 0 ? 'md:justify-end' : ''
                      }`}>
                        <HiUser className="w-4 h-4" />
                        <span>{item.performer.name || item.performer}</span>
                      </div>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className={`flex flex-wrap gap-2 mt-4 ${
                        index % 2 === 0 ? 'md:justify-end' : ''
                      }`}>
                        {item.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Featured Badge */}
                    {item.featured && (
                      <div className={`flex items-center gap-1 mt-4 text-accent-500 ${
                        index % 2 === 0 ? 'md:justify-end' : ''
                      }`}>
                        <HiStar className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('program.featured')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Empty space for alignment */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {currentDaySchedule.length === 0 && (
          <div className="text-center py-12">
            <HiMusicNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('program.noProgram')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramSection;
