import React, {useEffect, useState} from "react";
import {Controller} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import {CircularProgress, TextField} from "@mui/material";

export default function CountrySelector({setValue, control, errors, input}) {
    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);


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
    const handleCountryChange = (event, value) => {
        setValue(input.data.id, value);
    };
    return (
          <Controller
                name={input.data.id}
                control={control}
                fullWidth
                defaultValue={input.data.defaultValue}
                rules={{required: "من فضلك اختر بلد "}}
                render={({field}) => (
                      <Autocomplete
                            {...field}
                            options={countries.map((c) => c.country)}
                            getOptionLabel={(option) => option}
                            onChange={handleCountryChange}
                            renderInput={(params) => (
                                  <TextField
                                        {...params}
                                        label={input.data.label}
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


    )
}