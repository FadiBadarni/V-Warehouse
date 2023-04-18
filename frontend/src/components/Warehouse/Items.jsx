import React from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const Items = ({ items, selectedTag }) => {
  const { t } = useTranslation("warehouse");
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
      items.filter(
        (item) => !selectedTag || item.itemType.name === selectedTag
      ),
    [items, selectedTag]
  );

  return (
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
  );
};

export default Items;
