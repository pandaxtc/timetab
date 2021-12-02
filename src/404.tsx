/**
 * @fileoverview This module provides a basic error message to display
 * to the user when a 404 error is encountered.
 */
import React from "react";

function NotFound() {
  return (
    <h2>
      <span style={{ color: "var(--accent-color)" }}>
        404 - Page Not Found!
      </span>
    </h2>
  );
}

export default NotFound;
