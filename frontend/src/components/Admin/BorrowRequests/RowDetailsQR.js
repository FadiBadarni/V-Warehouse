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
import "./RowDetailsQR.scss";
import UserInfo from "./UserInfo";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("rowDetailsQR");

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
    <Box className="inner-row">
      <Typography className="inner-row__title" variant="h6">
        {t("rowDetailsQR.requestNo")} {request.requestId}
      </Typography>
      <Box className="inner-row__content">
        <Box className="inner-row__info">
          <Box className="form-control-container">
            <Typography className="helper-text" display="block" gutterBottom>
              {t("rowDetailsQR.addItemsManually")}
            </Typography>
            {activeTab === 1 && (
              <Box className="form-control">
                <FormControl sx={{ m: 1, width: 300 }}>
                  <InputLabel id="demo-multiple-chip-label">Item</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={items}
                    onChange={handleChange}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
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
              </Box>
            )}
            {activeTab === 2 && (
              <Box className="form-control">
                <FormControl sx={{ m: 1, width: 300 }}>
                  <InputLabel id="demo-multiple-chip-label">Item</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={items}
                    onChange={handleChange}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
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
              </Box>
            )}
          </Box>
          <Box className="qr-reader-container">
            <Box className="qr-reader-box">
              <Typography className="helper-text" display="block" gutterBottom>
                {t("rowDetailsQR.scanQRCode")}
              </Typography>
              <QrReader onResult={handleResultQRChange} delay={500} />
              {error && (
                <Box className="error-modal-box">
                  <ErrorModal title={error.title} message={error.message} />
                </Box>
              )}
            </Box>
          </Box>
          <Box className="user-info-container">
            <UserInfo request={request} user={user} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RowDetailsQR;
