import React from "react";
import "./UsersManagement.scss";
import { Box, List, ListItem } from "@mui/material";
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";

const Excel = ({
  getRootProps,
  getInputProps,
  saveStudents,
  isDragActive,
  files,
}) => {
  const springProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    <Box className="excel">
      <motion.div
        className="excel__title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Users Registration Section
      </motion.div>

      <animated.div
        style={springProps}
        {...getRootProps()}
        className="excel__dropzone"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <motion.p animate={{ scale: 1.1 }}>
            Drop the Excel file here...
          </motion.p>
        ) : (
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            Drag and drop the Excel file here, or click to select the file
          </motion.p>
        )}
      </animated.div>
      <List className="excel__file-list">
        {files.map((file) => (
          <ListItem key={file.path}>
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              {file.path} - {file.size} bytes
            </motion.span>
          </ListItem>
        ))}
      </List>
      <div className="excel__save">
        <motion.button
          onClick={saveStudents}
          className="excel__save-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Save
        </motion.button>
      </div>
    </Box>
  );
};

export default Excel;
