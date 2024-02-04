/*
Author: @arthur-mdn
Date: Janvier 2024
*/

import { createContext, useContext, useState } from 'react';
import Modale from "./Modale.jsx";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModaleProvider = ({ children }) => {
  const [modalProps, setModalProps] = useState({ isOpen: false });

  const newModal = (props) => {
    setModalProps({ ...props, isOpen: true });
  };

  const closeModal = () => {
    setModalProps({ isOpen: false });
  };

  return (
    <ModalContext.Provider value={{ newModal, closeModal, modalProps }}>
      <Modale/>
      {children}
    </ModalContext.Provider>
  );
};
