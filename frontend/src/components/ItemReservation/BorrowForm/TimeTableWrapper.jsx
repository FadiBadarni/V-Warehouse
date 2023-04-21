import React from "react";
import { Box, Typography, Grid } from "@material-ui/core";
import { motion } from "framer-motion";
import TimeTable from "../Table/TimeTable";

const TimeTableWrapper = ({
  selectedDate,
  occupiedDates,
  onTimeSelected,
  minTime,
  maxTime,
  disableOccupied,
  pendingDates,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box mb={4}>
        <Typography variant="h5">Time Slots</Typography>
      </Box>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} md={12}>
          <TimeTable
            selectedDate={selectedDate}
            occupiedDates={occupiedDates}
            onTimeSelected={onTimeSelected}
            minTime={minTime}
            maxTime={maxTime}
            disableOccupied={disableOccupied}
            pendingDates={pendingDates}
          />
        </Grid>
        <Grid item xs={12} md={2}></Grid>
      </Grid>
    </motion.div>
  );
};

export default TimeTableWrapper;
