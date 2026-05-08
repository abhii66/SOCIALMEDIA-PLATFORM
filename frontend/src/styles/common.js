// src/styles/common.js
// Theme: supports both light (Apple-style) and dark mode via Tailwind dark: classes

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "bg-white dark:bg-[#0f0f0f] min-h-screen";
export const pageWrapper = "max-w-5xl mx-auto px-6 py-16";
export const section = "mb-14";

// ─── Cards ────────────────────────────────────────────
export const cardClass =
  "bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-7 hover:bg-[#ebebf0] dark:hover:bg-[#2c2c2e] transition-colors duration-200 cursor-pointer";

// ─── Typography ───────────────────────────────────────
export const pageTitleClass = "text-5xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-none mb-2";
export const headingClass = "text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight";
export const subHeadingClass = "text-lg font-semibold text-[#1d1d1f] dark:text-white tracking-tight";
export const bodyText = "text-[#6e6e73] dark:text-[#98989d] leading-relaxed";
export const mutedText = "text-sm text-[#a1a1a6] dark:text-[#6e6e73]";
export const linkClass = "text-[#0066cc] dark:text-[#3399ff] hover:text-[#004499] dark:hover:text-[#1a7de6] transition-colors";

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
  "bg-[#0066cc] dark:bg-[#3399ff] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#004499] dark:hover:bg-[#1a7de6] transition-colors cursor-pointer text-sm tracking-tight";
export const secondaryBtn =
  "border border-[#d2d2d7] dark:border-[#38383a] text-[#1d1d1f] dark:text-white font-medium px-5 py-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors cursor-pointer text-sm";
export const ghostBtn = "text-[#0066cc] dark:text-[#3399ff] font-medium hover:text-[#004499] transition-colors cursor-pointer text-sm";
export const dangerBtn =
  "bg-[#ff3b30] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#d62c23] transition-colors cursor-pointer text-sm";

// ─── Forms ────────────────────────────────────────────
export const formCard = "bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-10 max-w-4xl mx-auto";
export const formTitle = "text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight text-center mb-7";
export const labelClass = "text-xs font-medium text-[#6e6e73] dark:text-[#98989d] mb-1.5 block";
export const inputClass =
  "w-full bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-xl px-4 py-2.5 text-[#1d1d1f] dark:text-white text-sm placeholder:text-[#a1a1a6] dark:placeholder:text-[#48484a] focus:outline-none focus:border-[#0066cc] dark:focus:border-[#3399ff] focus:ring-2 focus:ring-[#0066cc]/10 transition";
export const formGroup = "mb-4";
export const submitBtn =
  "w-full bg-[#0066cc] dark:bg-[#3399ff] text-white font-semibold py-2.5 rounded-full hover:bg-[#004499] transition-colors cursor-pointer mt-2 text-sm tracking-tight";
export const textareaClass =
  "w-full bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-xl px-4 py-2.5 text-[#1d1d1f] dark:text-white text-sm placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] dark:focus:border-[#3399ff] focus:ring-2 focus:ring-[#0066cc]/10 transition resize-none";

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
  "bg-white/85 dark:bg-[#0f0f0f]/90 backdrop-blur-xl backdrop-saturate-150 border-b border-[#e8e8ed] dark:border-[#38383a] px-8 h-[52px] flex items-center sticky top-0 z-50";
export const navContainerClass = "max-w-5xl mx-auto w-full flex items-center justify-between";
export const navBrandClass = "text-base font-semibold text-[#1d1d1f] dark:text-white tracking-tight";
export const navLinksClass = "flex items-center gap-7";
export const navLinkClass = "text-sm text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white transition-colors font-normal";
export const navLinkActiveClass = "text-sm text-[#0066cc] dark:text-[#3399ff] font-medium";

// ─── Post Card ────────────────────────────────────────
export const postGrid = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
export const postCardClass =
  "bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl overflow-hidden hover:bg-[#ebebf0] dark:hover:bg-[#2c2c2e] transition-colors duration-200 cursor-pointer";
export const postImageClass = "w-full aspect-square object-cover";
export const postCardBody = "p-4 flex flex-col gap-2";
export const postCaption = "text-sm text-[#1d1d1f] dark:text-white leading-snug";
export const postMeta = "text-xs text-[#a1a1a6] dark:text-[#6e6e73] flex items-center gap-3";

// ─── Post Page ─────────────────────────────────────────
export const postPageWrapper = "max-w-2xl mx-auto px-6 py-10";
export const postAuthorRow =
  "flex items-center justify-between border-t border-b border-[#e8e8ed] dark:border-[#38383a] py-3 mb-4";
export const postActions = "flex gap-4 mt-4 items-center";
export const likeBtn = "flex items-center gap-1.5 text-sm text-[#6e6e73] dark:text-[#98989d] hover:text-[#ff3b30] transition-colors cursor-pointer";
export const likedBtn = "flex items-center gap-1.5 text-sm text-[#ff3b30] cursor-pointer";
export const commentInputRow = "flex gap-2 mt-4";

// ─── Profile ───────────────────────────────────────────
export const profileCard = "bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#38383a] rounded-3xl p-6 mb-8 shadow-sm";
export const profileAvatar =
  "w-20 h-20 rounded-full bg-[#0066cc]/10 dark:bg-[#3399ff]/20 text-[#0066cc] dark:text-[#3399ff] flex items-center justify-center text-2xl font-semibold object-cover";
export const profileStat = "flex flex-col items-center cursor-pointer hover:opacity-70 transition";
export const profileStatNumber = "text-xl font-bold text-[#1d1d1f] dark:text-white";
export const profileStatLabel = "text-xs text-[#a1a1a6] dark:text-[#6e6e73]";
export const followBtn =
  "bg-[#0066cc] dark:bg-[#3399ff] text-white text-sm px-5 py-1.5 rounded-full hover:bg-[#004499] transition cursor-pointer font-medium";
export const unfollowBtn =
  "border border-[#d2d2d7] dark:border-[#38383a] text-[#1d1d1f] dark:text-white text-sm px-5 py-1.5 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition cursor-pointer font-medium";

// ─── Avatar ───────────────────────────────────────────
export const avatar =
  "w-9 h-9 rounded-full bg-[#0066cc]/10 dark:bg-[#3399ff]/20 text-[#0066cc] dark:text-[#3399ff] flex items-center justify-center text-sm font-semibold";
export const avatarLg =
  "w-16 h-16 rounded-full bg-[#0066cc]/10 dark:bg-[#3399ff]/20 text-[#0066cc] dark:text-[#3399ff] flex items-center justify-center text-xl font-semibold";

// ─── Comments ─────────────────────────────────────────
export const commentsWrapper = "mt-6 flex flex-col gap-4";
export const commentCard = "bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-4 transition hover:bg-[#ebebf0] dark:hover:bg-[#2c2c2e]";
export const commentHeader = "flex items-center justify-between mb-1";
export const commentUser = "text-sm font-semibold text-[#1d1d1f] dark:text-white";
export const commentTime = "text-xs text-[#a1a1a6] dark:text-[#6e6e73]";
export const commentText = "text-[#1d1d1f] dark:text-[#e5e5ea] text-sm leading-relaxed mt-1";
export const commentUserRow = "flex items-center gap-3";

// ─── Reply styles ─────────────────────────────────────
export const replyCard = "bg-white dark:bg-[#2c2c2e] rounded-xl p-3 ml-10 mt-2";
export const replyText = "text-[#1d1d1f] dark:text-[#e5e5ea] text-xs leading-relaxed mt-1";

// ─── Search ───────────────────────────────────────────
export const searchInput =
  "w-full bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-[#d2d2d7] dark:border-[#38383a] rounded-full px-5 py-2.5 text-[#1d1d1f] dark:text-white text-sm placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] dark:focus:border-[#3399ff] focus:ring-2 focus:ring-[#0066cc]/10 transition";
export const searchResultCard =
  "flex items-center gap-3 p-3 rounded-2xl hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e] transition-colors cursor-pointer";

// ─── Tabs ─────────────────────────────────────────────
export const tabBar = "flex border-b border-[#e8e8ed] dark:border-[#38383a] mb-6";
export const tabActive = "px-5 py-2.5 text-sm font-semibold text-[#0066cc] dark:text-[#3399ff] border-b-2 border-[#0066cc] dark:border-[#3399ff] -mb-px cursor-pointer";
export const tabInactive = "px-5 py-2.5 text-sm font-normal text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer transition-colors";

// ─── Admin ────────────────────────────────────────────
export const adminTableWrapper = "overflow-x-auto rounded-2xl border border-[#e8e8ed] dark:border-[#38383a]";
export const adminTable = "w-full text-sm";
export const adminTh = "px-4 py-3 text-left text-xs font-semibold text-[#6e6e73] dark:text-[#98989d] bg-[#f5f5f7] dark:bg-[#1c1c1e] border-b border-[#e8e8ed] dark:border-[#38383a]";
export const adminTd = "px-4 py-3 text-[#1d1d1f] dark:text-white border-b border-[#e8e8ed] dark:border-[#38383a]";
export const badgeActive = "text-[10px] font-semibold px-2 py-1 rounded-full bg-[#34c759]/20 text-[#248a3d]";
export const badgeInactive = "text-[10px] font-semibold px-2 py-1 rounded-full bg-[#ff3b30]/20 text-[#cc2f26]";

// ─── Feedback ─────────────────────────────────────────
export const errorClass =
  "bg-[#ff3b30]/[0.06] text-[#cc2f26] border border-[#ff3b30]/[0.18] rounded-xl px-4 py-3 text-sm";
export const successClass =
  "bg-[#34c759]/[0.07] text-[#248a3d] border border-[#34c759]/20 rounded-xl px-4 py-3 text-sm";
export const loadingClass = "text-[#0066cc]/60 dark:text-[#3399ff]/60 text-sm animate-pulse text-center py-10";
export const emptyStateClass = "text-center text-[#a1a1a6] dark:text-[#48484a] py-16 text-sm";

// ─── Divider ──────────────────────────────────────────
export const divider = "border-t border-[#e8e8ed] dark:border-[#38383a] my-10";

// ─── Modal ────────────────────────────────────────────
export const modalOverlay = "fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4";
export const modalBox = "bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl w-full max-w-sm max-h-[80vh] flex flex-col";
export const modalHeader = "flex items-center justify-between px-6 py-4 border-b border-[#e8e8ed] dark:border-[#38383a]";
export const modalTitle = "text-base font-semibold text-[#1d1d1f] dark:text-white";
export const modalBody = "overflow-y-auto flex-1 px-4 py-3";
