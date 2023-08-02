export const MUI_COLORS = {
  red: "#D32F2F",
  pink: "#C2185B",
  purple: "#7B1FA2",
  deepPurple: "#512DA8",
  indigo: "#303F9F",
  blue: "#1976D2",
  lightBlue: "#0288D1",
  cyan: "#0097A7",
  teal: "#00796B",
  green: "#388E3C",
  lightGreen: "#689F38",
  lime: "#AFB42B",
  yellow: "#FBC02D",
  amber: "#FFA000",
  orange: "#F57C00",
  deepOrange: "#E64A19"
}

export const dummyCalCourses = [
  {
    title: 'CS Lecture',
    startTime: '09:30', // https://fullcalendar.io/docs/duration-object
    endTime: '10:20', // https://fullcalendar.io/docs/duration-object
    daysOfWeek: [1, 3, 5], // 0 is Sunday, 1 Monday, etc. This is MWF
    backgroundColor: MUI_COLORS.red,
    borderColor: "transparent",
  },
  {
    title: 'Long Seminar',
    startTime: '13:30',
    endTime: '16:20',
    daysOfWeek: [2], // Tues
    backgroundColor: MUI_COLORS.deepOrange,
    borderColor: "transparent",
  },
  {
    title: 'Overlaps With Seminar',
    startTime: '13:30',
    endTime: '14:50',
    daysOfWeek: [2, 4], // Tues, Thurs
    backgroundColor: MUI_COLORS.orange,
    borderColor: "transparent"
  },
  {
    title: 'Dupe #0 Mon Wed Class',
    startTime: '14:30',
    endTime: '15:50',
    daysOfWeek: [1, 3], // Mon, Wed
    backgroundColor: MUI_COLORS.cyan, // cyan 700
    borderColor: "transparent"
  },
  {
    title: 'Dupe #1 of Mon Wed Class',
    startTime: '14:30',
    endTime: '15:50',
    daysOfWeek: [1, 3], // Mon, Wed
    backgroundColor: "#00ACC1", // cyan 600
    borderColor: "transparent"
  },
  {
    title: 'Dupe #2 of Mon Wed Class',
    startTime: '14:30',
    endTime: '15:50',
    daysOfWeek: [1, 3], // Mon, Wed
    backgroundColor: "#00BCD4", // cyan 500
    borderColor: "transparent"
  },
  {
    title: 'Dupe #3 of Mon Wed Class',
    startTime: '14:30',
    endTime: '15:50',
    daysOfWeek: [1, 3], // Mon, Wed
    backgroundColor: "#26C6DA", // cyan 400
    borderColor: "transparent"
  },
  {
    title: 'Dupe #4 of Mon Wed Class',
    startTime: '14:30',
    endTime: '15:50',
    daysOfWeek: [1, 3], // Mon, Wed
    backgroundColor: "#4DD0E1", // cyan 300
    borderColor: "transparent"
  }
]