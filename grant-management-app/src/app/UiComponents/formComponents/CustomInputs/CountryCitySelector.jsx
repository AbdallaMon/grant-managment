"use client"
import React, {useState, useEffect} from 'react';
import {CircularProgress, TextField, Grid2 as Grid} from '@mui/material';
import {Controller} from "react-hook-form";
import Autocomplete from '@mui/material/Autocomplete';

export default function CountryCitySelector({control, errors, input, setValue}) {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [country, setCountry] = useState('');
    const [_, setCity] = useState(input.data.country.city);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);


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
            const raw = JSON.stringify({
                country: country
            });
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the correct content type
                },
                body: raw,
                redirect: 'follow'
            };
            const req = await fetch("https://countriesnow.space/api/v0.1/countries/cities", requestOptions);
            const result = await req.json();
            try {
                setCities(result.data);
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
        setValue("country", value)
        setValue("city", "")
    };
    const handleCityChange = (event, value) => {
        setCity(value);
        setValue("city", value)

    };

    return (
          <Grid container spacing={2}>
              <Grid item size={{xs: 12, md: 6}}>
                  <Controller
                        name={"country"}
                        control={control}
                        rules={{required: "من فضلك اختر دولتك"}}
                        render={({field}) => (
                              <Autocomplete
                                    {...field}
                                    options={countries.map((option) => option.country)}
                                    getOptionLabel={(option) => option}
                                    onChange={handleCountryChange}
                                    renderInput={(params) => (
                                          <TextField
                                                {...params}
                                                label="الدولة"
                                                variant={"outlined"}
                                                error={!!errors.country}
                                                sx={{bgcolor: "background.default"}}
                                                helperText={errors.country ? errors.country.message : ""}
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
                                          />
                                    )}
                              />
                        )}
                  />
              </Grid>

              <Grid item size={{xs: 12, md: 6}}>
                  <Controller
                        name={"city"}
                        control={control}
                        rules={{required: "من فضلك اختر مدينتك"}}
                        render={({field}) => (
                              <Autocomplete
                                    {...field}
                                    options={cities}
                                    variant={"filled"}
                                    getOptionLabel={(option) => option}
                                    onChange={handleCityChange}
                                    sx={{width: "100%"}}
                                    renderInput={(params) => (
                                          <TextField
                                                {...params}
                                                label="المدينة"
                                                sx={{bgcolor: "background.default"}}
                                                error={!!errors.city}
                                                variant={"outlined"}
                                                helperText={errors.city ? errors.city.message : ""}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                          <>
                                                              {loadingCities ? <CircularProgress color="inherit"
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
    );
}
