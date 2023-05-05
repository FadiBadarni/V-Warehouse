import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "@mui/material/Pagination";
import images from "../../constants/images";

const Items = ({ items, selectedTag }) => {
  const { t } = useTranslation("warehouse");
  const perPage = 12;
  const [page, setPage] = useState(1);
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
  });

  const itemHover = {
    initial: { translateY: 0 },
    hover: { translateY: -10 },
  };

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => !selectedTag || item.itemType.name === selectedTag)
        .slice((page - 1) * perPage, page * perPage),
    [items, selectedTag, page]
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="warehouse__items-container">
      <animated.div className="warehouse__items" style={fadeIn}>
        {filteredItems.map((item) => (
          <Link key={item.id} to={`/warehouse/item/${item.id}`}>
            <motion.div
              key={item.id}
              className={`warehouse__item ${
                item.quantity === 1 ? "warehouse__item--limited" : ""
              } ${!item.description ? "warehouse__item--no-description" : ""}`}
              variants={itemHover}
              initial="initial"
              whileHover="hover"
            >
              <div
                className="warehouse__item__image"
                style={{
                  backgroundImage: `url(${
                    images[item.name.toLowerCase().replace(/ /g, "_")] ||
                    images.notFound
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
                    {t("warehouse.available")} {item.quantity}
                  </span>
                </div>
              </div>

              <div className="warehouse__item-tag">{item.itemType.name}</div>
            </motion.div>
          </Link>
        ))}
      </animated.div>
      <Pagination
        count={Math.ceil(items.length / perPage)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        size="large"
        className="pagination"
      />
    </div>
  );
};

export default Items;
