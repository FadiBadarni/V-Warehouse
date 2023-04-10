import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { motion } from "framer-motion";

const Items = ({ items, selectedTag }) => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
  });

  const itemHover = {
    initial: { translateY: 0 },
    hover: { translateY: -10 },
  };

  return (
    <animated.div className="warehouse__items" style={fadeIn}>
      {items
        .filter((item) => !selectedTag || item.itemType.name === selectedTag)
        .map((item) => (
          <Link key={item.id} to={`/warehouse/item/${item.id}`}>
            <motion.div
              key={item.id}
              className="warehouse__item"
              variants={itemHover}
              initial="initial"
              whileHover="hover"
            >
              <div className="warehouse__item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <div className="warehouse__item-tag">{item.itemType.name}</div>
            </motion.div>
          </Link>
        ))}
    </animated.div>
  );
};

export default Items;
