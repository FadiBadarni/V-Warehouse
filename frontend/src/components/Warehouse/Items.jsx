import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "@mui/material/Pagination";
import images from "../../constants/images";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

const Items = ({ items, selectedTag, checked }) => {
  const { t } = useTranslation("warehouse");
  const perPage = 12;
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setShowButton(selectedItems.size > 0);
  }, [selectedItems]);

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
  });

  const fadeInOut = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const itemHover = {
    initial: { translateY: 0 },
    hover: { translateY: -10 },
  };

  const filteredItems = useMemo(
    () =>
      items
        .filter(
          (item) =>
            item.name !== "Studio Room" &&
            (!selectedTag || item.itemType.name === selectedTag) &&
            (!checked || item.takeOut)
        )
        .slice((page - 1) * perPage, page * perPage),
    [items, selectedTag, page]
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSelection = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(itemId)) {
        newSelectedItems.delete(itemId);
      } else {
        newSelectedItems.add(itemId);
      }
      return newSelectedItems;
    });
  };

  const totalPageCount = useMemo(() => {
    return Math.ceil(
      items.filter(
        (item) =>
          item.name !== "Studio Room" &&
          (!selectedTag || item.itemType.name === selectedTag)
      ).length / perPage
    );
  }, [items, selectedTag, perPage]);

  return (
    <div className="warehouse__items-container">
      <animated.div className="warehouse__items" style={fadeIn}>
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className={`warehouse__item ${
              item.quantity === 1 ? "warehouse__item--limited" : ""
            } ${!item.description ? "warehouse__item--no-description" : ""}`}
            variants={itemHover}
            initial="initial"
            whileHover="hover"
            onClick={() => handleSelection(item.id)}
          >
            <div
              className="warehouse__item__image"
              style={{
                backgroundImage: `url(${
                  images[
                    item.name
                      .trim()
                      .toLowerCase()
                      .replace(/ /g, "_")
                      .replace(/-/g, "_")
                  ] || images.notFound
                })`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            />
            <div className="warehouse__item-details">
              <h3>{item.name}</h3>
              <p className="truncate">{item.description}</p>
              <div className="attributes">
                <span className="count">
                  {item.quantity > 0
                    ? `${t("warehouse.available")} ${item.quantity}`
                    : ""}
                </span>
              </div>
            </div>
            <div className="warehouse__item-checkbox">
              <Checkbox
                checked={selectedItems.has(item.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelection(item.id);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="warehouse__item-tag">{item.itemType.name}</div>
          </motion.div>
        ))}
      </animated.div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInOut}
          >
            <Button
              className="check-button"
              variant="contained"
              onClick={() => {
                window.location.href = `/warehouse/items/${Array.from(
                  selectedItems
                ).join(",")}`;
              }}
            >
              Proceed
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Pagination
        count={totalPageCount}
        page={page}
        onChange={handlePageChange}
        size="large"
        className="pagination"
      />
    </div>
  );
};

export default Items;
