import React, { useState, useEffect } from "react";
import { getAllItemInstances ,fetchItemNames} from "../../../api/AdminService";
import { fetchedItemTypes } from "../../../api/WarehouseService";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import {  useTheme } from '@mui/material/styles';
import { useTranslation } from "react-i18next";

import {
  Box,
  TextField,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Chip,
  Select
} from "@mui/material";

import "./ItemList.scss";


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



function getStyles(name, TypeName, theme) {
  return {
    fontWeight:
      TypeName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


const ItemList = () => {

  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

  const [items, setItems] = useState([]);
  const [type, setType] = useState([]);
  const [names, setName] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const allItemInstances = await getAllItemInstances();
        setItems(allItemInstances);
      } catch (error) {
        console.error("Error fetching warehouse items.", error);
      }
    };
    const fetchedTypes=async()=>{
      const  type= await fetchedItemTypes();
      setType(type);
    }
    const fetchNames=async()=>{
      const  names2= await fetchItemNames();
      setName(names2);
    }
    fetchItems();
    fetchedTypes();
    fetchNames();
  },[]);

  
  const theme = useTheme();
  const [itemName, setItemName] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [itemState, setItemState] = useState([]);

  const handleTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setItemType(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    }
    const handleNameChange = (event) => {
      const {
        target: { value },
      } = event;
      setItemName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
      }
      const handleStateChange = (event) => {
        const {
          target: { value },
        } = event;
        setItemState(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
        }
  return (
    <div className="admin-equipment-list">
      <AdminLayout direction={direction}></AdminLayout>
      <main className="equipment-list">
        <p className="title">
          Effortlessly Browse and Filter Equipment Categories
        </p>
        <div className="search">
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search By Category"
          />
        </div>
        <div>
      <FormControl sx={{ m: 1, width: 300,fullWidth: true,size:'medium' }}>
        <InputLabel id="Type-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="Tybe"
          id="Type-multiple-chip"
          multiple
          value={itemType}
          onChange={handleTypeChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {type.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, itemType, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 300,fullWidth: true,size:'medium' }}>
        <InputLabel id="Name-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="name"
          id="Name-multiple-chip"
          multiple
          value={itemName}
          onChange={handleNameChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, itemName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 300,fullWidth: true,size:'medium' }}>
        <InputLabel id="ItemState-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="ItemState"
          id="ItemState-multiple-chip"
          multiple
          value={itemState}
          onChange={handleStateChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {['DAMAGED',
            'IN_MAINTENANCE',
            'AVAILABLE'].map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, itemState, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      

      
    </div>
        <div className="equipments-grid">
          
        {items && items.filter((item) =>( itemType.length === 0 || itemType.includes(item.itemType.name))  &&(
        itemName.length === 0 || itemName.includes(item.itemName)) &&(
          itemState.length === 0 || itemState.includes(item.state))
        ) 
          .map((item) => (
            <div key={item.id} className="list-item">
              <div className="item-details">
                <h3>{item.itemName}</h3>
                <p>{item.state}</p>
              </div>
              <div className="item-tag">{item.itemType.name}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ItemList;
