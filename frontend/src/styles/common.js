// src/styles/common.js — Professional UI: clean slate + indigo/violet accent

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "bg-[#f8fafc] dark:bg-[#09090b] min-h-screen";
export const pageWrapper    = "max-w-4xl mx-auto px-5 py-12";
export const section        = "mb-12";

// ─── Cards ────────────────────────────────────────────
export const cardClass =
  "bg-white dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-200 cursor-pointer";

// ─── Typography ───────────────────────────────────────
export const pageTitleClass  = "text-4xl font-bold text-[#0f172a] dark:text-white tracking-tight mb-1";
export const headingClass    = "text-2xl font-bold text-[#0f172a] dark:text-white tracking-tight";
export const subHeadingClass = "text-base font-semibold text-[#0f172a] dark:text-white tracking-tight";
export const bodyText        = "text-[#64748b] dark:text-[#94a3b8] leading-relaxed text-sm";
export const mutedText       = "text-xs text-[#94a3b8] dark:text-[#71717a]";
export const linkClass       = "text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors font-medium";

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
  "bg-violet-600 dark:bg-violet-500 text-white font-semibold px-5 py-2 rounded-xl hover:bg-violet-700 dark:hover:bg-violet-600 active:scale-[0.97] transition-all cursor-pointer text-sm shadow-sm shadow-violet-200 dark:shadow-none";
export const secondaryBtn =
  "border border-[#e2e8f0] dark:border-[#3f3f46] bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#e4e4e7] font-medium px-5 py-2 rounded-xl hover:bg-[#f1f5f9] dark:hover:bg-[#27272a] active:scale-[0.97] transition-all cursor-pointer text-sm";
export const ghostBtn =
  "text-violet-600 dark:text-violet-400 font-medium hover:text-violet-800 dark:hover:text-violet-300 transition-colors cursor-pointer text-sm";
export const dangerBtn =
  "bg-rose-500 text-white font-semibold px-5 py-2 rounded-xl hover:bg-rose-600 active:scale-[0.97] transition-all cursor-pointer text-sm shadow-sm";
export const warningBtn =
  "bg-amber-500 text-white font-semibold px-5 py-2 rounded-xl hover:bg-amber-600 active:scale-[0.97] transition-all cursor-pointer text-sm shadow-sm";

// ─── Forms ────────────────────────────────────────────
export const formCard    = "bg-white dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] rounded-3xl p-8 max-w-md mx-auto shadow-xl shadow-slate-200/60 dark:shadow-black/40";
export const formTitle   = "text-2xl font-bold text-[#0f172a] dark:text-white tracking-tight text-center mb-2";
export const formSubtitle = "text-sm text-[#64748b] dark:text-[#94a3b8] text-center mb-6";
export const labelClass  = "text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] mb-1.5 block uppercase tracking-wider";
export const inputClass  =
  "w-full bg-[#f8fafc] dark:bg-[#27272a] border border-[#e2e8f0] dark:border-[#3f3f46] rounded-xl px-4 py-2.5 text-[#0f172a] dark:text-white text-sm placeholder:text-[#94a3b8] dark:placeholder:text-[#52525b] focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition";
export const formGroup   = "mb-4";
export const submitBtn   =
  "w-full bg-violet-600 dark:bg-violet-500 text-white font-semibold py-2.5 rounded-xl hover:bg-violet-700 transition-all cursor-pointer mt-2 text-sm shadow-sm shadow-violet-200 dark:shadow-none active:scale-[0.98]";
export const textareaClass =
  "w-full bg-[#f8fafc] dark:bg-[#27272a] border border-[#e2e8f0] dark:border-[#3f3f46] rounded-xl px-4 py-2.5 text-[#0f172a] dark:text-white text-sm placeholder:text-[#94a3b8] focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition resize-none";

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
  "bg-white/90 dark:bg-[#09090b]/95 backdrop-blur-xl border-b border-[#e2e8f0] dark:border-[#27272a] px-6 h-16 flex items-center sticky top-0 z-50 shadow-sm shadow-slate-200/50 dark:shadow-none";
export const navContainerClass  = "max-w-5xl mx-auto w-full flex items-center justify-between";
export const navBrandClass      = "text-base font-extrabold text-[#0f172a] dark:text-white tracking-tight";
export const navLinksClass      = "flex items-center gap-1";
export const navLinkClass       = "text-sm text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#18181b]";
export const navLinkActiveClass = "text-sm text-violet-600 dark:text-violet-400 font-semibold px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20";

// ─── Post Cards ───────────────────────────────────────
export const postGrid      = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
export const postCardClass =
  "bg-white dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] rounded-2xl overflow-hidden hover:shadow-lg dark:hover:shadow-black/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer";
export const postImageClass  = "w-full aspect-square object-cover";
export const postCardBody    = "p-4 flex flex-col gap-2";
export const postCaption     = "text-sm text-[#0f172a] dark:text-[#e4e4e7] leading-snug font-medium";
export const postMeta        = "text-xs text-[#94a3b8] dark:text-[#71717a] flex items-center gap-3";

// ─── Post Page ─────────────────────────────────────────
export const postPageWrapper  = "max-w-2xl mx-auto px-4 py-10";
export const postAuthorRow    = "flex items-center justify-between border-t border-b border-[#e2e8f0] dark:border-[#27272a] py-3 mb-4";
export const postActions      = "flex gap-4 mt-4 items-center";
export const likeBtn          = "flex items-center gap-1.5 text-sm text-[#64748b] dark:text-[#94a3b8] hover:text-rose-500 transition-colors cursor-pointer select-none";
export const likedBtn         = "flex items-center gap-1.5 text-sm text-rose-500 cursor-pointer select-none";
export const commentInputRow  = "flex gap-2 mt-5";

// ─── Profile ───────────────────────────────────────────
export const profileCard =
  "bg-white dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] rounded-2xl p-6 mb-6 shadow-sm";
export const profileAvatar   = "w-20 h-20 rounded-full object-cover";
export const profileStat     = "flex flex-col items-center cursor-pointer hover:opacity-70 transition min-w-[56px]";
export const profileStatNumber = "text-xl font-bold text-[#0f172a] dark:text-white";
export const profileStatLabel  = "text-[11px] text-[#94a3b8] dark:text-[#71717a] mt-0.5";
export const followBtn =
  "bg-violet-600 dark:bg-violet-500 text-white text-sm px-5 py-2 rounded-xl hover:bg-violet-700 transition active:scale-[0.97] cursor-pointer font-semibold shadow-sm shadow-violet-200 dark:shadow-none";
export const unfollowBtn =
  "border border-[#e2e8f0] dark:border-[#3f3f46] bg-white dark:bg-[#18181b] text-[#0f172a] dark:text-[#e4e4e7] text-sm px-5 py-2 rounded-xl hover:bg-[#f1f5f9] dark:hover:bg-[#27272a] transition active:scale-[0.97] cursor-pointer font-medium";
export const requestedBtn =
  "border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 text-sm px-5 py-2 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/20 transition active:scale-[0.97] cursor-pointer font-medium";

// ─── Avatar ───────────────────────────────────────────
export const avatar =
  "rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold";
export const avatarLg = "w-16 h-16 text-xl rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold";

// ─── Comments ─────────────────────────────────────────
export const commentsWrapper = "mt-6 flex flex-col gap-3";
export const commentCard =
  "bg-[#f8fafc] dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] rounded-2xl p-4 transition hover:bg-white dark:hover:bg-[#1f1f23]";
export const commentHeader   = "flex items-center justify-between mb-1";
export const commentUser     = "text-sm font-semibold text-[#0f172a] dark:text-white";
export const commentTime     = "text-[10px] text-[#94a3b8]";
export const commentText     = "text-[#475569] dark:text-[#d4d4d8] text-sm leading-relaxed mt-1";
export const commentUserRow  = "flex items-center gap-2.5";

// ─── Reply styles ─────────────────────────────────────
export const replyCard = "bg-white dark:bg-[#27272a] border border-[#e2e8f0] dark:border-[#3f3f46] rounded-xl p-3 ml-10 mt-2";
export const replyText = "text-[#475569] dark:text-[#d4d4d8] text-xs leading-relaxed mt-1";

// ─── Search ───────────────────────────────────────────
export const searchInput =
  "w-full bg-white dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] rounded-xl px-5 py-3 text-[#0f172a] dark:text-white text-sm placeholder:text-[#94a3b8] focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition shadow-sm";
export const searchResultCard =
  "flex items-center gap-3 p-3 rounded-xl hover:bg-[#f1f5f9] dark:hover:bg-[#27272a] transition-colors cursor-pointer";

// ─── Tabs ─────────────────────────────────────────────
export const tabBar     = "flex border-b border-[#e2e8f0] dark:border-[#27272a] mb-6 gap-1";
export const tabActive  = "px-4 py-2 text-sm font-semibold text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400 -mb-px cursor-pointer";
export const tabInactive = "px-4 py-2 text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white cursor-pointer transition-colors";

// ─── Admin ────────────────────────────────────────────
export const adminTableWrapper = "overflow-x-auto rounded-2xl border border-[#e2e8f0] dark:border-[#27272a] shadow-sm";
export const adminTable = "w-full text-sm";
export const adminTh    = "px-5 py-3.5 text-left text-xs font-bold text-[#64748b] dark:text-[#94a3b8] bg-[#f8fafc] dark:bg-[#18181b] border-b border-[#e2e8f0] dark:border-[#27272a] uppercase tracking-wider";
export const adminTd    = "px-5 py-3.5 text-[#0f172a] dark:text-[#e4e4e7] border-b border-[#f1f5f9] dark:border-[#27272a]";
export const badgeActive   = "text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 uppercase tracking-wide";
export const badgeInactive = "text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 uppercase tracking-wide";

// ─── Feedback ─────────────────────────────────────────
export const errorClass   = "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 rounded-xl px-4 py-3 text-sm";
export const successClass = "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-xl px-4 py-3 text-sm";
export const loadingClass = "text-violet-400/70 text-sm animate-pulse text-center py-16";
export const emptyStateClass = "text-center text-[#94a3b8] dark:text-[#52525b] py-16 text-sm";

// ─── Divider ──────────────────────────────────────────
export const divider = "border-t border-[#e2e8f0] dark:border-[#27272a] my-8";

// ─── Modal ────────────────────────────────────────────
export const modalOverlay = "fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm";
export const modalBox     = "bg-white dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] flex flex-col";
export const modalHeader  = "flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0] dark:border-[#27272a]";
export const modalTitle   = "text-base font-bold text-[#0f172a] dark:text-white";
export const modalBody    = "overflow-y-auto flex-1 px-3 py-2";

// ─── Badges ───────────────────────────────────────────
export const badgePrivate = "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase tracking-wide";
export const badgePublic  = "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 uppercase tracking-wide";
