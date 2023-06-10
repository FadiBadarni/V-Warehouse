import React from "react";
import {
  TextField,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import LabelIcon from "@mui/icons-material/Label";
import SyncIcon from "@mui/icons-material/Sync";
import { Grid } from "@mui/material";

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  itemType,
  setItemType,
  itemName,
  setItemName,
  itemState,
  setItemState,
  type,
  names,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} sm={6}>
        <div className="search">
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search By Serial Number" // <- Here
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={8}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Filter by Name</InputLabel>
          <Select
            label="Filter by Name"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <LabelIcon />
              </InputAdornment>
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: "200px",
                  overflowY: "auto",
                },
              },
            }}
          >
            {names.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <div className="filters">
          <FormControl fullWidth variant="outlined">
            <InputLabel>Filter by Type</InputLabel>
            <Select
              label="Filter by Type"
              value={itemType}
              onChange={(event) => setItemType(event.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <CategoryIcon />
                </InputAdornment>
              }
              MenuProps={{
                disableScrollLock: false,
                PaperProps: {
                  sx: {
                    maxHeight: "200px",
                    overflowY: "auto",
                  },
                },
              }}
            >
              {type.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Filter by State</InputLabel>
          <Select
            label="Filter by State"
            value={itemState}
            onChange={(event) => setItemState(event.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SyncIcon />
              </InputAdornment>
            }
            MenuProps={{
              disableScrollLock: false,
              PaperProps: {
                sx: {
                  maxHeight: "200px",
                  overflowY: "auto",
                },
              },
            }}
          >
            {["TAKEN", "DAMAGED", "IN_MAINTENANCE", "AVAILABLE"].map(
              (option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SearchFilters;
