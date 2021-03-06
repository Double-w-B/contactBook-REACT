import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { refreshSelectedContactsID } from "../../../features/contacts/contactsSlice";
import * as modalModule from "../../../features/modal/modalSlice";
import { handleMenuBtn } from "../../../features/menu/menuSlice";
import { changeThemeMode } from "../../../features/themeMode/themeModeSlice";

const MenuButtons = () => {
  const dispatch = useDispatch();

  const { contacts, selectedContactsID, filteredContactsList } = useSelector(
    (store) => store.contacts
  );
  const { darkMode } = useSelector((store) => store.themeMode);

  const handleSelectAllBtn = () => {
    console.log(filteredContactsList);
    const filteredContactsIDs = filteredContactsList
      ? filteredContactsList.map((contact) => contact.phone)
      : null;

    const allIDs = contacts.map((contact) => contact.phone);

    filteredContactsList
      ? dispatch(refreshSelectedContactsID(filteredContactsIDs))
      : dispatch(refreshSelectedContactsID(allIDs));
  };

  const handleUnselectAllBtn = () => {
    dispatch(refreshSelectedContactsID([]));
  };

  const handleRemoveBtn = () => {
    if (selectedContactsID.length > 0) {
      dispatch(modalModule.handleModalOverlay(true));
      dispatch(modalModule.showDeleteSelectedContactsModal(true));
      dispatch(handleMenuBtn(false));
    }
  };
  const handleChangeThemeBtn = () => {
    dispatch(handleMenuBtn(false));
    dispatch(changeThemeMode());
    darkMode
      ? document.body.classList.remove("dark-mode")
      : document.body.classList.add("dark-mode");
  };

  return (
    <>
      <Button className="menu__btn--select" onClick={handleSelectAllBtn}>
        Select all
      </Button>
      <Button className="menu__btn--unselect" onClick={handleUnselectAllBtn}>
        Unselect all
      </Button>
      <Button className="menu__btn--remove" onClick={handleRemoveBtn}>
        Remove Selected
      </Button>
      <Button className="menu__btn--mode" onClick={handleChangeThemeBtn}>
        Change theme
      </Button>
    </>
  );
};

const Button = styled.button`
  height: 2rem;
  cursor: pointer;
  transition: all 0.1s linear;
  display: flex;
  align-items: center;
  padding-left: 0.8rem;
  background-color: transparent;
  border: none;
  font-size: 1rem;
  color: var(--almost-black);

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    color: var(--blue-primary);
  }
`;

export default MenuButtons;
