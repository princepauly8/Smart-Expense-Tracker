import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  BookOpen,
  Download,
  Bookmark,
  Search,
  Plus,
  FileText,
  CheckCircle,
  FileCode,
  Sparkles,
  Eye,
  X,
  Filter,
  Tag,
  Share2,
} from 'lucide-react';
import { StudyResource, ResourceType } from '../types';

export const StudyResourcesHub: React.FC = () => {
  const {
    resources,
    toggleBookmarkResource,
    downloadResource,
    addResource,
    selectedResourceForPreview,
    setSelectedResourceForPreview,
    triggerPushNotification,
  } = useCampus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Operating Systems');
  const [uploadCourseCode, setUploadCourseCode] = useState('CS301');
  const [uploadSemester, setUploadSemester] = useState(5);
  const [uploadType, setUploadType] = useState<ResourceType>('Notes');
  const [uploadTags, setUploadTags] = useState('Paging, Virtual Memory, Core');
  const [uploadContent, setUploadContent] = useState('');

  const subjects = [
    'All',
    'Operating Systems',
    'Distributed Systems',
    'Deep Learning',
    'Linear Algebra & Optimization',
    'Mobile Development',
  ];

  const types: string[] = ['All', 'Notes', 'PDF', 'ExamPaper', 'Code'];

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
    const matchesType = selectedType === 'All' || res.type === selectedType;
    const matchesBookmarked = !bookmarkedOnly || res.isBookmarked;

    return matchesSearch && matchesSubject && matchesType && matchesBookmarked;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    addResource({
      title: uploadTitle,
      subject: uploadSubject,
      courseCode: uploadCourseCode,
      semester: uploadSemester,
      type: uploadType,
      author: 'Alex Rivera (Student)',
      authorRole: 'Peer Contributor',
      fileSize: '2.4 MB',
      tags: uploadTags.split(',').map((t) => t.trim()),
      contentPreview:
        uploadContent ||
        `# ${uploadTitle}\n\nComprehensive study notes covering ${uploadSubject} (${uploadCourseCode}).\n\nKey Concepts:\n- Active recall questions\n- Formula summaries and diagrams\n- Solved sample questions for exam preparation.`,
      verifiedByFaculty: false,
      fileFormat: uploadType === 'Code' ? 'KT/ZIP' : 'PDF',
    });

    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadContent('');
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Notes & Study Resources Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified lecture notes, past exam papers, formulas, code snippets & AI summaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Share Notes
            </button>

            <button
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                bookmarkedOnly
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-700 dark:text-amber-300 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              ⭐ Bookmarks ({resources.filter((r) => r.isBookmarked).length})
            </button>
          </div>
        </div>

        {/* Search Bar & Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic (e.g. 'Virtual Memory', 'Raft', 'Eigenvalues'), course code or author..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSubject === subj
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            {/* Document Type Filter */}
            <div className="flex items-center gap-1">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selectedType === t
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No study materials found
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Try adjusting your search query or subject filters
            </p>
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4.5 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {res.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Sem {res.semester}
                    </span>
                    {res.verifiedByFaculty && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleBookmarkResource(res.id)}
                    title={res.isBookmarked ? 'Remove Bookmark' : 'Bookmark Material'}
                    className={`p-1.5 rounded-xl transition-colors ${
                      res.isBookmarked
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {res.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Author: <span className="font-semibold">{res.author}</span> • Uploaded{' '}
                  {res.uploadDate}
                </p>

                {/* Preview text */}
                <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-mono line-clamp-3">
                  {res.contentPreview}
                </div>

                {/* Tag Pills */}
                <div className="flex items-center gap-1 flex-wrap mt-3">
                  {res.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Tools */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span>{res.fileFormat}</span>
                  <span>•</span>
                  <span>{res.fileSize}</span>
                  <span>•</span>
                  <span>{res.downloadCount} downloads</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedResourceForPreview(res)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read</span>
                  </button>

                  <button
                    onClick={() => downloadResource(res)}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resource Reader & AI Summarizer Modal */}
      {selectedResourceForPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedResourceForPreview(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                {selectedResourceForPreview.courseCode} • {selectedResourceForPreview.type}
              </span>
              {selectedResourceForPreview.verifiedByFaculty && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Faculty Certified Notes
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">
              {selectedResourceForPreview.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Subject: {selectedResourceForPreview.subject} • Author:{' '}
              {selectedResourceForPreview.author}
            </p>

            {/* Note Content Viewer */}
            <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-sans text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {selectedResourceForPreview.contentPreview}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmarkResource(selectedResourceForPreview.id)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      selectedResourceForPreview.isBookmarked ? 'fill-amber-500 text-amber-500' : ''
                    }`}
                  />
                  {selectedResourceForPreview.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedResourceForPreview(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    downloadResource(selectedResourceForPreview);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Download className="w-4 h-4" /> Download Markdown/PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share / Upload Resource Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" /> Share Study Material / Notes
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document / Notes Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Leader Election Cheat Sheet"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={uploadCourseCode}
                    onChange={(e) => setUploadCourseCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as ResourceType)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Notes">Lecture Notes</option>
                    <option value="PDF">PDF Textbook Chapter</option>
                    <option value="ExamPaper">Past Exam Paper</option>
                    <option value="Code">Code / Lab Solution</option>
                    <option value="Slides">Lecture Slides</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="e.g. Raft, Election, Distributed, Midterm"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes Content / Key Summary
                </label>
                <textarea
                  rows={4}
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  placeholder="Paste Markdown notes, core formulas, algorithm steps..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Upload & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
