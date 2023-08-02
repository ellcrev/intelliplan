import { mdiAtom, mdiCalendarBlank } from "@mdi/js";
import { Icon } from "@mdi/react";
import { Box } from "@mui/material";
import theme from "lib/mui/theme";

interface IconLogoProps {
  height: string;
  width: string;
  offset: string;
}

const IconLogo = (props: IconLogoProps) => {
  return (
    <Box
      style={{
        height: props.height,
        width: props.width,
        display: "flex",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon path={mdiCalendarBlank} size={34} color={"#404040"} />
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          top: props.offset,
          left: 0,
          height: "100%",
          width: "100%",
          transform: "scale(.6)",
        }}
      >
        <Icon path={mdiAtom} size={34} color={theme.palette.secondary.light} />
      </Box>
    </Box>
  );
};

export default IconLogo;
