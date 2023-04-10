import React from "react";
import "./UsersManagement.scss";
import {
  Box,
  Typography,
} from "@mui/material";





const ExcelFile = ({getRootProps,getInputProps,saveStudents,isDragActive,files}) => {
    return (
    <Box>
      <Typography variant="h4" gutterBottom>
            <h2>Users Management Section</h2>
  
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Excel file here...</p>
        ) : (
          <p>
            Drag and drop the Excel file here, or click to select the file
          </p>
        )}
      </div>
      <ul>
        {files.map((file) => (
          <li key={file.path}>
            {file.path} - {file.size} bytes
          </li>
        ))}
      </ul>
      <button onClick={saveStudents}>Save</button>
      </Typography>
      <Typography variant="body1">This is a dummy page.</Typography>
    </Box>
    );
}

  export default ExcelFile;

  
