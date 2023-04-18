import React, {
  useEffect,
  useState,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import "./UsersManagement.scss";
import {
  Box,
  Table,
  TableContainer,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  TextField,
} from "@mui/material";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import {
  importUsers,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../../../api/AdminService";

const UsersTableHeaders = lazy(() => import("./UsersTableHeaders"));
const UsersTableBody = lazy(() => import("./UsersTableBody"));
const Excel = lazy(() => import("./Excel"));
const NewUser = lazy(() => import("./AddNewUser"));

const UsersManagement = () => {
  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";
  const { handleTokenExpired } = useAuth();

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

  const handleUpdate = (updatedUser) => {
    const { id, email, username, role, year } = updatedUser;
    updateUser(id, email, username, role, year);
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        if (error.message === "Unauthorized") {
          handleTokenExpired();
        } else {
          console.error("Error fetching all users: ", error);
        }
      }
    };

    fetchAllUsers();
  }, [handleTokenExpired]);

  const handleDelete = async (user) => {
    await deleteUser(user.id);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [username, setUserName] = useState("");
  const [year, setYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    if (UserResult) {
      setEmail("");
      setUserName("");
      setPassword("");
      setRole("");
      setYear("");
    }
  };
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="users-management">
      <AdminLayout direction={direction}></AdminLayout>
      <Box className="users-section">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          variant="fullWidth"
          className="custom-tab-indicator custom-tab-text-color"
        >
          <Tab label="Register Users" id="tab-title" />
          <Tab label="Users List" id="tab-title" />
          <Tab label="Add user" id="tab-title" />
        </Tabs>
        <Suspense fallback={<CircularProgress />}>
          {activeTab === 0 && (
            <Excel
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              saveStudents={saveStudents}
              isDragActive={isDragActive}
              files={files}
            />
          )}
          {activeTab === 1 && (
            <>
              <Box className="search-container">
                <TextField
                  label="Search by email"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  margin="normal"
                  variant="outlined"
                  className="search-input"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <UsersTableHeaders />
                  <UsersTableBody
                    users={filteredUsers}
                    handleRowClick={handleRowClick}
                    expandedRow={expandedRow}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
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
        </Suspense>
      </Box>
    </Box>
  );
};

export default memo(UsersManagement);
