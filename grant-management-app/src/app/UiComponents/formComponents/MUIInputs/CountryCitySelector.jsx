"use client"
import React, {useState, useEffect} from 'react';
import {CircularProgress, TextField, Typography} from '@mui/material';
import {Controller} from "react-hook-form";
import Autocomplete from '@mui/material/Autocomplete';
import {useMediaQuery} from '@mui/material';
import Grid from '@mui/material/Grid2';

export default function CountryCitySelector({control, errors, input, setValue}) {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [country, setCountry] = useState('');
    const [city, setCity] = useState(input.data.country.city);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    const isLargeScreen = useMediaQuery('(min-width:600px)');

    useEffect(() => {
        const fetchCountries = async () => {
            setLoadingCountries(true);
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries');
                const data = await response.json();
                setCountries(data.data);
                if (input.data.country.defaultValue) {
                    setCountry(input.data.country.defaultValue);
                    setValue("country", input.data.country.defaultValue)
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            } finally {
                setLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (!country) return;
            setLoadingCities(true);
            try {
                setCities(country.cities);
            } catch (error) {
                console.error('Error fetching cities:', error);
            } finally {
                setLoadingCities(false);
            }
        };
        fetchCities();
    }, [country]);

    const handleCountryChange = (event, value) => {
        setCountry(value);
        setValue("country", value.country)
        setCity('');
    };
    const handleCityChange = (event, value) => {
        setCity(value);
        setValue("city", value)

    };

    return (
          <Grid size={12}>
              <Grid container spacing={2}>
                  <Grid size={6}>
                      <Controller
                            name={"country"}
                            control={control}
                            rules={{required: "من فضلك اختر دولتك"}}
                            render={({field}) => (
                                  <Autocomplete
                                        {...field}
                                        options={countries}
                                        getOptionLabel={(option) => option.country}
                                        onChange={handleCountryChange}
                                        renderInput={(params) => (
                                              <TextField
                                                    {...params}
                                                    label="الدولة"
                                                    error={!!errors.country}
                                                    sx={{bgcolor: 'background.default'}}
                                                    helperText={errors.country ? errors.country.message : ''}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                              <>
                                                                  {loadingCountries ?
                                                                        <CircularProgress color="inherit"
                                                                                          size={20}/> : null}
                                                                  {params.InputProps.endAdornment}
                                                              </>
                                                        ),
                                                    }}
                                              />
                                        )}
                                  />
                            )}
                      />
                  </Grid>
                  <Grid size={6}>
                      <Controller
                            name={"city"}
                            control={control}
                            rules={{required: "من فضلك اختر مدينتك"}}
                            render={({field}) => (
                                  <Autocomplete
                                        {...field}
                                        options={cities}
                                        getOptionLabel={(option) => option} // Ensure this matches your city data structure
                                        onChange={handleCityChange}
                                        sx={{
                                            width: "100%"
                                        }}
                                        renderInput={(params) => (
                                              <TextField
                                                    {...params}
                                                    label="المدينة"
                                                    sx={{bgcolor: 'background.default'}}
                                                    error={!!errors.city}
                                                    helperText={errors.city ? errors.city.message : ''}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                              <>
                                                                  {loadingCities ?
                                                                        <CircularProgress color="inherit"
                                                                                          size={20}/> : null}
                                                                  {params.InputProps.endAdornment}
                                                              </>
                                                        ),
                                                    }}
                                                    disabled={!country}
                                              />
                                        )}
                                  />
                            )}
                      />
                  </Grid>
              </Grid>
          </Grid>
    );
}
