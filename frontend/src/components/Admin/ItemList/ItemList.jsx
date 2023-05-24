import React, { useState, useEffect } from "react";
import { getAllItemInstances, fetchItemNames } from "../../../api/AdminService";
import { fetchedItemTypes } from "../../../api/WarehouseService";
import useAdminRole from "../../../hooks/useAdminRole";
import AdminLayout from "../Sidebar/AdminLayout";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import Pagination from "@mui/material/Pagination";
import SearchFilters from "./SearchFilters";
import ItemsGrid from "./ItemsGrid";
import ItemModal from "./ItemModal";
import "./ItemList.scss";
import Modal from "react-modal";
import { QrReader } from "react-qr-reader";
import qrImage from "../../../assets/qr.gif";

const useItemFilter = (initialItems, itemsPerPage) => {
  const [filteredItems, setFilteredItems] = useState(initialItems);
  const [itemType, setItemType] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemState, setItemState] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const filtered = initialItems
      .filter(
        (item) =>
          (itemType === "" || itemType === item.itemType.name) &&
          (itemName === "" || itemName === item.itemName) &&
          (itemState === "" || itemState === item.state) &&
          (searchQuery === "" ||
            item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            searchQuery === "" ||
            item.id.toString().includes(searchQuery))
      )
      .slice(start, end);

    setFilteredItems(filtered);
  }, [
    initialItems,
    itemType,
    itemName,
    itemState,
    searchQuery,
    currentPage,
    itemsPerPage,
  ]);

  return {
    filteredItems,
    itemType,
    setItemType,
    itemName,
    setItemName,
    itemState,
    setItemState,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
  };
};

const ItemList = () => {
  useAdminRole();
  const { handleTokenExpired } = useAuth();
  const { i18n } = useTranslation();
  const direction = i18n.language === "he" ? "rtl" : "ltr";

  const [items, setItems] = useState([]);
  const [type, setType] = useState([]);
  const [names, setName] = useState([]);
  const itemsPerPage = 11;

  const {
    filteredItems,
    itemType,
    setItemType,
    itemName,
    setItemName,
    itemState,
    setItemState,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
  } = useItemFilter(items, itemsPerPage);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const allItemInstances = await getAllItemInstances();
        setItems(allItemInstances);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        if (error.message === "Unauthorized") {
          handleTokenExpired();
        } else {
          console.error("Error fetching warehouse items.", error);
        }
      }
    };
    const fetchedTypes = async () => {
      const type = await fetchedItemTypes();
      setType(type);
    };
    const fetchNames = async () => {
      const names2 = await fetchItemNames();
      setName(names2);
    };
    fetchItems();
    fetchedTypes();
    fetchNames();
  }, [handleTokenExpired]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const handleMoreInfoClick = (item) => {
    setSelectedItem(item);
    toggleModal();
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleResultQRChange = (result, error) => {
    if (!!result) {
      setSearchQuery(result.toString());
      closeModal();
    }
    if (!!error) {
      // console.info(error);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="admin-equipment-list">
      <AdminLayout direction={direction}></AdminLayout>
      <main className="equipment-list">
        <p className="title">
          Effortlessly Browse and Filter Equipment Categories
        </p>
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          itemName={itemName}
          setItemName={setItemName}
          itemType={itemType}
          setItemType={setItemType}
          itemState={itemState}
          setItemState={setItemState}
          names={names}
          type={type}
        />
        <ItemsGrid
          loading={loading}
          filteredItems={filteredItems}
          handleMoreInfoClick={handleMoreInfoClick}
        />

        <div className="pagination">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
            size="large"
          />
        </div>
        <ItemModal
          modalOpen={modalOpen}
          toggleModal={toggleModal}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          itemTypes={type}
        />
        <button
          className={`floating-button ${isHovered ? "hovered" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={openModal}>
          <div className="button-container">
            <img
              src={qrImage}
              alt="Button Icon"
              className={`button-icon ${isHovered ? "no-animation" : ""}`}
            />
            {isHovered && <span className="button-text">SCAN QR</span>}
          </div>
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="qr-modal"
          overlayClassName="qr-modal-overlay">
          <h2 className="qr-modal-title">QR Scanning</h2>
          <QrReader
            className="qr-scanner"
            delay={500}
            onResult={handleResultQRChange}
          />
          <button className="qr-modal-close-btn blue" onClick={closeModal}>
            Close
          </button>
        </Modal>
      </main>
    </div>
  );
};

export default ItemList;
