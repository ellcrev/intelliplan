import { mdiMagnify } from "@mdi/js";
import { Box, OutlinedInput } from "@mui/material";
import { Icon } from "@mdi/react";

interface SearchProps {
  value: string;
  onValueChange: (newVal: string) => void;
}

const Search = (props: SearchProps) => {
  return (
    <OutlinedInput
      value={props.value}
      onChange={(ev) => {
        props.onValueChange(ev.target.value);
      }}
      color="secondary"
      sx={(theme) => ({
        flexGrow: 1,
        mt: "0px",
        fontSize: "16px",
        transition: "box-shadow .25s ease-in-out",
        "&:focus-within": {
          boxShadow: "0px 0px 4px " + theme.palette.secondary.light,
        },
      })}
      placeholder="Search by course code, description... (i.e. CS194W)"
      endAdornment={
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "44px",
          }}
        >
          <Icon path={mdiMagnify} size={1} color="#707070" />
        </Box>
      }
    />
  );
};

export default Search;
