import React from "react";
import "./_features.scss";
const FeatureCard = ({ title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-card__content">
        <div className="feature-card__icon">
          <svg
            viewBox="0 0 1024 1024"
            fill="#000000"
            className="icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M512 0C229.611606 0 0 229.611606 0 512s229.611606 512 512 512 512-229.611606 512-512S794.258081 0 512 0z m309.102571 815.890048c-9.773479-52.776788-32.83889-102.686689-67.502164-144.386867a38.937541 38.937541 0 0 0-54.99211-4.951896 38.937541 38.937541 0 0 0-4.951896 54.99211c35.184525 42.351743 54.601171 95.91041 54.601171 151.032833 0 0.912191 0.260626 1.824383 0.260626 2.736574-68.023416 44.436752-149.20845 70.369051-236.518198 70.369051s-168.364469-25.932298-236.518198-70.369051c0-0.912191 0.260626-1.69407 0.260626-2.736574 0-130.182744 105.944515-236.257572 236.257572-236.257572 121.712395 0 220.750318-99.037923 220.750318-220.750318s-99.037923-220.750318-220.750318-220.750318-220.750318 99.037923-220.750318 220.750318c0 70.499364 33.229829 133.179944 84.8338 173.576992-89.003818 42.872996-154.811911 126.533978-173.186053 226.614405C125.7521 737.571901 78.187834 630.193942 78.187834 512 78.187834 272.745228 272.745228 78.187834 512 78.187834s433.812166 194.557394 433.812166 433.812166c-0.130313 118.193942-47.694579 225.571901-124.709595 303.890048zM369.307203 415.698651c0-78.578773 63.983711-142.562484 142.562484-142.562484s142.562484 63.983711 142.562484 142.562484c0 78.709086-63.983711 142.562484-142.562484 142.562484S369.307203 494.277424 369.307203 415.698651z" />
          </svg>
        </div>
        <h3 className="feature-card__title">{title}</h3>
        <p className="feature-card__description">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
