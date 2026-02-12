import { useCallback, useEffect, useState } from "react";
import throttle from "lodash/throttle";
import { searchAddressesAsync } from "./../store/addressSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/store";
import { RootState } from "../store/store";
import ShowSearchResultsByType from "./ShowSearchResultsByType";
import { updateField } from "../store/formSlice";
import ShowUnitResults from "./ShowUnitResults";
import { Button } from "./button";
import { withPrefix } from "../utils/withPrefix";
import { Input } from "./input";
import { SearchIcon } from "./icons/SearchIcon";

function AddressSearch() {
  const [showNoUnits, setShowNoUnits] = useState<boolean>(false);
  const [showNoBuildings, setShowNoBuildings] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const searchResults = useSelector(
    (state: RootState) => state.address.filteredAddresses || [],
  );

  const unitResults = useSelector(
    (state: RootState) => state.address.filteredUnits || [],
  );
  const [showResults, setShowResults] = useState<boolean>(
    searchResults.length > 0 ? true : false,
  );

  const [showUnitResults, setShowUnitResults] = useState<boolean>(
    unitResults.length > 0 ? true : false,
  );

  const formData = useSelector((state: RootState) => state.form);
  const [searchQuery, setSearchQuery] = useState<string>(
    formData.selected_address || "",
  );
  const [unitQuery, setUnitQuery] = useState<string>(
    formData.selected_unit || "",
  );

  useEffect(() => {
    setSearchQuery(formData.selected_address || "");
  }, [formData.selected_address]);

  useEffect(() => {
    setUnitQuery(formData.selected_unit || "");
  }, [formData.selected_unit]);

  const throttledBuildingSearch = useCallback(
    throttle(
      async (addressQuery: string) => {
        const addresses = searchAddressesAsync({
          addressQuery,
          type: "BUILDING",
        });

        const result = await dispatch(addresses).unwrap();

        setShowNoBuildings(
          result.filteredAddresses.length === 0 ? true : false,
        );
        setShowResults(addressQuery.length > 0 ? true : false);
      },
      750,
      { leading: false },
    ),
    [dispatch],
  );

  const throttledUnitSearch = useCallback(
    throttle(
      async (addressQuery: string, selected_address: string) => {
        const street_number = selected_address
          ? selected_address.split(" ")[0]
          : "";

        const street_name = selected_address
          ? selected_address.split(" ").slice(1).join(" ")
          : "";

        const results = await dispatch(
          searchAddressesAsync({
            addressQuery,
            type: "UNIT",
            street_number,
            street_name,
          }),
        ).unwrap();

        setShowNoUnits(
          results.filteredAddresses && results.filteredAddresses.length === 0
            ? true
            : false,
        );
        setShowUnitResults(addressQuery.length > 0 ? true : false);
      },
      750,
      { leading: false },
    ),
    [dispatch],
  );

  const searchForAddresses = async (query: string) => {
    setSearchQuery(query);
    throttledBuildingSearch(query);
    dispatch(updateField({ field: "selected_address", value: "" }));
  };

  const searchForUnits = (query: string) => {
    setUnitQuery(query);

    throttledUnitSearch(query, formData.selected_address);
    dispatch(updateField({ field: "selected_unit", value: "" }));
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      throttledBuildingSearch(searchQuery);
    }
  }, []);

  const selectThisAddress = (address: string) => {
    setSearchQuery(address);
    dispatch(updateField({ field: "selected_address", value: address }));
    dispatch(updateField({ field: "selected_unit", value: "" }));
    dispatch(updateField({ field: "location_id", value: "" }));
    setUnitQuery("");
    setShowUnitResults(false);
    setShowNoUnits(false);

    // searchForAddressesImmediately(address);
  };

  const selectThisUnit = (
    unit: string,
    location_id: string,
    city: string,
    postal_code: string,
  ) => {
    setUnitQuery(unit);
    dispatch(updateField({ field: "selected_unit", value: unit }));
    dispatch(updateField({ field: "location_id", value: location_id }));
    dispatch(updateField({ field: "city", value: city }));
    dispatch(updateField({ field: "postal_code", value: postal_code }));
  };

  return (
    <div className={withPrefix("mt-4 mb-4")}>
      <div>
        <strong>Enter Address</strong>
        <br />
        <span>eg., Homewood, Fairview</span>
      </div>

      <div
        className={withPrefix(
          "border border-gray-300 rounded-md mt-2 flex shadow-md items-center",
        )}
      >
        <SearchIcon />
        <Input
          aria-label="Enter your address to find your building"
          type="text"
          placeholder="Enter address"
          value={searchQuery}
          onChange={(e) => searchForAddresses(e.target.value)}
          autoComplete="off"
        />

        <Button
          plain
          className={withPrefix("mr-[2px] mt-[0.5px]")}
          onClick={() => {
            setUnitQuery("");
            setSearchQuery("");
            dispatch(updateField({ field: "selected_address", value: "" }));
            setShowResults(false);
            setShowNoBuildings(false);
          }}
        >
          {searchQuery > "" && (
            <span className={withPrefix("text-gray-500")}>X</span>
          )}
        </Button>
      </div>

      {searchResults.length > 0 &&
        showResults === true &&
        (!formData.selected_address || formData.selected_address === "") &&
        searchQuery > "" && (
          <ShowSearchResultsByType
            searchResults={searchResults as any}
            selectThisAddress={selectThisAddress}
            formData={formData}
          />
        )}
      {showNoBuildings && searchQuery > "" && (
        <div className={withPrefix("relative")}>
          <div
            className={withPrefix(
              "absolute l-0 t-0 w-full max-w-[100%] max-h-[300px] overflow-y-auto border-2 border-gray-300 rounded-lg z-10 bg-white shadow-lg p-2",
            )}
          >
            No buildings found.
          </div>
        </div>
      )}

      {formData.selected_address && formData.selected_address > "" && (
        <div className={withPrefix("mt-4 mb-4")}>
          <div>
            <strong>Suite or Unit Number</strong>
            <br />
            eg., 1507, 1001B, PH10
          </div>

          <div
            className={withPrefix(
              "border border-gray-300 rounded-md mt-2 flex shadow-md items-center",
            )}
          >
            <SearchIcon />
            <Input
              aria-label="Enter your suite or unit number"
              type="text"
              placeholder=""
              value={unitQuery}
              onChange={(e) => {
                searchForUnits(e.target.value);
              }}
              autoComplete="off"
            />

            <Button
              plain
              className={withPrefix("mr-[2px] mt-[0.5px]")}
              onClick={() => {
                setUnitQuery("");
                setSearchQuery(formData.selected_address);
                dispatch(updateField({ field: "selected_unit", value: "" }));
                setShowResults(false);
                setShowNoUnits(false);
              }}
            >
              {unitQuery > "" && (
                <span className={withPrefix("text-gray-500")}>X</span>
              )}
            </Button>
          </div>

          {searchResults.length > 0 &&
            showUnitResults === true &&
            (!formData.selected_unit || formData.selected_unit === "") && (
              <ShowUnitResults
                searchResults={unitResults as any}
                unitQuery={unitQuery}
                selectThisUnit={selectThisUnit}
              />
            )}
          {showNoUnits && unitQuery > "" && (
            <div className={withPrefix("relative")}>
              <div
                className={withPrefix(
                  "absolute l-0 t-0 w-full max-w-[100%] max-h-[300px] overflow-y-auto border-2 border-gray-300 rounded-lg z-10 bg-white shadow-lg p-2",
                )}
              >
                No units found.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AddressSearch;
