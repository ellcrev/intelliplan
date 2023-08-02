import { Box, Collapse, Skeleton, Typography } from "@mui/material";
import { MeiliCourseDocument } from "lib/meilisearch/types";
import { TransitionGroup } from "react-transition-group";

interface SearchResultsProps {
  results: (MeiliCourseDocument & { id: string })[];
}

const SearchResults = (props: SearchResultsProps) => {
  const results = props.results;
  return (
    <Box
      sx={{
        display: "block",
        flexGrow: 1,
        width: "100%",
        position: "relative",
      }}
    >
      {results.length === 0 ? (
        <Box
          sx={{
            fontSize: "18px",
            width: "100%",
            color: "#a0a0a0",
            textAlign: "center",
            marginTop: "32px",
            "@media only screen and (min-width: 450px)": {
              fontSize: "22px",
            },
          }}
        >
          Search to see ⚡️ instant results.
        </Box>
      ) : null}
      <TransitionGroup>
        {results.map((c, i) => (
          <Collapse key={c.id}>
            <Box
              key={c.id}
              sx={{
                width: "100%",
                my: 1,
                padding: "16px 0px",
                flexDirection: "row",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderBottom:
                  i === results.length - 1 ? "none" : "1px solid #e0e0e0",
              }}
            >
              <Skeleton
                height={120}
                width={120}
                variant="rectangular"
                sx={{
                  flexShrink: 0,
                  display: "none",
                  "@media only screen and (min-width: 450px)": {
                    display: "block",
                  },
                }}
              />
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    width: "100%",

                    padding: "0px 16px",
                    textAlign: "center",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                  }}
                >
                  {c.subject + "-" + c.code} {": " + c.title}
                </Typography>
                <div
                  style={{
                    wordBreak: "break-word",
                    display: "-webkit-box",
                    textAlign: "center",
                    padding: "0px 32px",
                    height: "72px",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                  }}
                >
                  {c.description}
                </div>
              </Box>
            </Box>
          </Collapse>
        ))}
      </TransitionGroup>
    </Box>
  );
};

export default SearchResults;
