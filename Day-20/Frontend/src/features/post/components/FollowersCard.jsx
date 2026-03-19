import React from "react";

const FollowersCard = ({ key, username, status }) => {
  return (
    <div className="follower-container">
      <div className="img-wrapper">
        <img
          src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ_Zuz3haRHrSz0f3bnMlUTGa14Qc7Z5LLQ3-l04P98hv9CMXQU"
          alt=""
          height="100%"
          align
        />
      </div>
      <div className="username">
        <h4> {username} </h4>
      </div>
      <button className="button primary-button">{status}</button>
      <p></p>
    </div>
  );
};

export default FollowersCard;
