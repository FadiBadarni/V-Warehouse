import React, { useEffect, useState, useCallback } from "react";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import { useDropzone } from "react-dropzone";

import {
  importUsers,
  getAllUsers,
  createUser,
  deleteUser,
} from "../../../api/AdminService";
import { updateRoleUser } from "../../../api/AdminService";
import { useTranslation } from "react-i18next";
import "./UsersManagement.scss";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";

import UsersTableHeaders from "./UsersTableHeaders";
import UsersTableBody from "./UsersTableBody";
import ExcelFile from "./AddInExcelUsers";
import NewUser from "./AddNewUser";

const UsersManagement = () => {
  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

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
  const [activeTab, setActiveTab] = useState(0);
  const [expandedRow, setExpandedRow] = useState(-1);
  const [users, setAllUsers] = useState([]);

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? -1 : index);
  };
  const handleAccept = (e, user) => {
    const newRole = e.target.value;
    updateRoleUser(user.id, newRole);
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
    };

    fetchAllUsers();
  }, []);

  const handleRoleChange = async (e, user) => {
    const newRole = e.target.value;
    await updateRoleUser(user.id, newRole);
  };

  const handleDelete = async (user) => {
    await deleteUser(user.id);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [username, setUserName] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = {
      email,
      password,
      role,
      username,
      year,
    };
    const UserResult = await createUser(user.email, user.role, user.year);
    console.log(UserResult);
    if (UserResult) {
      setEmail("");
      setUserName("");
      setPassword("");
      setRole("");
      setYear("");
    }
  };

  return (
    <Box className="users-management">
      <AdminLayout direction={direction}></AdminLayout>
      <Box className="users-section">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Excel" />
          <Tab label="Show" />
          <Tab label="Add user" />
        </Tabs>
        {activeTab === 0 && (
          <ExcelFile
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            saveStudents={saveStudents}
            isDragActive={isDragActive}
            files={files}
          />
        )}
        {activeTab === 1 && (
          <>
            <Typography className="Users__title" variant="h4" gutterBottom>
              Users
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <UsersTableHeaders />
                <UsersTableBody
                  users={users}
                  handleRowClick={handleRowClick}
                  expandedRow={expandedRow}
                  handleAccept={handleAccept}
                  handleDelete={handleDelete}
                  handleRoleChange={handleRoleChange}
                />
              </Table>
            </TableContainer>
          </>
        )}
        {activeTab === 2 && (
          <NewUser
            handleSubmit={handleSubmit}
            setRole={setRole}
            setYear={setYear}
            setEmail={setEmail}
          />
        )}
      </Box>
    </Box>
  );
};

export default UsersManagement;
