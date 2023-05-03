import { useState } from "react";

import SVG from "../SVG";
import Separator from "../separator/Separator";

import type { KeyboardEvent, Dispatch, SetStateAction } from "react";

import CSS from "./Search.module.scss";

enum SEARCH_TYPE {
  Song,
  Album,
  Artist,
}
const SEARCH_TYPE_LENGTH = 3;

type TabProps = {
  type: number;
  activeTab: SEARCH_TYPE;
  setActiveTab: Dispatch<SetStateAction<SEARCH_TYPE>>;
};
function Tab({ type, activeTab, setActiveTab }: TabProps) {
  return (
    <button
      id={`${SEARCH_TYPE[type]}-tab`}
      className={CSS.tab}
      role="tab"
      tabIndex={activeTab === type ? 0 : -1}
      aria-selected={activeTab === type}
      aria-controls="search-form"
      onClick={activeTab === type ? null : () => setActiveTab(type)}
    >
      {SEARCH_TYPE[type]}
    </button>
  );
}

export default function Search() {
  const [activeTab, setActiveTab] = useState(SEARCH_TYPE.Song);

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
        <form className={CSS.form}>
          <div className={CSS.formfield}>
            <div>
              <label className={CSS.formfieldLabel} htmlFor="search-name">
                Name
              </label>
              <input id="search-name" className={CSS.formfieldInput} />
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
                Artist
              </label>
              <input id="search-artist" className={CSS.formfieldInput} />
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
