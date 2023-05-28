import React, { useState, useEffect } from "react";
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
import "./RowDetails.scss";
import UserInfo from "./UserInfo";

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

let mixAllInstances = [];

const RowDetailsQR = ({
  request,
  user,
  items,
  setItems,
  activeTab,
  allInstances,
  allItemIds,
  setAcceptButtonIsDisable,
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
    if (items.length === request.itemIds.length - 1) {
      setAcceptButtonIsDisable(false);
    } else setAcceptButtonIsDisable(true);
    if (items.length === request.itemInstanceIds.length - 1) {
      setReturnButtonIsDisable(false);
    } else setReturnButtonIsDisable(true);
  };

  const [error, setError] = useState(null);

  useEffect(() => {
    if (allInstances) {
      mixAllInstances = allInstances.flatMap((instanceList) =>
        instanceList.map((item) => item.id)
      );
    }
  }, [allInstances]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  const addItem = (data) => {
    if (data) {
      setItems((prevScans) => {
        if (activeTab === 1) {
          if (mixAllInstances.includes(Number(data))) {
            if (data && !prevScans.includes(data)) {
              if (prevScans.length === request.itemIds.length - 1) {
                setAcceptButtonIsDisable(false);
              } else setAcceptButtonIsDisable(true);
              return [...prevScans, data];
            } else {
              return prevScans;
            }
          } else {
            setError({
              title: "The Item not in list",
              message: "The data you entered is not in the list.",
            });
          }
        } else {
          if (request.itemInstanceIds.includes(Number(data))) {
            if (data && !prevScans.includes(data)) {
              if (prevScans.length === request.itemInstanceIds.length - 1) {
                setReturnButtonIsDisable(false);
              } else setReturnButtonIsDisable(true);

              return [...prevScans, data];
            } else {
              return prevScans;
            }
          } else {
            setError({
              title: "The Item not in list",
              message: "The data you entered is not in the list.",
            });
          }
        }

        return prevScans;
      });
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
  if (!allInstances || !request) {
    return <h1>Loading...</h1>;
  }
  const separator = <hr key="separator" />;

  return (
    <Box className="expanded-row">
      <Typography className="expanded-row__title" variant="h6">
        Request No. {request.requestId}
      </Typography>
      <Box className="expanded-row__content">
        <Box className="expanded-row__info">
          {allItemIds.join(" ")}
          <Typography className="expanded-row__instance__title">
            {items.length}
          </Typography>
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
                MenuProps={MenuProps}
              >
                {allInstances.flatMap((instanceList, index) => [
                  ...instanceList.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.id}
                    </MenuItem>
                  )),
                  index < allInstances.length - 1 ? separator : null,
                ])}
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
                MenuProps={MenuProps}
              >
                {request.itemInstanceIds
                  ? request.itemInstanceIds.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, items, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))
                  : request.itemInstanceIds.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, items, theme)}
                      >
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
        <UserInfo request={request} user={user} />
      </Box>
    </Box>
  );
};

export default RowDetailsQR;
