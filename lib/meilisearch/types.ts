// ========================= RAW DATA ==========================
/**
 * Types for Raw Course Data (Converted from XML to JSON in data/raw)
 */
export interface RawCourseData {
  year: string[];
  subject: string[];
  code: string[];
  title: string[];
  description: string[];
  gers: string[];
  repeatable: string[];
  grading: string[];
  unitsMin: string[];
  unitsMax: string[];
  learningObjectives: any[];
  sections: [
    {
      section: RawSectionData[];
    },
  ];
  administrativeInformation: RawAdminInfo[];
  attributes: any[];
  tags: any[];
}
export interface RawAdminInfo {
  courseId: string[];
  effectiveStatus: string[];
  offerNumber: string[];
  academicGroup: string[];
  academicOrganization: string[];
  academicCareer: string[];
  finalExamFlag: string[];
  catalogPrint: string[];
  schedulePrint: string[];
  maxUnitsRepeat: string[];
  maxTimesRepeat: string[];
}

/**
 * Types for Raw Section Data (Converted from XML to JSON in data/raw)
 */
export interface RawSectionData {
  classId: string[];
  term: string[];
  termId: string[];
  subject: string[];
  code: string[];
  units: string[];
  sectionNumber: string[];
  component: string[];
  numEnrolled: string[];
  maxEnrolled: string[];
  numWaitlist: string[];
  maxWaitlist: string[];
  enrollStatus: string[];
  addConsent: string[];
  dropConsent: string[];
  courseId: string[];
  schedules: [
    {
      schedule: RawSchedule[];
    },
  ];
  currentClassSize: string[];
  maxClassSize: string[];
  currentWaitlistSize: string[];
  maxWaitlistSize: string[];
  notes: string[];
  attributes: any[];
}
export interface RawSchedule {
  startDate: string[];
  endDate: string[];
  startTime: string[];
  endTime: string[];
  location: string[];
  days: string[];
  instructors: [
    {
      instructor: RawInstructor[];
    },
  ];
}
export interface RawInstructor {
  name: string[];
  firstName: string[];
  middleName: string[];
  lastName: string[];
  sunet: string[];
  role: string[];
}

// ========================= PARSED DATA ========================
/**
 * Types for Parsed Course Data
 */
export interface ParsedCourseData {
  // Makes a unique identifier (when combined)
  subject: string;
  code: string;
  // The course title.
  title: string;
  // The course description.
  description: string;
  // The GERs that this course satiates.
  gers: string[];
  // The minimum units this course is offered at
  minUnits: number;
  // The maximum units this course is offered at
  maxUnits: number;
  // Top three primary instructors.
  top3Instructors: ParsedInstructor[];
  // The terms that this course has sections in.
  terms: Quarter[];
  // the times for the important sections (not discussions or lab sections)
  termLectureTimes: ParsedTermLectureTimes;
}
/**
 * Types for Parsed Section Data
 */
export interface ParsedSectionData {
  // The course id that this section is attached to.
  courseId: string;
  // Whether the "section" is a lecture, discussion, or other
  component?: string;
  // Data & Location of Section
  startDate?: {
    m: number;
    d: number;
    y: number;
  };
  endDate?: {
    m: number;
    d: number;
    y: number;
  };
  startTime?: {
    h: number;
    m: number;
  };
  endTime?: {
    h: number;
    m: number;
  };
  // string time format for FullCalendar
  startTimeCalString?: string;
  endTimeCalString?: string;
  dayLetters?: ("M" | "T" | "W" | "Th" | "F")[];
  // day of week format for FullCalendar
  dayNumbers?: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
  location?: string;
}

export interface ParsedTermLectureTimes {
  AUT?: ParsedSectionData[];
  WIN?: ParsedSectionData[];
  SPR?: ParsedSectionData[];
  SUM?: ParsedSectionData[];
}

export interface ParsedInstructor {
  name: string;
  sunet: string;
  role: "PI" | "SI";
}
// ====================== GPT ENHANCED DATA =====================
/**
 * Types for Enhanced Course Data
 */
export interface EnhancedCourseData extends ParsedCourseData {
  keywords?: string[];
}

// ===================== MEILISEARCH DATA =======================
/**
 * Types for Meilisearch Course Documents
 */
export interface MeiliCourseDocument extends EnhancedCourseData {}
/**
 * Types for Meilisearch Section Documents
 */
export interface MeiliSectionDocument extends ParsedSectionData {}

// ========================= OTHER COURSE INFO ===================
export interface AllDataJSON {
  courses: ParsedCourseData[];
  sections: ParsedSectionData[];
  ".lastSynced": string;
}
// ======================== ALL THE GERs ==========================
export const listOfGERs = [
  "WAY-A-II",
  "WAY-AQR",
  "WAY-CE",
  "WAY-EDP",
  "WAY-ER",
  "WAY-FR",
  "WAY-SI",
  "WAY-SMA",
  "Language",
  "Writing 1",
  "Writing 2",
  "Writing SLE",
  "DB:Hum",
  "DB:Math",
  "DB:SocSci",
  "DB:EngrAppSci",
  "DB:NatSci",
  "EC:EthicReas",
  "EC:GlobalCom",
  "EC:AmerCul",
  "EC:Gender",
  "IHUM1",
  "IHUM2",
  "IHUM3",
];

export type Quarter = "AUT" | "WIN" | "SPR" | "SUM";
