// ParentComponent.jsx
import React, { useState } from "react";
import CheckEmail from "./CheckEmail";
import ChangePassword from "./ChangePassword";

export default function ParentComponent() {
  const [email, setEmail] = useState("");
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  const handleEmailConfirmed = (confirmedEmail) => {
    setEmail(confirmedEmail);
    setIsEmailConfirmed(true); // Set email confirmation state to true
  };

  return (
    <>
      {!isEmailConfirmed ? (
        <CheckEmail onEmailConfirmed={handleEmailConfirmed} />
      ) : (
        <ChangePassword email={email} />
      )}
    </>
  );
}
