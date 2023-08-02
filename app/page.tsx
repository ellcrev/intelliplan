"use client";
import {
  Box,
  Divider,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { mdiCalendarMonth, mdiListBoxOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Logo from "components/Logo";
import Search from "components/Search";
import SearchFilters from "components/SearchFilters";
import SearchResults from "components/SearchResults";
import SearchResultsCalendar from "components/SearchResultsCalendar";
import { NextPage } from "next";
import { useState } from "react";
import client from "lib/meilisearch";
import { MeiliCourseDocument, Quarter } from "lib/meilisearch/types";
import React from "react";

const HomePage: NextPage = () => {
  const theme = useTheme();
  const [searchResults, setSearchResults] = useState<
    (MeiliCourseDocument & { id: string })[]
  >([]);
  const [searchVal, setSearchVal] = useState("");
  const [termFilter, setTermFilter] = React.useState<Quarter>("SPR");
  const [gerFilter, setGerFilter] = useState("WAYS");
  const [resultsView, setResultsView] = useState("List");

  const search = async (val: string) => {
    const results = await client.index("courses").search(val);
    //dedupe and add label for crosslisted courses
    setSearchResults(results.hits as (MeiliCourseDocument & { id: string })[]);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        marginTop: "32px",
        marginBottom: "32px",
        minHeight: "calc(100vh - 72px)",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          minHeight: "calc(100vh - 72px)",
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          padding: "32px 12px 48px 12px",
          "@media only screen and (min-width: 450px)": {
            padding: "32px 32px 48px 32px",
          },
          "@media only screen and (min-width: 900px)": {
            width: "750px",
          },
        }}
      >
        <Box sx={{ marginBottom: "12px" }}>
          <Logo />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1,
            my: 1,
          }}
        >
          <Search
            value={searchVal}
            onValueChange={(newVal) => {
              setSearchVal(newVal);
              search(newVal);
            }}
          />
          <SearchFilters
            filters={{ termFilter, setTermFilter, gerFilter, setGerFilter }}
          />
        </Box>
        <Divider sx={{ width: "100%" }} orientation="horizontal" />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <Typography
              sx={{
                textAlign: "left",
                alignSelf: "flex-start",
                paddingLeft: "12px",
                color: "#a0a0a0",
                fontWeight: "bold",
              }}
            >
              Results{" "}
              {searchVal && searchResults.length ? (
                <>
                  - Showing{" "}
                  <span
                    style={{
                      color: theme.palette.secondary.light,
                      fontSize: "17px",
                      margin: "0px 2px",
                      filter: "drop-shadow(0px 0px 1px #c0c0c0)",
                    }}
                  >
                    {searchResults.length}
                  </span>{" "}
                  matches
                </>
              ) : (
                "- ..."
              )}
            </Typography>
          </Box>
          <ToggleButtonGroup
            size="small"
            exclusive
            color="secondary"
            onChange={(ev, val) => {
              setResultsView(val);
            }}
            value={resultsView}
          >
            <ToggleButton value={"Calendar"} sx={{ borderColor: "#c0c0c0" }}>
              <Icon path={mdiCalendarMonth} size={1}></Icon> Calendar
            </ToggleButton>
            <ToggleButton value={"List"} sx={{ borderColor: "#c0c0c0" }}>
              <Icon path={mdiListBoxOutline} size={1}></Icon> List
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {resultsView == "Calendar" ? (
          <SearchResultsCalendar
            results={searchResults}
            filters={{ termFilter }}
          />
        ) : (
          <SearchResults results={searchResults} />
        )}
      </Paper>
    </Box>
  );
};

export default HomePage;
