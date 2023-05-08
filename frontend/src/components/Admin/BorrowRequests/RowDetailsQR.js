import React, { useState } from "react";
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
import "./RowDetails.scss";

const RowDetailsQR = ({
  request,
  user,
  items,
  setItems,
  activeTab,
  allInstances,
  allItemIds,
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
        // Check if the item is already scanned
        if (prevScans.includes(data)) {
          return prevScans;
        }

        const updatedScans = prevScans.concat(data);

        if (activeTab === 2) {
          if (updatedScans.length === allItemIds.length) {
            setReturnButtonIsDisable(false);
          } else setReturnButtonIsDisable(true);
        }

        setItems(updatedScans);
        return updatedScans;
      });
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setItems(typeof value === "string" ? value.split(",") : value);
  };

  const listItems = allInstances.map((item) => (
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

  const handleSelectChange = (e, index) => {
    console.log(
      "Selected instance ID:",
      e.target.value,
      "for item index:",
      index
    );
  };

  const renderSelects = () => {
    return allInstances.map((itemInstances, index) => (
      <div key={index}>
        <h4>Item ID: {itemInstances[0].itemId}</h4>
        <Select
          onChange={(e) => handleSelectChange(e, index)}
          value={itemInstances[0].id}
        >
          {itemInstances.map((instance) => (
            <MenuItem key={instance.id} value={instance.id}>
              {instance.id}
            </MenuItem>
          ))}
        </Select>
      </div>
    ));
  };

  return (
    <Box className="expanded-row">
      <Typography className="expanded-row__title" variant="h6">
        Request No. {request.requestId}
      </Typography>
      <Box className="expanded-row__content">
        <Box className="expanded-row__info">
          {activeTab === 2 &&
            ((<h1>you must return</h1>), (<ul>{listItems}</ul>))}
          {scans.length}/{allItemIds.length}
          <Typography className="expanded-row__instance__title">
            Scanned Items
          </Typography>
          <FormControl
            sx={{ m: 1, width: 300, fullWidth: true, size: "medium" }}
          >
            <InputLabel id="multiple-chip">Scanned Items</InputLabel>
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
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ width: "300px", height: "300px" }}>
            <QrReader onResult={handleResultQRChange} />
          </div>
          {renderSelects()}
          <p>scans={scans.length} </p>
          <p>items={items.length}</p>
          {scans && scans.map((item) => <p>{item}</p>)}
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
            <Typography>User: {user.role}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RowDetailsQR;
