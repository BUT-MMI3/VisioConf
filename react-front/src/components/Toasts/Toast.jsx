/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import "./toasts.scss";

export default function Toast({ title, message, type }) {
  return (
    <div className={`toast ${type}`}>
      <div className="toast__content">
        <div className="toast__title">{title}</div>
        <div className="toast__message">{message}</div>
      </div>
      <div className="toast__close">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5 1.5L1.5 11.5"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          />
          <path
            d="M1.5 1.5L11.5 11.5"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          />
        </svg>
      </div>
    </div>
  );
}
