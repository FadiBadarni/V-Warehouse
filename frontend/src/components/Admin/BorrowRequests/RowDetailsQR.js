import React, { useState, useEffect } from "react";
import { getBorrowInstances } from "../../../api/AdminService";
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
  useTheme,
} from "@mui/material";

function ErrorModal(props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{props.title}</h2>
        <p>{props.message}</p>
      </div>
    </div>
  );
}

const RowDetailsQR = ({
  request,
  user,
  items,
  setItems,
  setAcceptButtonIsDisable,
  activeTab,
  setReturnButtonIsDisable,
  availdabelQuantity,
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

  function getStyles(name, items, theme) {
    return {
      fontWeight:
        items.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setItems(typeof value === "string" ? value.split(",") : value);
    if (items.length === request.quantity - 1) {
      setAcceptButtonIsDisable(false);
    } else setAcceptButtonIsDisable(true);
    if (items.length === instances.length - 1) {
      setReturnButtonIsDisable(false);
    } else setReturnButtonIsDisable(true);
  };

  const [error, setError] = useState(null);
  const [scans, setScans] = useState([]);
  const [instances, setInstances] = useState([]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  useEffect(() => {
    const fetchBorrowInstances = async () => {
      const borrowInstances = await getBorrowInstances(request.requestId);
      setInstances(borrowInstances);
    };
    if (activeTab === 2) fetchBorrowInstances();
  }, []);

  const addItem = (data) => {
    // const x = availdabelQuantity.availableItemsIds.map(String);
    // console.log(x);
    if (
      availdabelQuantity.availableItemsIds.includes(Number(data)) ||
      request.instancesIds.includes(Number(data))
    ) {
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
                setReturnButtonIsDisable(true);
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
    } else {
      setError({
        title: "The Item not in list",
        message: "The data you entered is not in the list.",
      });
      if (activeTab === 2) {
        setReturnButtonIsDisable(false);
      }
    }
  };

  const handleResultQRChange = (result, error) => {
    if (!!result) {
      addItem(result?.text);
    }
    if (!!error) {
      // console.info(error);
    }
  };
  if (!availdabelQuantity || !request || !instances) {
    return <h1>Loading...</h1>;
  }

  return (
    <Box className="expanded-row">
      <Typography className="expanded-row__title" variant="h6">
        Request No. {request.requestId}
      </Typography>
      <Box className="expanded-row__content">
        <Box className="expanded-row__info">
          {items.length}/{request.quantity}
          <Typography className="expanded-row__instance__title">
            Requested Item Info
          </Typography>
          {activeTab === 1 && (
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Item</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={items}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}>
                {availdabelQuantity.availableItemsIds.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, items, theme)}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {activeTab === 2 && (
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Item</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={items}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}>
                {instances
                  ? instances.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, items, theme)}>
                        {name}
                      </MenuItem>
                    ))
                  : instances.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, items, theme)}>
                        {name}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          )}
          <div style={{ width: "300px", height: "300px" }}>
            <QrReader onResult={handleResultQRChange} delay={500} />
          </div>
          {error && <ErrorModal title={error.title} message={error.message} />}
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
