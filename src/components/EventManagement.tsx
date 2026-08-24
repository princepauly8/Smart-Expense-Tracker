import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  CheckCircle2,
  QrCode,
  Share2,
  Plus,
  Tag,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';
import { CampusEvent, EventCategory } from '../types';

export const EventManagement: React.FC = () => {
  const {
    events,
    registerForEvent,
    unregisterFromEvent,
    selectedEventForDetail,
    setSelectedEventForDetail,
    selectedEventForPass,
    setSelectedEventForPass,
    userRole,
    addEvent,
  } = useCampus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [registeredOnly, setRegisteredOnly] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>('Tech');
  const [newEventDate, setNewEventDate] = useState('Nov 15, 2026');
  const [newEventTime, setNewEventTime] = useState('02:00 PM - 05:00 PM');
  const [newEventVenue, setNewEventVenue] = useState('Main Auditorium');
  const [newEventOrganizer, setNewEventOrganizer] = useState('Student Affairs & Clubs');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCapacity, setNewEventCapacity] = useState(200);

  const categories = ['All', 'Tech', 'Workshop', 'Cultural', 'Career', 'Sports'];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesRegistered = !registeredOnly || evt.isRegistered;

    return matchesSearch && matchesCategory && matchesRegistered;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    addEvent({
      title: newEventTitle,
      category: newEventCategory,
      date: newEventDate,
      time: newEventTime,
      venue: newEventVenue,
      organizer: newEventOrganizer,
      description:
        newEventDesc ||
        'Exciting university campus event bringing together students, faculty, and industry professionals.',
      bannerImage:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      capacity: newEventCapacity,
      tags: [newEventCategory, 'CampusLife', '2026'],
      registrationDeadline: 'Nov 14, 2026',
    });

    setIsAddEventOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Campus Events & Hackathons
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Discover fests, tech workshops, club meetups, and generate digital event entry
                passes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole === 'faculty' && (
              <button
                onClick={() => setIsAddEventOpen(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Create Event
              </button>
            )}
            <button
              onClick={() => setRegisteredOnly(!registeredOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                registeredOnly
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              🎟️ My Passes ({events.filter((e) => e.isRegistered).length})
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, speaker, topic, or venue..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No matching campus events found
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Try adjusting your category or search query
            </p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={evt.bannerImage}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                    {evt.category}
                  </span>

                  {evt.isRegistered && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3" /> Registered
                    </span>
                  )}

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h3 className="text-sm font-bold truncate">{evt.title}</h3>
                    <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-400" /> {evt.venue}
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        {evt.registeredCount}/{evt.capacity} spots
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    {evt.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedEventForDetail(evt)}
                  className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  View Details
                </button>

                {evt.isRegistered ? (
                  <button
                    onClick={() => setSelectedEventForPass(evt)}
                    className="flex-1 text-xs font-bold py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </button>
                ) : (
                  <button
                    onClick={() => registerForEvent(evt.id)}
                    className="flex-1 text-xs font-bold py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition-all"
                  >
                    <span>Register Now</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEventForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedEventForDetail(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full">
              {selectedEventForDetail.category} Event
            </span>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">
              {selectedEventForDetail.title}
            </h3>

            <div className="my-3 rounded-2xl overflow-hidden h-44">
              <img
                src={selectedEventForDetail.bannerImage}
                alt={selectedEventForDetail.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <p>{selectedEventForDetail.description}</p>

              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Date & Time</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedEventForDetail.date} • {selectedEventForDetail.time}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Venue Location</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedEventForDetail.venue}
                  </span>
                </div>
              </div>

              {selectedEventForDetail.speakers && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mt-3 mb-1.5">
                    Featured Speakers:
                  </h4>
                  <div className="space-y-1.5">
                    {selectedEventForDetail.speakers.map((spk, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                          {spk.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{spk.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {spk.title} • {spk.company}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Close
              </button>

              {selectedEventForDetail.isRegistered ? (
                <button
                  onClick={() => {
                    setSelectedEventForPass(selectedEventForDetail);
                    setSelectedEventForDetail(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" /> Open Digital Pass
                </button>
              ) : (
                <button
                  onClick={() => {
                    registerForEvent(selectedEventForDetail.id);
                    setSelectedEventForDetail(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Digital Student Event Pass / Ticket Modal */}
      {selectedEventForPass && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-[32px] max-w-sm w-full border border-white/20 shadow-2xl p-6 relative overflow-hidden">
            {/* Holographic glowing orb background */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl" />

            <button
              onClick={() => setSelectedEventForPass(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center relative z-10">
              <span className="text-[10px] font-mono font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full uppercase">
                Official Digital Event Pass
              </span>

              <h3 className="text-base font-black tracking-tight mt-3">
                {selectedEventForPass.title}
              </h3>
              <p className="text-xs text-indigo-200 mt-1">
                {selectedEventForPass.date} • {selectedEventForPass.time}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedEventForPass.venue}</p>

              {/* Dynamic QR Code Pass Container */}
              <div className="my-5 p-4 bg-white rounded-2xl shadow-xl inline-block mx-auto">
                <div className="w-40 h-40 bg-slate-950 rounded-xl p-2 flex flex-col items-center justify-center relative">
                  {/* Styled QR Matrix Mock with Central Emblem */}
                  <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1 opacity-90">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          i % 2 === 0 || i % 7 === 0 ? 'bg-indigo-400' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg ring-2 ring-white">
                      PASS
                    </div>
                  </div>
                </div>
                <p className="text-[10px] font-mono font-bold text-slate-800 mt-2">
                  {selectedEventForPass.registrationPassId || 'PASS-APEX-2026'}
                </p>
              </div>

              <div className="text-[11px] text-indigo-200/80 bg-white/10 rounded-2xl p-3 text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Attendee:</span>
                  <span className="font-semibold text-white">Alex Rivera</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student ID:</span>
                  <span className="font-semibold text-white">AIT-2023-CS-0842</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gate Verification:</span>
                  <span className="font-semibold text-emerald-300">Authorized Access</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    unregisterFromEvent(selectedEventForPass.id);
                    setSelectedEventForPass(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                >
                  Cancel Registration
                </button>
                <button
                  onClick={() => setSelectedEventForPass(null)}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal (Faculty/Admin) */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" /> Create Campus Event
              </h3>
              <button onClick={() => setIsAddEventOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. AI & Robotics Symposium"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as EventCategory)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Tech">Tech / Coding</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Cultural">Cultural / Fest</option>
                    <option value="Career">Career Fair</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    value={newEventCapacity}
                    onChange={(e) => setNewEventCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Event details, prerequisites, and prizes..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
