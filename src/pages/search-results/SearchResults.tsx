import { useEffect, useState, useRef } from "react";
import { useSearch, Route, useNavigate } from "@tanstack/router";
import axios from "axios";
import * as country from "country-list";

import { rootRoute } from "../../router";
import { MusicBrainz } from "../../utilities/axios";

import Flair from "../../components/flair/Flair";
import SVG, { FlagSVG } from "../../components/SVG";

import BaseLayout from "../../layout/base-layout/BaseLayout";

import CSS from "./SearchResults.module.scss";

import type { AxiosError } from "axios";
import type {
  Artist,
  Recording,
  Release,
  Release_Release,
} from "../../types/api/MusicBrainz";

const SEARCH_RESULTS_RETURNED_PER_REQUEST = 25;

type EntityString = "recording" | "release" | "artist";

export default function SearchResults() {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { type, name, artist } = useSearch({
    from: searchResultsRoute.id,
  });
  const [page, setPage] = useState(0);

  const [entity, setEntity] = useState<EntityString>(null);
  const [searchResults, setSearchResults] = useState<
    Artist | Recording | Release
  >(null);

  const hasMoreSearchResultToFetch =
    searchResults && searchResults[`${entity}s`].length < searchResults.count;

  const onKeyboardToNavigateToParticularPage = (
    e: React.KeyboardEvent<HTMLTableRowElement>
  ) => {
    const pressedKey = e.code;
    if (pressedKey === "Space" || pressedKey === "Enter") {
      // `rowIndex` uses one-based indexing.
      onNavigateToParticularPage(
        (e.target as HTMLTableRowElement).rowIndex - 1
      );
    }
  };

  const onNavigateToParticularPage = (clickedSearchResultIndex: number) => {
    let destination: string;

    switch (type) {
      case "song":
        // TODO: set to song route
        break;

      case "album": {
        const album = searchResults[`${entity}s`][
          clickedSearchResultIndex
        ] as Release_Release;
        const albumTitle = album.title.replaceAll(" ", "-").toLowerCase();

        destination = `/album/${albumTitle}/${album.id}`;

        break;
      }

      case "artist":
        // TODO: set to artist route
        break;

      default:
        return;
    }

    void navigate({ to: destination, from: rootRoute.path });
  };

  const onLoadMoreSearchResults = () => setPage(page + 1);

  useEffect(() => {
    const abortController = new AbortController();

    let query = "";
    let entity: EntityString = null;
    switch (type) {
      case "song":
        entity = "recording";

        query = `"${name}" AND country:XW`;
        if (artist) query += ` AND artist:"${artist}"`;

        break;

      case "album":
        entity = "release";

        query = `"${name}" AND country:XW`;
        if (artist) query += ` AND artist:"${artist}"`;

        break;

      case "artist":
        entity = "artist";

        query = `"${name}"`;

        break;
    }

    MusicBrainz.get<Recording | Release | Artist>(entity, {
      params: {
        query,
        // NOTE: the `offset` param is the offset for
        // _search results_ not for pages. I.e., `offset: 1`
        // does not mean second page of results (since offset
        // starts at `0`). Instead, it means give the default
        // amount of search results starting from the second
        // search result (i.e., do not include the first two
        // search results, return the `SEARCH_RESULTS_RETURNED_PER_REQUEST`
        // amount after that.
        offset: page * SEARCH_RESULTS_RETURNED_PER_REQUEST,
      },
      signal: abortController.signal,
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          if (page === 0) {
            setSearchResults(response.data);
          } else {
            setSearchResults({
              // Append new page of results to `searchResults`
              [`${entity}s`]: [
                ...searchResults[`${entity}s`],
                ...response.data[`${entity}s`],
              ],
              count: searchResults.count,
              created: response.data.created,
              offset: response.data.offset,
            } as Artist | Recording | Release);
          }

          setEntity(entity);
        } else throw Error("Error fetching search results");
      })
      .catch((error: AxiosError) => {
        if (!axios.isCancel(error)) {
          console.error(error);
        }
      });

    return () => abortController.abort();
  }, [page]);

  // Show vertical shadows on overflowed container
  // edge boundaries to indicate that it's possible
  // to scroll in that direction
  useEffect(() => {
    // Add right border shadow on page load
    // if the table wrapper is already overflowing.
    const tableWrapperIsOverflowedOnMount =
      tableWrapperRef.current.clientWidth < tableWrapperRef.current.scrollWidth;
    if (tableWrapperIsOverflowedOnMount)
      tableWrapperRef.current.classList.add(CSS.tableWrapperRightBorderShadow);

    window.addEventListener(
      "resize",
      addTableWrapperRightBorderShadowOnWindowResize
    );

    tableWrapperRef.current.addEventListener(
      "scroll",
      addTableWrapperBorderShadows
    );
    tableWrapperRef.current.addEventListener("keydown", disableSpaceToScroll);

    return () => {
      window.removeEventListener(
        "resize",
        addTableWrapperRightBorderShadowOnWindowResize
      );

      // Foot note (2)
      tableWrapperRef.current?.removeEventListener(
        "scroll",
        addTableWrapperBorderShadows
      );
      tableWrapperRef.current?.removeEventListener(
        "keydown",
        disableSpaceToScroll
      );
    };

    // When window is resizing, add right border shadow
    // on table wrapper if it's overflowing, remove
    // if otherwise.
    function addTableWrapperRightBorderShadowOnWindowResize() {
      const tableWrapperEl = tableWrapperRef.current;

      const tableWrapperIsOverflowed =
        tableWrapperEl.clientWidth < tableWrapperEl.scrollWidth;

      if (tableWrapperIsOverflowed) {
        tableWrapperEl.classList.add(CSS.tableWrapperRightBorderShadow);
      } else {
        tableWrapperEl.classList.remove(CSS.tableWrapperRightBorderShadow);

        // Remove the left border shadow pre-emptively just in case
        // the scroll position was in the middle or right edge
        // before resizing window to a size that doesn't
        // overflow table wrapper
        tableWrapperEl.classList.remove(CSS.tableWrapperLeftBorderShadow);
      }
    }

    function addTableWrapperBorderShadows(event: Event) {
      const tableWrapperEl = event.target as HTMLDivElement;

      const isOverflowed =
        tableWrapperEl.clientWidth < tableWrapperEl.scrollWidth;

      // Table wrapper has to be overflowed
      // for there to be left/right border shadows
      if (isOverflowed) {
        const isOnLeftEdge = tableWrapperEl.scrollLeft === 0;
        if (isOnLeftEdge) {
          // Remove left border shadow in case it was added
          // when scroll position was in between
          tableWrapperEl.classList.remove(CSS.tableWrapperLeftBorderShadow);

          tableWrapperEl.classList.add(CSS.tableWrapperRightBorderShadow);
        } else {
          // Foot note (1)
          const maximumScrollLeft =
            tableWrapperEl.scrollWidth - tableWrapperEl.clientWidth;

          const isOnRightEdge = tableWrapperEl.scrollLeft === maximumScrollLeft;
          if (isOnRightEdge) {
            // Remove right border shadow in case it was added
            // when scroll position was in between
            tableWrapperEl.classList.remove(CSS.tableWrapperRightBorderShadow);

            tableWrapperEl.classList.add(CSS.tableWrapperLeftBorderShadow);
          } else {
            // Scroll position is in between, so both left and
            // right border shadows should be shown.
            tableWrapperEl.classList.add(
              CSS.tableWrapperLeftBorderShadow,
              CSS.tableWrapperRightBorderShadow
            );
          }
        }
      }
    }

    // Disable pressing "Space" to scroll inside
    // table wrapper because it'll be used to
    // trigger a keyboard click.
    function disableSpaceToScroll(event: KeyboardEvent) {
      const pressedKey = event.code;
      if (pressedKey === "Space") {
        event.preventDefault();
      }
    }

    // Opted to use `entity` as a dependency
    // instead of `searchResults` to detect
    // when `searchResults` exist, because
    // `entity` will only be updated once per
    // page load. If `searchResults` is a dependency,
    // on subsequent fetches to grab more search results,
    // it will rerun this `useEffect` unnecessarily.
  }, [entity]);

  let TableHeaderRow;
  let TableBodyRows;
  switch (entity) {
    case "recording":
      TableHeaderRow = (
        <tr data-entity={entity}>
          <th scope="col" data-col-index>
            #
          </th>
          <th scope="col" data-col-song>
            Song
          </th>
          <th scope="col" data-col-artist>
            Artist
          </th>
          <th scope="col" data-col-duration>
            Duration
          </th>
          <th scope="col" data-col-album>
            Album
          </th>
        </tr>
      );

      TableBodyRows = (searchResults as Recording).recordings.map(
        (recording, index) => {
          // If there are multiple artists, concat them
          // with the join phrase delimiter (which should in the form: " & ")
          const artist = recording["artist-credit"]
            .map((_artist) => {
              let artist = _artist.name;
              if (_artist.joinphrase) artist += _artist.joinphrase;
              return artist;
            })
            .join("");

          let duration = null;
          if (recording.length != null) {
            const lengthInSeconds = Math.round(recording.length / 1000);
            const durationMinutes = Math.trunc(lengthInSeconds / 60);
            // NOTE: remainder of 0 - 9 seconds needs to be padded on the left
            // with one zero. `padEnd` works for 0, but not for 1 - 9 (since it
            // makes 10 -> 90), whereas `padStart` works for both 0 and 1 - 9.
            const durationSeconds = (lengthInSeconds % 60)
              .toString()
              .padStart(2, "0");
            duration = `${durationMinutes}:${durationSeconds}`;
          }

          return (
            <tr
              key={recording.id}
              onClick={(e: React.MouseEvent<HTMLTableRowElement>) =>
                // `rowIndex` uses one-based indexing.
                onNavigateToParticularPage(
                  (
                    (e.target as HTMLTableCellElement)
                      .parentElement as HTMLTableRowElement
                  ).rowIndex - 1
                )
              }
              onKeyDown={onKeyboardToNavigateToParticularPage}
              tabIndex={0}
            >
              <td data-col-index>{index + 1}</td>
              <td data-col-song title={recording.title}>
                {recording.title}
              </td>
              <td data-col-artist title={artist}>
                {artist}
              </td>
              <td data-col-duration={Boolean(duration)}>{duration ?? "-"}</td>
              <td data-col-album title={recording.releases[0].title}>
                {recording.releases[0].title}
              </td>
            </tr>
          );
        }
      );

      break;
    case "release":
      TableHeaderRow = (
        <tr data-entity={entity}>
          <th scope="col" data-col-index>
            #
          </th>
          <th scope="col" data-col-album>
            Album
          </th>
          <th scope="col" data-col-artist>
            Artist
          </th>
          <th scope="col" data-col-track-count>
            # songs
          </th>
        </tr>
      );

      TableBodyRows = (searchResults as Release).releases.map(
        (release, index) => {
          // If there are multiple artists, concat them
          // with the join phrase delimiter (which should in the form: " & ")
          const artist = release["artist-credit"]
            .map((_artist) => {
              let artist = _artist.name;
              if (_artist.joinphrase) artist += _artist.joinphrase;
              return artist;
            })
            .join("");

          return (
            <tr
              key={release.id}
              onClick={(e: React.MouseEvent<HTMLTableRowElement>) =>
                // `rowIndex` uses one-based indexing.
                onNavigateToParticularPage(
                  (
                    (e.target as HTMLTableCellElement)
                      .parentElement as HTMLTableRowElement
                  ).rowIndex - 1
                )
              }
              onKeyDown={onKeyboardToNavigateToParticularPage}
              tabIndex={0}
            >
              <td data-col-index>{index + 1}</td>
              <td data-col-album title={release.title}>
                {release.title}
              </td>
              <td data-col-artist title={artist}>
                {artist}
              </td>
              <td data-col-track-count>{release["track-count"]}</td>
            </tr>
          );
        }
      );

      break;
    case "artist":
      TableHeaderRow = (
        <tr data-entity={entity}>
          <th scope="col" data-col-index>
            #
          </th>
          <th scope="col" data-col-artist>
            Artist
          </th>
          <th scope="col" data-col-band-size>
            Size
          </th>
          <th scope="col" data-col-origin>
            Origin
          </th>
        </tr>
      );

      TableBodyRows = (searchResults as Artist).artists.map((artist, index) => {
        let artistFullNameForTitle = artist.name;
        if (artist.disambiguation != null)
          artistFullNameForTitle += ` ${artist.disambiguation}`;

        let ArtistSize = null;
        if (artist.type === "Person") ArtistSize = <SVG name="person" />;
        if (artist.type === "Group") ArtistSize = <SVG name="group" />;

        let ArtistOrigin = null;
        // Just display a hyphen to make artists who
        // have an origin country of "XU" (i.e., unknown)
        // and those who have no origin country consistent
        if (artist.country && artist.country != "XU") {
          ArtistOrigin = (
            <>
              <FlagSVG iso3166Alpha2CountryCode={artist.country} />
              <span>{country.getName(artist.country)}</span>
            </>
          );
        }

        return (
          <tr
            key={artist.id}
            onClick={(e: React.MouseEvent<HTMLTableRowElement>) =>
              // `rowIndex` uses one-based indexing.
              onNavigateToParticularPage(
                (
                  (e.target as HTMLTableCellElement)
                    .parentElement as HTMLTableRowElement
                ).rowIndex - 1
              )
            }
            onKeyDown={onKeyboardToNavigateToParticularPage}
            tabIndex={0}
          >
            <td data-col-index>{index + 1}</td>
            <td data-col-artist title={artistFullNameForTitle}>
              <span>{artist.name}</span>
              {artist.disambiguation != null && (
                <span data-artist-disambiguation>
                  {" "}
                  ({artist.disambiguation})
                </span>
              )}
            </td>
            {/* NOTE: `artist.type` is the artist "size" (person or group) */}
            <td data-col-band-size={Boolean(ArtistSize)}>
              {ArtistSize ?? "-"}
            </td>
            <td data-col-origin={Boolean(ArtistOrigin)}>
              {ArtistOrigin ?? "-"}
            </td>
          </tr>
        );
      });

      break;
  }

  return (
    <BaseLayout>
      <div className={CSS.container}>
        {searchResults && (
          <p id="table-summary" className={CSS.tableSummary}>
            Found {searchResults.count} {type}s named &quot;{name}
            &quot; {artist && `by ${artist}`}
          </p>
        )}

        <Flair />

        <div ref={tableWrapperRef} className={CSS.tableWrapper}>
          {searchResults && (
            <table aria-describedby="table-summary" className={CSS.table}>
              <thead className={CSS.tableHead}>{TableHeaderRow}</thead>
              <tbody className={CSS.tableBody} data-entity={entity}>
                {TableBodyRows}
              </tbody>
            </table>
          )}
        </div>

        {/* Show "Load more" button if there are more search results to fetch */}
        {hasMoreSearchResultToFetch && (
          <button
            className={CSS.loadMoreButton}
            onClick={onLoadMoreSearchResults}
          >
            Load more
          </button>
        )}
      </div>
    </BaseLayout>
  );
}

type SearchParams = {
  type: string;
  name: string;
  artist?: string;
};
export const searchResultsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchResults,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    type: String(search.type),
    name: String(search.name),
    artist: search?.artist ? String(search.artist) : null,
  }),
});

// Enhancement:
// If fetch request fails, add automatic, manual, or both retry
// (automatically for 3 retries, then a manual button to retry)

// TODO: add to README
// Notable limitation
// According to this table of MusicBrainz search mode capabilities,
// (@see https://musicbrainz.org/doc/Development/Search_Architecture)
// the direct database search can not be used via the MusicBrainz API.
// I was intending to use the direct database search for searching
// for artists since it returned the most accurate search results
// compared to the indexed search, but there seems to be no way around this.
// What this means is that there may be a _lot_ of extra search results
// when searching for an artist.

/**
 * Foot note (1)
 *
 * The maximum value of `scrollLeft`
 * is `scrollWidth` - `clientWidth`
 *
 *                 `scrollWidth`
 * | ---------------------------------------- |
 *   `clientWidth`
 * | -------------- |
 * ——————————————————
 * |                |                         |
 * |   (visible)    |                         |
 * |    (area)      |       (overflow)        |
 * |                |                         |
 * |                |                         |
 * ——————————————————
 *                  | ----------------------- |
 *                      maximum `scrollLeft`
 */

/**
 * Foot note (2)
 *
 * For some reason, when the `useEffect` clean up
 * callback is invoked when this component
 * unmounts, `tableWrapperRef.current` is null?
 * Seems as if the clean up callback invokes _after_
 * this component has been removed from the DOM,
 * so I'm wondering whether any attached event listeners
 * on this component will be detached as the component is
 * removed from the DOM or not?
 *
 * Conclusion after some research: if the element that has
 * been removed from the DOM is reference free, then it will
 * be GC'd and all attached event listeners will be detached
 * as well. In this case, it is reference free, so the
 * DOM element that `tableWrapperRef.current` references
 * has been removed from the DOM which is why it's referencing
 * null and all its attached event listeners have been removed.
 * Will keep the explicit `removeEventListener`s here just for
 * completeness.
 * Source: https://stackoverflow.com/a/12528067
 *
 *
 */
