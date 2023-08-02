import { mdiCalendarMonth, mdiListBoxOutline } from "@mdi/js";
import Icon from "@mdi/react";
import {
  Box,
  NativeSelect,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Typography,
} from "@mui/material";
import { listOfGERs, Quarter } from "lib/meilisearch/types";
import { useState } from "react";

interface SearchFiltersProps {
  filters: {
    termFilter: Quarter, 
    setTermFilter: Function,
    gerFilter: string,
    setGerFilter: Function
  }
}

const SearchFilters = (props: SearchFiltersProps) => {
  // const [gerFilter, setGerFilter] = useState("WAY-A-II");
  // const [termFilter, setTermFilter] = useState("SPR");
  // const [unitFilter, setUnitFilter] = useState("3+");
  const { 
    filters: { termFilter, setTermFilter, gerFilter, setGerFilter }
  } = props;
  console.log("term", termFilter);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.5,
      }}
    >
      <Select
        sx={{
          width: "100%",
          mb: 1,
          "@media only screen and (min-width: 450px)": {
            // width: "33%",
            mb: 0,
          },
          "@media only screen and (min-width: 900px)": {
            width: "120px",
          },
        }}
        size="small"
        color="secondary"
        variant="outlined"
        value={gerFilter}
        onChange={(ev) => {
          setGerFilter(ev.target.value);
        }}
      >
        <MenuItem dense value="WAYS">
          WAYS
        </MenuItem>
        {listOfGERs.map((ger) => (
          <MenuItem dense key={ger} value={ger}>
            {ger}
          </MenuItem>
        ))}
      </Select>
      <Select
        sx={{
          width: "100%",
          my: 1,
          "@media only screen and (min-width: 450px)": {
            // width: "33%",
          },
          "@media only screen and (min-width: 900px)": {
            width: "110px",
          },
        }}
        size="small"
        color="secondary"
        variant="outlined"
        value={termFilter}
        onChange={(ev) => {
          setTermFilter(ev.target.value);
        }}
      >
        <MenuItem value={"AUT"}>Autumn</MenuItem>
        <MenuItem value={"WIN"}>Winter</MenuItem>
        <MenuItem value={"SPR"}>Spring</MenuItem>
        <MenuItem value={"SUM"}>Summer</MenuItem>
      </Select>
      {/* <Select
        sx={{
          width: "100%",
          my: 1,
          "@media only screen and (min-width: 450px)": {
            width: "33%",
          },
          "@media only screen and (min-width: 900px)": {
            width: "110px",
          },
        }}
        size="small"
        color="secondary"
        variant="outlined"
        value={unitFilter}
        onChange={(ev) => {
          setUnitFilter(ev.target.value);
        }}
      >
        <MenuItem value={"1"}>1 Unit</MenuItem>
        <MenuItem value={"1+"}>1+ Units</MenuItem>
        <MenuItem value={"2"}>2 Units</MenuItem>
        <MenuItem value={"2+"}>2+ Units</MenuItem>
        <MenuItem value={"3"}>3 Units</MenuItem>
        <MenuItem value={"3+"}>3+ Units</MenuItem>
        <MenuItem value={"4"}>4 Units</MenuItem>
        <MenuItem value={"4+"}>4+ Units</MenuItem>
        <MenuItem value={"5"}>5 Units</MenuItem>
        <MenuItem value={"5+"}>5+ Units</MenuItem>
      </Select> */}
    </Box>
  );
};

export default SearchFilters;
