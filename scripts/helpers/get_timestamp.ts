const getTimestamp = () => {
  const date = new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  } as const;
  return date.toLocaleString("en-US", options);
};

export default getTimestamp;
