import logger from "../utils/logger";

// ── Mock data ────────────────────────────────────────────────────────────────
// Realistic campus notifications (20 per type + mixed All view)
const MOCK_NOTIFICATIONS = [
  // ── Placement (20) ──────────────────────────────────────────────────────
  { ID: "p01", Type: "Placement", Message: "TCS has opened applications for the 2025 batch. Apply before 25 Jun.", Timestamp: "2026-06-18T09:00:00" },
  { ID: "p02", Type: "Placement", Message: "Infosys Selection Round 1 results declared – 42 students shortlisted.", Timestamp: "2026-06-17T14:30:00" },
  { ID: "p03", Type: "Placement", Message: "Wipro technical interview scheduled for 20 Jun at 10:00 AM – Lab 3.", Timestamp: "2026-06-17T11:00:00" },
  { ID: "p04", Type: "Placement", Message: "Accenture offers extended to 18 CSE students. Offer letters sent to mail.", Timestamp: "2026-06-16T16:45:00" },
  { ID: "p05", Type: "Placement", Message: "Amazon SDE Intern drive on 22 Jun. Register on the placement portal by 19 Jun.", Timestamp: "2026-06-16T10:00:00" },
  { ID: "p06", Type: "Placement", Message: "Cognizant GEN C Next – Aptitude test link sent to registered emails.", Timestamp: "2026-06-15T09:30:00" },
  { ID: "p07", Type: "Placement", Message: "HCL Technologies campus drive – walk-in on 24 Jun, Hall B.", Timestamp: "2026-06-14T13:00:00" },
  { ID: "p08", Type: "Placement", Message: "Microsoft Explore Internship: 5 students from CSE selected. Congratulations!", Timestamp: "2026-06-14T08:00:00" },
  { ID: "p09", Type: "Placement", Message: "Capgemini Round 2 (Technical) on 21 Jun. Syllabus: DSA + DBMS.", Timestamp: "2026-06-13T15:00:00" },
  { ID: "p10", Type: "Placement", Message: "Deloitte UST hiring – 30 seats open for ECE & CSE final year.", Timestamp: "2026-06-13T10:00:00" },
  { ID: "p11", Type: "Placement", Message: "L&T Infotech pre-placement talk on 19 Jun at 3 PM – Auditorium.", Timestamp: "2026-06-12T17:00:00" },
  { ID: "p12", Type: "Placement", Message: "Zoho off-campus drive – apply via placement cell by 23 Jun.", Timestamp: "2026-06-12T11:00:00" },
  { ID: "p13", Type: "Placement", Message: "Advanced Micro Devices (AMD) hiring 5 VLSI interns – EEE/ECE only.", Timestamp: "2026-06-11T09:00:00" },
  { ID: "p14", Type: "Placement", Message: "Flipkart SDE-1 drive postponed to 28 Jun. New schedule on portal.", Timestamp: "2026-06-11T08:00:00" },
  { ID: "p15", Type: "Placement", Message: "Mindtree placement registration closing today 11:59 PM.", Timestamp: "2026-06-10T18:00:00" },
  { ID: "p16", Type: "Placement", Message: "IBM Z Day – IBM mainframe internship applications now open.", Timestamp: "2026-06-10T10:00:00" },
  { ID: "p17", Type: "Placement", Message: "Oracle Database Admin role – 8 seats. Resume submission by 15 Jun.", Timestamp: "2026-06-09T12:00:00" },
  { ID: "p18", Type: "Placement", Message: "Tech Mahindra final round results: 12 selected from our campus.", Timestamp: "2026-06-09T09:30:00" },
  { ID: "p19", Type: "Placement", Message: "Persistent Systems coding test – 25 Jun, 2 PM. LeetCode medium level.", Timestamp: "2026-06-08T14:00:00" },
  { ID: "p20", Type: "Placement", Message: "CSX Corporation hiring for data analyst role. 2026 batch eligible.", Timestamp: "2026-06-08T09:00:00" },

  // ── Result (20) ──────────────────────────────────────────────────────────
  { ID: "r01", Type: "Result", Message: "Semester 6 results published. SGPA: 8.4 | CGPA: 8.1. Check portal for marksheet.", Timestamp: "2026-06-18T08:00:00", extra: { sgpa: 8.4, cgpa: 8.1 } },
  { ID: "r02", Type: "Result", Message: "Mid-Semester Exam results – Machine Learning: 18/25, DBMS: 22/25, OS: 20/25.", Timestamp: "2026-06-17T10:00:00", extra: { subjects: { "Machine Learning": "Pass 18/25", DBMS: "Pass 22/25", OS: "Pass 20/25" } } },
  { ID: "r03", Type: "Result", Message: "Re-Mid exam result for Software Engineering declared. 3 students cleared backlog.", Timestamp: "2026-06-16T09:00:00" },
  { ID: "r04", Type: "Result", Message: "Semester 4 re-evaluation result: 7 students upgraded grade. Check portal.", Timestamp: "2026-06-15T11:00:00" },
  { ID: "r05", Type: "Result", Message: "Mid-Sem results – CN: 19/25, Compiler Design: 15/25 (2 failed – re-mid on 30 Jun).", Timestamp: "2026-06-15T08:00:00", extra: { subjects: { "Computer Networks": "Pass 19/25", "Compiler Design": "Fail 15/25" } } },
  { ID: "r06", Type: "Result", Message: "Semester 5 supplementary exam results out. 5 students cleared all arrears.", Timestamp: "2026-06-14T14:00:00" },
  { ID: "r07", Type: "Result", Message: "Project review marks updated. Phase 1 avg: 82/100 across CSE sections.", Timestamp: "2026-06-14T10:00:00", extra: { label: "Project Review Phase 1", avg: "82/100" } },
  { ID: "r08", Type: "Result", Message: "Semester 8 final CGPA published. Graduation list submitted to affiliating university.", Timestamp: "2026-06-13T16:00:00" },
  { ID: "r09", Type: "Result", Message: "Internal assessment marks Sem 6 finalized. Discrepancy window open till 20 Jun.", Timestamp: "2026-06-13T09:00:00" },
  { ID: "r10", Type: "Result", Message: "Mid-Sem result – AI & ML: 21/25, Big Data: 17/25, Cloud: 23/25.", Timestamp: "2026-06-12T10:00:00", extra: { subjects: { "AI & ML": "Pass 21/25", "Big Data": "Pass 17/25", "Cloud Computing": "Pass 23/25" } } },
  { ID: "r11", Type: "Result", Message: "Semester 3 result re-announced after moderation. Average SGPA improved to 7.6.", Timestamp: "2026-06-12T08:00:00" },
  { ID: "r12", Type: "Result", Message: "Quiz 2 marks uploaded for all Sem 6 subjects. Check LMS.", Timestamp: "2026-06-11T15:00:00" },
  { ID: "r13", Type: "Result", Message: "Re-Mid exam for Data Structures scheduled 28 Jun. 4 students registered.", Timestamp: "2026-06-11T10:00:00" },
  { ID: "r14", Type: "Result", Message: "Semester 7 CGPA reports sent to HODs. Dean approval pending.", Timestamp: "2026-06-10T11:00:00" },
  { ID: "r15", Type: "Result", Message: "External lab exam results – Networks Lab: 46/50, OS Lab: 44/50.", Timestamp: "2026-06-10T09:00:00" },
  { ID: "r16", Type: "Result", Message: "Semester 1 supplementary results declared. 2 students cleared Mathematics-I.", Timestamp: "2026-06-09T14:00:00" },
  { ID: "r17", Type: "Result", Message: "Mid-Sem result – project-review score: 38/50. Phase 2 starts 1 Jul.", Timestamp: "2026-06-09T10:00:00" },
  { ID: "r18", Type: "Result", Message: "Semester 6 SGPA updated after internal mark correction. Check updated report card.", Timestamp: "2026-06-08T16:00:00" },
  { ID: "r19", Type: "Result", Message: "External practical exam result for ECE Sem 4 declared. All 62 students passed.", Timestamp: "2026-06-08T11:00:00" },
  { ID: "r20", Type: "Result", Message: "Mid-Sem results summary: 3 subjects – Pass: 58, Fail: 4. Re-mid registrations open.", Timestamp: "2026-06-07T09:00:00" },

  // ── Event (20) ───────────────────────────────────────────────────────────
  { ID: "e01", Type: "Event", Message: "Science Fair 2026 – Registration open. Submit abstracts by 25 Jun. Prizes up to ₹50,000.", Timestamp: "2026-06-18T07:30:00" },
  { ID: "e02", Type: "Event", Message: "Robotics Competition 'RoboWars' on 5 Jul. Team size: 3–5. Register at tech cell.", Timestamp: "2026-06-17T09:00:00" },
  { ID: "e03", Type: "Event", Message: "Sparkil 2026 – Annual Technical Fest begins 10 Jul. Event list on sparkil.in.", Timestamp: "2026-06-17T08:00:00" },
  { ID: "e04", Type: "Event", Message: "Farewell ceremony for 2022–26 batch on 28 Jun at 6 PM – College Auditorium.", Timestamp: "2026-06-16T12:00:00" },
  { ID: "e05", Type: "Event", Message: "Tech-Fest hackathon 'Code Storm' – 24-hour event, 29 Jun. Teams of 4. Register now.", Timestamp: "2026-06-16T09:00:00" },
  { ID: "e06", Type: "Event", Message: "Guest lecture on Generative AI by Dr. Ramesh Babu (IIT-M) – 21 Jun 11 AM, Seminar Hall.", Timestamp: "2026-06-15T10:00:00" },
  { ID: "e07", Type: "Event", Message: "Cultural Fest 'Utsav 2026' – 3-day event starting 1 Jul. Registrations open.", Timestamp: "2026-06-15T08:00:00" },
  { ID: "e08", Type: "Event", Message: "IEEE Student Chapter meeting – 20 Jun 4 PM. New project proposals to be discussed.", Timestamp: "2026-06-14T11:00:00" },
  { ID: "e09", Type: "Event", Message: "Debate Competition on 'AI replacing jobs' – 22 Jun. Reach dept coordinator to register.", Timestamp: "2026-06-14T09:00:00" },
  { ID: "e10", Type: "Event", Message: "Blood Donation Camp on campus – 19 Jun 9 AM–1 PM. Volunteers welcome.", Timestamp: "2026-06-13T14:00:00" },
  { ID: "e11", Type: "Event", Message: "Freshers Welcome Party for 2025 batch – 27 Jun 5 PM, College Grounds.", Timestamp: "2026-06-13T10:00:00" },
  { ID: "e12", Type: "Event", Message: "Workshop on PCB Design using KiCad – 20 & 21 Jun. Limited seats – ECE/EEE priority.", Timestamp: "2026-06-12T09:00:00" },
  { ID: "e13", Type: "Event", Message: "Entrepreneurship Summit 'IgniteX' on 2 Jul. Startup pitches, VC panel. Free entry.", Timestamp: "2026-06-12T08:00:00" },
  { ID: "e14", Type: "Event", Message: "Photography Contest 'Lens & Life' – submit entries by 30 Jun. Theme: Campus Life.", Timestamp: "2026-06-11T12:00:00" },
  { ID: "e15", Type: "Event", Message: "Annual Sports Meet begins 6 Jul. Event registration on sports portal. Last date: 24 Jun.", Timestamp: "2026-06-11T09:00:00" },
  { ID: "e16", Type: "Event", Message: "Paper presentation at 'TechVision 2026' – 3 Jul. Submit papers by 26 Jun.", Timestamp: "2026-06-10T14:00:00" },
  { ID: "e17", Type: "Event", Message: "Yoga & Wellness Day on 21 Jun (International Yoga Day). 7 AM, College Grounds.", Timestamp: "2026-06-10T08:00:00" },
  { ID: "e18", Type: "Event", Message: "Alumni Meet 2026 – 4 Jul. Alumni registration portal now open. Network & Connect.", Timestamp: "2026-06-09T11:00:00" },
  { ID: "e19", Type: "Event", Message: "NSS Camp volunteer registration – deadline 22 Jun. 7-day camp in Medak district.", Timestamp: "2026-06-09T09:00:00" },
  { ID: "e20", Type: "Event", Message: "Inter-college quiz 'MindSpark' on 25 Jun. Our team qualified for finals. Best wishes!", Timestamp: "2026-06-08T10:00:00" },
];

// Sort by newest first
MOCK_NOTIFICATIONS.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

// ── API function ─────────────────────────────────────────────────────────────
export async function fetchNotifications({ page = 1, limit = 10, notification_type } = {}) {
  logger.info("API", "fetchNotifications called", { page, limit, notification_type });

  // Simulate small network delay
  await new Promise((r) => setTimeout(r, 300));

  let filtered = MOCK_NOTIFICATIONS;
  if (notification_type && notification_type !== "All") {
    filtered = MOCK_NOTIFICATIONS.filter((n) => n.Type === notification_type);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const notifications = filtered.slice(start, start + limit);

  logger.info("API", "fetchNotifications success", { count: notifications.length, total, page });

  return { notifications, total };
}
