import { useState, useRef } from "react";

import SVG from "../SVG";
import Separator from "../separator/Separator";

import type { FormEvent, KeyboardEvent, Dispatch, SetStateAction } from "react";

import CSS from "./Search.module.scss";

enum SEARCH_TYPE {
  Song,
  Album,
  Artist,
}
enum FORMFIELD {
  NAME = "Name",
  ARTIST = "Artist",
}
const SEARCH_TYPE_LENGTH = 3;

type TabProps = {
  type: number;
  activeTab: SEARCH_TYPE;
  setActiveTab: Dispatch<SetStateAction<SEARCH_TYPE>>;
  resetErrorMessageState: () => void;
};
function Tab({
  type,
  activeTab,
  setActiveTab,
  resetErrorMessageState,
}: TabProps) {
  const onChangeTabs = () => {
    // Reset form fields
    const nameInput = document.getElementById("search-name");
    const artistInput = document.getElementById("search-artist");
    switch (SEARCH_TYPE[type]) {
      case "Song":
      case "Album":
        (nameInput as HTMLInputElement).value = "";
        (artistInput as HTMLInputElement).value = "";
        break;
      case "Artist":
        // Artist tab's form has no artist input, only name.
        (nameInput as HTMLInputElement).value = "";
        (artistInput as HTMLInputElement).value = null;
        break;
    }

    resetErrorMessageState();
    setActiveTab(type);
  };

  return (
    <button
      id={`${SEARCH_TYPE[type]}-tab`}
      className={CSS.tab}
      role="tab"
      tabIndex={activeTab === type ? 0 : -1}
      aria-selected={activeTab === type}
      aria-controls="search-form"
      onClick={activeTab === type ? null : onChangeTabs}
    >
      {SEARCH_TYPE[type]}
    </button>
  );
}

export default function Search() {
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState(SEARCH_TYPE.Song);
  const [nameIsEmpty, setNameIsEmpty] = useState(null);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(formRef.current);

    // Name input is required, but empty.
    if (form.get(FORMFIELD.NAME).toString().trim().length === 0) {
      setNameIsEmpty(true);
      return;
    }

    // TODO: Navigate to search results page and add search query params into URL
    // In search results page, dispatch fetch request to MusicBrainz
    // If fetch request fails, add automatic, manual, or both retry
    // (automatically for 3 retries, then a manual button to retry)
  };

  // Need to slice first three elements
  // because `Object.values` returns an
  // array of enum properties and their
  // associated values. First three elements
  // are properties, latter three are values.
  const Tabs = Object.keys(SEARCH_TYPE)
    .slice(0, 3)
    .map((type: string) => (
      <Tab
        key={type}
        type={+type}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        resetErrorMessageState={() => setNameIsEmpty(null)}
      />
    ));

  return (
    <div className={CSS.searchContainer}>
      <div
        className={CSS.tablist}
        role="tablist"
        aria-label="Search type"
        onKeyDown={changeTabFocus}
      >
        {Tabs}
      </div>

      <div
        id="search-form"
        className={CSS.tabpanel}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`${SEARCH_TYPE[activeTab]}-tab`}
      >
        <form className={CSS.form} onSubmit={onSearch} ref={formRef}>
          <div className={CSS.formfield}>
            <div>
              <label
                className={CSS.formfieldLabel}
                style={{ color: `${nameIsEmpty ? "#b2001e" : "currentColor"}` }}
                htmlFor="search-name"
              >
                Name
              </label>
              <input
                id="search-name"
                className={CSS.formfieldInput}
                aria-required="true"
                name={`${FORMFIELD.NAME}`}
                onChange={({ target: formfield }) =>
                  setNameIsEmpty(
                    formfield.value.trim().length === 0 ? true : false
                  )
                }
              />
              {nameIsEmpty && (
                <p className={CSS.requiredErrorMessage}>
                  This field is required.
                </p>
              )}
            </div>

            <Separator inSearch />
          </div>

          {/* Would prefer to use `hidden={activeTab === SEARCH_TYPE.Artist}` here,
          but `className` seems to take precedence */}
          <div
            className={CSS.formfield}
            style={activeTab === SEARCH_TYPE.Artist ? { display: "none" } : {}}
          >
            <div>
              <label className={CSS.formfieldLabel} htmlFor="search-artist">
                Artist <span className={CSS.optionalLabel}>(optional)</span>
              </label>
              <input
                id="search-artist"
                className={CSS.formfieldInput}
                name={`${FORMFIELD.ARTIST}`}
              />
            </div>

            <Separator inSearch />
          </div>

          <button className={CSS.searchButton}>
            <SVG name="search" />
          </button>
        </form>
      </div>
    </div>
  );
}

// Ensure tab list is keyboard accessible by allowing
// L/R arrow keys to move to respective prev/next sibling tab.
// Source: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role#keyboard_interactions
function changeTabFocus(pressed: KeyboardEvent<HTMLDivElement>) {
  if (pressed.key === "ArrowLeft" || pressed.key === "ArrowRight") {
    // Tab buttons have id as "[SEARCH_TYPE]-tab"
    const focusedTab = (pressed.target as HTMLButtonElement).id.split("-")[0];
    const focusedTabIndex = SEARCH_TYPE[focusedTab] as number;

    // Calculate which tab to focus on based on which arrow
    // key was pressed.
    let destinationTabIndex = focusedTabIndex;
    if (pressed.key === "ArrowLeft") {
      // Received insight from this post on how to
      // wrap around a length with modulo; specifically
      // how to wrap when going "backwards"/left.
      // Source: https://stackoverflow.com/a/39740009
      destinationTabIndex =
        (focusedTabIndex - 1 + SEARCH_TYPE_LENGTH) % SEARCH_TYPE_LENGTH;
    }

    if (pressed.key === "ArrowRight") {
      destinationTabIndex =
        (focusedTabIndex + 1 + SEARCH_TYPE_LENGTH) % SEARCH_TYPE_LENGTH;
    }

    // Focus on next/previous tab based on which arrow
    // key is pressed.
    document.getElementById(`${SEARCH_TYPE[destinationTabIndex]}-tab`).focus();
  }
}
