// src/styles/common.js
// Theme: Apple Light — white/f5f5f7 background, #1d1d1f text, #0066cc accent
// Inspired by apple.com — no gradients, no shadows, pure typography & spacing

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "bg-white min-h-screen";
export const pageWrapper = "max-w-5xl mx-auto px-6 py-16";
export const section = "mb-14";

// ─── Cards ────────────────────────────────────────────
export const cardClass =
  "bg-[#f5f5f7] rounded-2xl p-7 hover:bg-[#ebebf0] transition-colors duration-200 cursor-pointer";

// ─── Typography ───────────────────────────────────────
export const pageTitleClass = "text-5xl font-bold text-[#1d1d1f] tracking-tight leading-none mb-2";
export const headingClass = "text-2xl font-bold text-[#1d1d1f] tracking-tight";
export const subHeadingClass = "text-lg font-semibold text-[#1d1d1f] tracking-tight";
export const bodyText = "text-[#6e6e73] leading-relaxed";
export const mutedText = "text-sm text-[#a1a1a6]";
export const linkClass = "text-[#0066cc] hover:text-[#004499] transition-colors";

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
  "bg-[#0066cc] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#004499] transition-colors cursor-pointer text-sm tracking-tight";
export const secondaryBtn =
  "border border-[#d2d2d7] text-[#1d1d1f] font-medium px-5 py-2 rounded-full hover:bg-[#f5f5f7] transition-colors cursor-pointer text-sm";
export const ghostBtn = "text-[#0066cc] font-medium hover:text-[#004499] transition-colors cursor-pointer text-sm";

// ─── Forms ────────────────────────────────────────────
export const formCard = "bg-[#f5f5f7] rounded-2xl p-10 max-w-4xl mx-auto";
export const formTitle = "text-2xl font-bold text-[#1d1d1f] tracking-tight text-center mb-7";
export const labelClass = "text-xs font-medium text-[#6e6e73] mb-1.5 block";
export const inputClass =
  "w-full bg-white border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-[#1d1d1f] text-sm placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition";
export const formGroup = "mb-4";
export const submitBtn =
  "w-full bg-[#0066cc] text-white font-semibold py-2.5 rounded-full hover:bg-[#004499] transition-colors cursor-pointer mt-2 text-sm tracking-tight";

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
  "bg-white/85 backdrop-blur-xl backdrop-saturate-150 border-b border-[#e8e8ed] px-8 h-[52px] flex items-center sticky top-0 z-50";
export const navContainerClass = "max-w-5xl mx-auto w-full flex items-center justify-between ";
export const navBrandClass = "text-base font-semibold text-[#1d1d1f] tracking-tight";
export const navLinksClass = "flex items-center gap-7";
export const navLinkClass = "text-2xl text-[#6e6e73] hover:text-[#1d1d1f] transition-colors font-normal";
export const navLinkActiveClass = "text-2xl text-[#0066cc] font-medium";

// ─── Article / Blog ───────────────────────────────────
//export const articleGrid        = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e8e8ed] border border-[#e8e8ed] rounded-2xl overflow-hidden"
export const articleGrid = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
export const articleCardClass =
  "bg-[#f5f5f7] p-7 hover:bg-[#ebebf0] transition-colors duration-200 flex flex-col gap-2.5 cursor-pointer";
export const articleTitle = "text-base font-semibold text-[#1d1d1f] leading-snug tracking-tight";
export const articleExcerpt = "text-sm text-[#6e6e73] leading-relaxed";
export const articleMeta = "text-xs text-[#a1a1a6]";
export const articleBody = "text-[#6e6e73] leading-[1.85] text-[0.95rem] max-w-2xl";
export const timestampClass = "text-xs text-[#a1a1a6] flex items-center gap-1.5";
export const tagClass = "text-[0.65rem] font-semibold text-[#0066cc] uppercase tracking-widest w-fit";

// ─── Article Page ─────────────────────────────────────
export const articlePageWrapper = "max-w-3xl mx-auto px-6 py-14";

export const articleHeader = "mb-10 flex flex-col gap-4";

export const articleCategory = "text-[0.7rem] font-semibold uppercase tracking-widest text-[#0066cc]";

export const articleMainTitle = "text-4xl font-bold text-[#1d1d1f] leading-tight tracking-tight";

export const articleAuthorRow =
  "flex items-center justify-between border-t border-b border-[#e8e8ed] py-4 text-sm text-[#6e6e73]";

export const authorInfo = "flex items-center gap-2 font-medium text-[#1d1d1f]";

export const articleContent = "text-[#1d1d1f] leading-[1.9] text-[1rem] whitespace-pre-line mt-8";

export const articleFooter = "border-t border-[#e8e8ed] mt-12 pt-6 text-sm text-[#a1a1a6]";
// ─── Article Actions ─────────────────────────────
export const articleActions = "flex gap-3 mt-6";

export const editBtn = "bg-[#0066cc] text-white text-sm px-4 py-2 rounded-full hover:bg-[#004499] transition";

export const deleteBtn = "bg-[#ff3b30] text-white text-sm px-4 py-2 rounded-full hover:bg-[#d62c23] transition";

// ─── Article Status Badge ─────────────────────────
export const articleStatusActive =
  "absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-[#34c759]/20 text-[#248a3d]";

export const articleStatusDeleted =
  "absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-[#ff3b30]/20 text-[#cc2f26]";

// ─── Feedback ─────────────────────────────────────────
export const errorClass =
  "bg-[#ff3b30]/[0.06] text-[#cc2f26] border border-[#ff3b30]/[0.18] rounded-xl px-4 py-3 text-sm";
export const successClass =
  "bg-[#34c759]/[0.07] text-[#248a3d] border border-[#34c759]/20 rounded-xl px-4 py-3 text-sm";
export const loadingClass = "text-[#0066cc]/60 text-sm animate-pulse text-center py-10";
export const emptyStateClass = "text-center text-[#a1a1a6] py-16 text-sm";

// ─── Comments ───────────────────────────────────────
export const commentsWrapper = "mt-12 flex flex-col gap-6";

export const commentCard = "bg-[#f5f5f7] rounded-2xl p-5 transition hover:bg-[#ebebf0]";

export const commentHeader = "flex items-center justify-between mb-2";

export const commentUser = "text-sm font-semibold text-[#1d1d1f]";

export const commentTime = "text-xs text-[#a1a1a6]";

export const commentText = "text-[#1d1d1f] text-sm leading-relaxed mt-1";

export const avatar =
  "w-9 h-9 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-sm font-semibold";

export const commentUserRow = "flex items-center gap-3";

// ─── Divider ──────────────────────────────────────────
export const divider = "border-t border-[#e8e8ed] my-10";
