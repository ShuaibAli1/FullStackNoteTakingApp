import React from "react";
import "./Model.css";
const Modal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p>Are you sure you want to delete this note?</p>
        <div className="modal-actions">
          <div className="no-button">
            <button onClick={onCancel}>NO</button>
          </div>
          <br />
          <div className="delete-button">
            <button onClick={onConfirm}>YES</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
