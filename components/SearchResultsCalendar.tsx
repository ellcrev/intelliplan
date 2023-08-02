import * as React from 'react';
import { Box, Collapse, Popover, Skeleton, Tooltip, Typography } from "@mui/material";
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import { MeiliCourseDocument, ParsedSectionData, Quarter } from "lib/meilisearch/types";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import { MUI_COLORS, dummyCalCourses } from './dummyCalCourses'

interface SearchResultsProps {
  results: (MeiliCourseDocument & { id: string })[];
  filters: {
    termFilter: Quarter
  }
}

// https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors
// Scroll to bottom, these are the colors at level 700

const SearchResultsCalendar = (props: SearchResultsProps) => {
  const courseEvents = expandResultsToCalendar(props, props.filters.termFilter);
  // console.log("results", props.results)
  // console.log("events", courseEvents)

  const [hoveredEventOffsetRect, setHoveredEventOffsetRect] = React.useState<any | null>(null);
  const [hoveredEvent, setHoveredEvent] = React.useState<any | null>(null);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [clickedEvent, setClickedEvent] = React.useState<any | null>(null);

  const handleTooltipClose = () => {
    setHoveredEventOffsetRect(null);
    setHoveredEvent(null);
  };

  // https://fullcalendar.io/docs/eventClick
  const handleCourseEventClick = (info: any) => {
    setClickedEvent(info.event);
    setAnchorEl(info.jsEvent.currentTarget);
    handleTooltipClose()
  };

  const handleCourseEventPopoverClose = () => {
    setAnchorEl(null);
    setClickedEvent(null);
  };

  const openTT = Boolean(hoveredEventOffsetRect);
  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        display: "block",
        flexGrow: 1,
        width: "100%",
        position: "relative",
      }}
    >
      <FullCalendar
        height="auto"
        plugins={[ timeGridPlugin ]}
        weekends={false}
        headerToolbar={false}
        allDaySlot={false}
        dayHeaderFormat={{ weekday: 'short' }}
        slotMinTime="08:00"
        slotMaxTime="20:00"
        eventMouseEnter={({el, event, jsEvent}) => {
          // https://fullcalendar.io/docs/eventMouseEnter
          if (clickedEvent) return;
          el.style.cursor = 'pointer';
          if (hoveredEvent && hoveredEvent.id == event.id) return;

          setHoveredEvent(event)
          setHoveredEventOffsetRect(getOffsetRect(el));
        }}
        eventMouseLeave={(info) => handleTooltipClose()}
        eventClick={(info) => handleCourseEventClick(info)}
        events={courseEvents}
      />
      <Popover
        id={"event popover"}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCourseEventPopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ p: 2 }}>Popover with a longer description for the class {clickedEvent?.title || ""}</Typography>
      </Popover>
      <HoverPopover
        id="mouse-over-popover"
        open={openTT}
        anchorReference="anchorPosition"
        anchorPosition={{
          left: hoveredEventOffsetRect ? hoveredEventOffsetRect.left : 0,
          top: hoveredEventOffsetRect ? hoveredEventOffsetRect.bottom : 0,
        }}
        onClose={handleTooltipClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{hoveredEvent?.title || "Untitled Course"}</Typography>
      </HoverPopover>
    </Box>
  );
};

function expandResultsToCalendar(searchResults: SearchResultsProps, term: Quarter) {
  const courses = searchResults.results;
  const seenCourseTimes: Set<string> = new Set();
  let courseCalEvents: any[] = [];
  courses.forEach((course: MeiliCourseDocument) => {
    if (!course.terms.includes(term)) return;

    course.termLectureTimes[term]?.forEach((sectionTime: ParsedSectionData) => {
      const seenCourseHash = `${sectionTime.location}-${sectionTime.startTimeCalString}`;
      // skip if we've already seen this course (using location and start time for uniqueness)
      if (seenCourseTimes.has(seenCourseHash)) {
        // TODO - add this crosslisted course code to the description
        return;
      }
      seenCourseTimes.add(seenCourseHash);

      courseCalEvents.push({
        title: `${course.code} - ${course.title}`,
        startTime: sectionTime.startTimeCalString, // https://fullcalendar.io/docs/duration-object
        endTime: sectionTime.endTimeCalString, // https://fullcalendar.io/docs/duration-object
        daysOfWeek: sectionTime.dayNumbers, // 0 is Sunday, 1 Monday, etc. 
        backgroundColor: MUI_COLORS.red,
        borderColor: "transparent",
      })
    });
  }) 
  return courseCalEvents;
}

function getOffsetRect(el: any) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY
  };
}

export default SearchResultsCalendar;
