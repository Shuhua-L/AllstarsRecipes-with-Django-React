import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Message = (props) => {
  // props: message, url, boxID

  const navigate = useNavigate();

  return (
    <>
      {/* Display Message */}
      {props.message.length > 0 && (
        <div className="toast fade show w-100" role="alert">
          <div className="d-flex">
            <div className="toast-body ">
              {props.message}

              {props.url && (
                <i
                  className="fa-solid fa-share ms-2"
                  style={{ scale: "1.2", color: "black" }}
                  onClick={() => {
                    // redirect to box page
                    navigate(props.url, { state: { id: props.boxID } });
                  }}
                ></i>
              )}
            </div>
            <button
              type="button"
              className="btn-close me-2 m-auto"
              data-bs-dismiss="toast"
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
