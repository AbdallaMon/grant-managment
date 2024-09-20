import Grid from "@mui/material/Grid";
import {Controller} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import {CircularProgress, TextField, useMediaQuery} from "@mui/material";
import React, {useEffect, useState} from "react";

export default function ResidenceAndNationalitySelectors({control, setValue, errors}) {
    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);

    const isLargeScreen = useMediaQuery('(min-width:600px)');

    useEffect(() => {
        const fetchCountries = async () => {
            setLoadingCountries(true);
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries');
                const data = await response.json();
                setCountries(data.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            } finally {
                setLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    // Function to handle residence country change
    const handleResidenceCountryChange = (event, value) => {
        setValue("residenceCountry", value ? value.country : ""); // Reset value if country is deselected
    };

    // Function to handle nationality change
    const handleNationalityChange = (event, value) => {
        setValue("nationality", value ? value.country : ""); // Reset value if nationality is deselected
    };

    return (
          <Grid container spacing={2}>
              {/* Residence Country Selector */}
              <Grid item xs={12} sm={6}>
                  <Controller
                        name={"residenceCountry"}
                        control={control}
                        rules={{required: "من فضلك اختر بلد الإقامة"}}
                        render={({field}) => (
                              <Autocomplete
                                    {...field}
                                    options={countries}
                                    getOptionLabel={(option) => option.country}
                                    onChange={handleResidenceCountryChange}
                                    renderInput={(params) => (
                                          <TextField
                                                {...params}
                                                label="بلد الإقامة"
                                                error={!!errors.residenceCountry}
                                                helperText={errors.residenceCountry ? errors.residenceCountry.message : ''}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                          <>
                                                              {loadingCountries ? <CircularProgress color="inherit"
                                                                                                    size={20}/> : null}
                                                              {params.InputProps.endAdornment}
                                                          </>
                                                    ),
                                                }}
                                                sx={{bgcolor: 'background.default'}}
                                          />
                                    )}
                              />
                        )}
                  />
              </Grid>

              {/* Nationality Selector */}
              <Grid item xs={12} sm={6}>
                  <Controller
                        name={"nationality"}
                        control={control}
                        rules={{required: "من فضلك اختر جنسيتك"}}
                        render={({field}) => (
                              <Autocomplete
                                    {...field}
                                    options={countries}
                                    getOptionLabel={(option) => option.country}
                                    onChange={handleNationalityChange}
                                    renderInput={(params) => (
                                          <TextField
                                                {...params}
                                                label="الجنسية"
                                                error={!!errors.nationality}
                                                helperText={errors.nationality ? errors.nationality.message : ''}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                          <>
                                                              {loadingCountries ? <CircularProgress color="inherit"
                                                                                                    size={20}/> : null}
                                                              {params.InputProps.endAdornment}
                                                          </>
                                                    ),
                                                }}
                                                sx={{bgcolor: 'background.default'}}
                                          />
                                    )}
                              />
                        )}
                  />
              </Grid>
          </Grid>
    );
}
