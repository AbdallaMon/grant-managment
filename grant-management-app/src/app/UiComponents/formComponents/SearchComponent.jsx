"use client";

import React, {useState, useEffect} from "react";
import {TextField, Box, CircularProgress} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import {getPropertyValue} from "@/app/helpers/functions/utility";

const SearchComponent = ({apiEndpoint, setFilters, inputLabel, renderKeys, mainKey, resetTrigger, localFilters}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/${apiEndpoint}&query=${query}&filters=${JSON.stringify(localFilters)}`, {credentials: "include"});
            const result = await response.json();
            setSearchResults(result.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (searchTerm) {
            fetchSearchResults(searchTerm);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleSelect = (event, newValue) => {
        setSelectedItem(newValue);
        if (newValue) {
            setSearchTerm(newValue[mainKey] || "");
            setFilters((prevFilters) => ({
                ...prevFilters,
                query: newValue
            }));
        } else {
            setSearchTerm("");
            setFilters((prevFilters) => ({...prevFilters, query: null}));
        }
    };

    useEffect(() => {
        if (resetTrigger !== null && resetTrigger !== undefined) {
            setSearchTerm("");
            setSelectedItem(null);
        }
    }, [resetTrigger]);

    return (
          <Box sx={{position: "relative", display: "flex", alignItems: "center"}}>
              <Autocomplete
                    options={searchResults}
                    getOptionLabel={(option) => renderKeys.map((key) => getPropertyValue(option, key)).join(" - ")}
                    loading={loading}
                    value={selectedItem}
                    sx={{
                        minWidth: 300,
                    }}
                    onChange={handleSelect}
                    onInputChange={(event, newInputValue) => {
                        setSearchTerm(newInputValue);
                    }}
                    renderInput={(params) => (
                          <TextField
                                {...params}
                                label={inputLabel}
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                          <>
                                              {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                              {params.InputProps.endAdornment}
                                          </>
                                    ),
                                }}
                          />
                    )}
              />
          </Box>
    );
};

export default SearchComponent;
