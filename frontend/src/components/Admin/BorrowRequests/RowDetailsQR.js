import React, { useState } from "react";
// import { Typography, Box,MenuItem,Select,InputLabel,FormControl,OutlinedInput } from "@mui/material";
import "./RowDetails.scss";
import { QrReader } from "react-qr-reader";
import {
  Typography,
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Chip,
  Select,
} from "@mui/material";

const RowDetailsQR = ({
  request,
  user,
  items,
  setItems,
  setAcceptButtonIsDisable,
  activeTab,
  itemInstances,
  setReturnButtonIsDisable,
}) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [scans, setScans] = useState([]);

  const addItem = (data) => {
    if (data) {
      setScans((prevScans) => {
        if (data && !prevScans.includes(data)) {
          if (activeTab === 1) {
            if (prevScans.length === request.quantity - 1) {
              setAcceptButtonIsDisable(false);
            } else setAcceptButtonIsDisable(true);
          }
          if (activeTab === 2) {
            if (prevScans.length === request.quantity - 1) {
              setReturnButtonIsDisable(false);
            } else setReturnButtonIsDisable(true);
          }

          setItems([...prevScans, data]);
          return [...prevScans, data];
        } else {
          setItems([prevScans]);
          return prevScans;
        }
      });
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setItems(typeof value === "string" ? value.split(",") : value);
    if (scans.length === request.quantity) {
      setAcceptButtonIsDisable(false);
    } else setAcceptButtonIsDisable(true);
  };

  const listItems = itemInstances.map((item) => (
    <li key={item.id}>{item.id}</li>
  ));

  const handleResultQRChange = (result, error) => {
    if (!!result) {
      addItem(result?.text);
    }
    if (!!error) {
      // console.info(error);
    }
  };

  return (
    <Box className="expanded-row">
      <Typography className="expanded-row__title" variant="h6">
        Request No. {request.requestId}
      </Typography>
      <Box className="expanded-row__content">
        <Box className="expanded-row__info">
          {activeTab === 2 &&
            ((<h1>you must to return</h1>), (<ul>{listItems}</ul>))}
          {scans.length}/{request.quantity}
          <Typography className="expanded-row__instance__title">
            Requested Item Info
          </Typography>
          <FormControl
            sx={{ m: 1, width: 300, fullWidth: true, size: "medium" }}
          >
            <InputLabel id="multiple-chip">Item</InputLabel>
            <Select
              labelId="ID"
              id="ID-multiple"
              multiple
              value={scans}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {scans.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  // style={getStyles(name, items)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ width: "300px", height: "300px" }}>
            <QrReader onResult={handleResultQRChange} />
          </div>
          <d>scans={scans.length} </d>
          <d>items={items.length}</d>
          {scans && scans.map((item) => <p>{item}</p>)}
          -------------------------------------------
          {items && items.map((item) => <p>{item}</p>)}
        </Box>
        {user && (
          <Box className="expanded-row__user">
            <Typography className="expanded-row__user__title">
              Request Sender Info
            </Typography>
            <Typography>Username: {user.username}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Year: {user.year}</Typography>
            <Typography>User: {user.Role}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RowDetailsQR;
