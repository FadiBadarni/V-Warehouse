import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTrail, animated as a } from "react-spring";

import "./UsersManagement.scss";

const RowDetails = ({ user, handleDelete, updateUser }) => {
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(user.role);
  const [year, setYear] = useState(user.year);
  const [hasChanged, setHasChanged] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    if (
      email !== user.email ||
      username !== user.username ||
      role !== user.role ||
      year !== user.year
    ) {
      setHasChanged(true);
    } else {
      setHasChanged(false);
    }
  }, [email, username, role, year, user]);

  const emailValidation = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!emailValidation(e.target.value));
  };

  const trailProps = useTrail(2, {
    from: { opacity: 0, transform: "translate3d(100px, 0, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    config: { tension: 280, friction: 60 },
  });

  const animationVariants = {
    open: { scaleY: 1, originY: 0 },
    closed: { scaleY: 0, originY: 0 },
  };

  return (
    <AnimatePresence>
      <motion.td
        className="users-table__expanded-row"
        variants={animationVariants}
        initial="closed"
        animate="open"
        exit="closed"
        transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
        colSpan={6}
      >
        <a.div style={trailProps[0]}>
          <Box className="users-table__expanded-row__content">
            <Typography
              className="users-table__expanded-row__title"
              variant="h6"
            >
              User Details
            </Typography>
            <Box className="users-table__expanded-row__details">
              <TextField
                disabled
                id="outlined-disabled"
                label="ID"
                value={user.id}
              />
              <TextField
                label="Email"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                helperText={emailError ? "Invalid email format" : ""}
              />
              <TextField
                label="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FormControl className="users-table__expanded-row__year-select">
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <MenuItem value={null}>None</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <FormControl className="users-table__expanded-row__role-select">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                inputProps={{
                  name: "role",
                  id: "uncontrolled-native",
                }}
              >
                <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                <MenuItem value={"USER"}>USER</MenuItem>
                <MenuItem value={"TEACHER"}>TEACHER</MenuItem>
              </Select>
            </FormControl>
            <Box className="users-table__expanded-row__actions">
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                onClick={(event) => {
                  event.stopPropagation();
                  updateUser({ id: user.id, email, username, role, year });
                }}
                disabled={!hasChanged}
              >
                UPDATE
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ mr: 1 }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleDelete(user);
                }}
              >
                DELETE
              </Button>
            </Box>
          </Box>
        </a.div>
      </motion.td>
    </AnimatePresence>
  );
};
export default RowDetails;
