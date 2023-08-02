import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { quicksand } from "lib/mui/theme";
import IconLogo from "./IconLogo";

const Logo = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <>
      <Typography
        variant="h2"
        className={quicksand.className}
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: matches ? "64px" : "42px",
        }}
      >
        <IconLogo
          height={matches ? "80px" : "65px"}
          width={matches ? "80px" : "65px"}
          offset={matches ? "5px" : "3.3px"}
        />
        <span style={{ color: "#303030" }}>Intelli</span>
        <span style={{ color: theme.palette.secondary.light }}>Plan</span>
      </Typography>
    </>
  );
};

export default Logo;
