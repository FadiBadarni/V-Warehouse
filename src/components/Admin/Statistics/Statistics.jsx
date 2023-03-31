import React, { useEffect, useState } from "react";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../AdminLayout";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Table,
  TableContainer,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import InstancesTableHeaders from "./InstancesTableHeaders";
import InstancesTableBody from "./InstancesTableBody";
import { getAllItemInstances } from "../../../api/AdminService";

import "./Statistics.scss";

const DummyPage = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Dummy Page
    </Typography>
    <Typography variant="body1">This is a dummy page.</Typography>
  </Box>
);

const Statistics = () => {
  useAdminRole();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

  const [activeTab, setActiveTab] = useState(0);
  const [expandedRow, setExpandedRow] = useState(-1);
  const [itemInstances, setItemInstances] = useState([]);

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? -1 : index);
  };

  useEffect(() => {
    const fetchItemInstances = async () => {
      const instances = await getAllItemInstances();
      setItemInstances(instances);
    };

    fetchItemInstances();
  }, []);

  return (
    <Box className="statistics">
      <AdminLayout direction={direction}></AdminLayout>
      <Box className="statistics__content">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Dummy Page" />
          <Tab label="Statistics" />
        </Tabs>
        {activeTab === 0 && <DummyPage />}
        {activeTab === 1 && (
          <>
            <Typography className="statistics__title" variant="h4" gutterBottom>
              Statistics
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <InstancesTableHeaders />
                <InstancesTableBody
                  itemInstances={itemInstances}
                  handleRowClick={handleRowClick}
                  expandedRow={expandedRow}
                />
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Statistics;
