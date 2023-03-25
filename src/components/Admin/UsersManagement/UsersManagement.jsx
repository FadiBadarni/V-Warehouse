import React, { useState, useCallback } from "react";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import { useDropzone } from "react-dropzone";
import { importUsers } from "../../../api/admin";
import "./UsersManagement.scss";

const UsersManagement = () => {
  useAdminRole();

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [files, setFiles] = useState([]);

  const saveStudents = async () => {
    if (files.length === 0) {
      alert("Please upload an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const result = await importUsers(formData);
      if (result) {
        alert("Users have been imported successfully.");
      } else {
        alert("Failed to import users.");
      }
    } catch (error) {
      alert("Failed to import users: " + error.message);
    }
  };

  return (
    <div className="users-management">
      <AdminLayout></AdminLayout>
      <div className="users-section">
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
      </div>
    </div>
  );
};

export default UsersManagement;
