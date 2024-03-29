import React from "react";
import styled from "styled-components";
import arrowIcon from "../../../../assets/arrowDown.svg";
import { useDispatch, useSelector } from "react-redux";
import SubmenuBtns from "./SubmenuBtns";
import ContactsInfo from "./ContactsInfo";
import { setFilteredContactsAmount } from "../../../../features/contacts/contactsSlice";
import { setFilteredContacts } from "../../../../features/contacts/contactsSlice";
import { refreshSelectedContactsID } from "../../../../features/contacts/contactsSlice";
import * as contactsModule from "../../../../features/contacts/contactsSlice";

const FilteredContacts = (props) => {
  const dispatch = useDispatch();

  const { contacts, searchingContact, selectedContactsID } = useSelector(
    (store) => store.contacts
  );
  const { darkMode } = useSelector((store) => store.themeMode);

  React.useEffect(() => {
    props.listEl.current.scrollTo(0, 0);
  }, [props.listEl]);

  const findMatches = (wordToMatch, contactsData) => {
    return contactsData.filter((person) => {
      const regex = new RegExp(wordToMatch, "gi");
      return (
        person.name.match(regex) ||
        person.surname.match(regex) ||
        person.phone.match(regex)
      );
    });
  };

  const filteredContacts = findMatches(searchingContact, contacts).sort(
    (a, b) => a.name > b.name
  );

  const handleClick = (e, id) => {
    const img = e.currentTarget.firstChild;

    if (!img.classList.contains("checked")) {
      img.nextElementSibling.classList.add("hide");
      img.classList.add("checked");

      dispatch(contactsModule.addSelectedContactID(id));
    } else {
      img.classList.remove("checked");
      img.nextElementSibling.classList.remove("hide");
      const filteredSelectedContacts = selectedContactsID.filter(
        (contactID) => contactID !== id
      );
      dispatch(
        contactsModule.refreshSelectedContactsID(filteredSelectedContacts)
      );
    }
  };

  const handleMouseOver = (e) => {
    const img = e.currentTarget;
    if (!img.children[0].classList.contains("checked")) {
      img.children[1].classList.remove("hide");
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.children[1].classList.add("hide");
  };

  React.useEffect(() => {
    dispatch(setFilteredContactsAmount(filteredContacts.length));
  });

  React.useEffect(() => {
    dispatch(refreshSelectedContactsID([]));
    dispatch(setFilteredContacts(filteredContacts));
    // eslint-disable-next-line
  }, [filteredContacts.length]);

  if (filteredContacts.length === 0) {
    return (
      <StyledZeroResultsContainer className={darkMode ? "dark-mode" : ""}>
        <div className="info-img  no-select">
          <i className="fas fa-search"></i>
        </div>
        <div
          className={
            darkMode ? "info-text dark-mode no-select" : "info-text no-select"
          }
        >
          It looks like there aren't any matches for your search
        </div>
      </StyledZeroResultsContainer>
    );
  }
  return (
    <>
      {filteredContacts.map((contact, index) => {
        const { name, surname, phone, mail } = contact;

        return (
          <StyledLetterContainer key={index}>
            <ul className="contact-list">
              <StyledLiContact
                id={phone}
                className={darkMode ? "dark-mode" : ""}
              >
                <div
                  className={
                    darkMode
                      ? "contact-img dark-mode no-select"
                      : "contact-img no-select"
                  }
                  onClick={(e) => handleClick(e, phone)}
                  onMouseOver={(e) => handleMouseOver(e, phone)}
                  onMouseLeave={(e) => handleMouseLeave(e, phone)}
                >
                  <i
                    className={
                      selectedContactsID.find(
                        (contactID) => contactID === phone
                      )
                        ? darkMode
                          ? "fas fa-check dark-mode checked"
                          : "fas fa-check checked"
                        : "fas fa-check"
                    }
                  ></i>
                  <i
                    className={
                      darkMode
                        ? "fas fa-check hover dark-mode hide"
                        : "fas fa-check hover hide"
                    }
                  ></i>
                  {name.slice(0, 1)}
                  {surname.slice(0, 1)}
                </div>
                <div className={darkMode ? "contact dark-mode" : "contact"}>
                  <ContactsInfo
                    contactID={phone}
                    name={name}
                    surname={surname}
                  />
                </div>
                <div className="submenu-icon">
                  <img
                    src={arrowIcon}
                    alt="icon"
                    className={darkMode ? "dark-mode" : ""}
                  />
                </div>
                <div className={darkMode ? "submenu dark-mode" : "submenu"}>
                  <SubmenuBtns contactID={phone} email={mail} />
                </div>
              </StyledLiContact>
            </ul>
          </StyledLetterContainer>
        );
      })}
    </>
  );
};

const StyledZeroResultsContainer = styled.div`
  width: 100%;
  height: 25rem;
  color: var(--white-primary);

  &.dark-mode {
    .info-img {
      color: var(--white-secondary);
    }
    .info-text {
      color: var(--white-secondary);
    }
  }

  .info-img {
    width: 100%;
    height: 50%;
    font-size: 5rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-left: 0.8rem;
    opacity: 0.2;
    color: var(--grey-dark);
  }

  .info-text {
    width: 100%;
    height: 25%;
    text-align: center;
    margin-top: 2rem;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-size: 1.5rem;
    opacity: 0.2;
    color: var(--grey-dark);
  }
`;

const StyledLetterContainer = styled.li`
  .contact-list {
    margin: 0.5rem 0 0.5rem 0;
    padding-left: 0;

    li {
      &.showSubmenu {
        margin-bottom: 2rem !important;
      }
      &:first-child {
        border-radius: 0.5rem 0.5rem 0 0;
      }
      &:last-child {
        border-radius: 0 0 0.5rem 0.5rem;
        margin-bottom: 1rem;
      }
      &:only-child {
        border-radius: 0.5rem;
      }

      .submenu-icon {
        width: 19%;
        opacity: 0;
        height: 100%;
        border-radius: 0.2rem;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        right: 0;
        transition: all 0.3s linear;
        padding-left: 0.5rem;
        padding-right: 0.5rem;

        &.show-icons {
          opacity: 1;
        }

        img {
          cursor: pointer;
          width: 20px;

          filter: invert(81%) sepia(6%) saturate(227%) hue-rotate(173deg)
            brightness(85%) contrast(91%);
          transition: all 0.2s ease-in;

          &.dark-mode {
            filter: invert(40%) sepia(7%) saturate(214%) hue-rotate(177deg)
              brightness(96%) contrast(82%);
            &.active {
              filter: invert(50%) sepia(97%) saturate(1486%) hue-rotate(205deg)
                brightness(90%) contrast(98%);
            }
          }

          &.active {
            transform: rotate(90deg) scale(0.8);
            filter: invert(55%) sepia(100%) saturate(7471%) hue-rotate(190deg)
              brightness(84%) contrast(90%);
          }
        }
      }
    }

    .submenu {
      position: absolute;
      bottom: -1.2rem;
      left: 50%;
      width: 95%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 1.3rem;
      font-size: 1rem;
      border-radius: 0 0 0.5rem 0.5rem;
      transform: translateX(-50%);
      background-color: #dbe4ee3d;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
      opacity: 0;

      &.dark-mode {
        background-color: var(--dark-mode-4);
        button {
          color: var(--grey-light);
          &:hover {
            color: var(--dark-mode-clr);
          }
        }
      }

      &.show {
        bottom: -1.38rem;
        opacity: 1;
      }

      a {
        height: 100%;
        pointer-events: none;
      }

      &.show a {
        pointer-events: all;
      }

      button {
        font-family: inherit;
        font-weight: bold;
        border: none;
        color: var(--grey-dark-secondary);
        background-color: transparent;
        pointer-events: none;
        &:hover {
          color: var(--blue-primary);
        }
        &:active {
          transform: scale(0.8);
        }
      }

      &.show button {
        cursor: pointer;
        pointer-events: all;
      }
    }
  }
`;

const StyledLiContact = styled.li`
  width: 96%;
  height: 3.1rem;
  list-style: none;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  margin-left: 0.8rem;
  transition: all 0.3s linear;
  display: flex;
  align-items: center;
  background-color: #dbe4ee3d;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 0;
  position: relative;

  &.dark-mode {
    background-color: var(--dark-mode-4);
  }

  .contact-img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    letter-spacing: 0.08rem;
    font-weight: 600;
    font-size: 1rem;
    background-color: var(--white-secondary);
    color: var(--blue-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    margin-left: 0.5rem;
    padding-left: 0.1rem;
    position: relative;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;

    &.dark-mode {
      background-color: var(--dark-mode-clr);
      color: var(--white-secondary);
    }

    .fa-check {
      position: absolute;
      background-color: var(--blue-primary);
      color: var(--white-secondary);
      font-size: 1.2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 0.2rem;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;
      transition: all 0.1s linear;

      &.dark-mode {
        color: var(--dark-mode-clr);
        background-color: var(--white-secondary);
      }

      &.hover {
        color: var(--blue-primary);
        background-color: var(--white-secondary);
        opacity: 1;

        &.dark-mode {
          background-color: var(--dark-mode-clr);
          color: var(--white-secondary);
        }

        &.hide {
          opacity: 0;
        }
      }

      &.checked {
        opacity: 1;
      }
    }
  }

  .contact {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    text-transform: capitalize;
    font-size: 1.2rem;
    color: var(--dark-mode-primary);

    &.dark-mode {
      color: var(--white-secondary);

      p {
        &:first-child:hover {
          color: var(--dark-mode-clr);
        }
        &:nth-child(2) {
          color: var(--grey-light-2);
        }
      }
    }

    p {
      &:first-child {
        margin: 0;
        cursor: pointer;
      }
      &:first-child:hover {
        color: var(--blue-primary);
      }

      &:nth-child(2) {
        margin: 0.1rem 0 0 0;
        font-size: 1.05rem;
        color: var(--grey-semi-dark);
      }

      .fas {
        margin-right: 0.4rem;
        font-size: 0.8rem;
        transform: rotate(20deg) translateY(-0.1rem);
        color: var(--green-primary);
      }
    }
  }
`;

export default FilteredContacts;
