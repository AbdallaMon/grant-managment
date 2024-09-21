"use client";
import React from "react";
import {Controller, useForm} from "react-hook-form";
import {Box, MenuItem, Select, TextField, Typography, FormControl, InputLabel} from "@mui/material";

export default function DisabilityInput({watch, errors, control,}) {

    // Watch the hasDisability input to conditionally render the other input
    const hasDisability = watch("hasDisability", "no");


    return (
          <>

              <FormControl fullWidth margin="none">
                  <InputLabel id="hasDisabilityLabel">هل لديك إعاقة؟</InputLabel>
                  <Controller
                        name="hasDisability"
                        control={control}
                        defaultValue="no"
                        render={({field}) => (
                              <Select
                                    {...field}
                                    labelId="hasDisabilityLabel"
                                    label="هل لديك إعاقة؟"
                                    error={!!errors.hasDisability}
                              >
                                  <MenuItem value="no">لا</MenuItem>
                                  <MenuItem value="yes">نعم</MenuItem>
                              </Select>
                        )}
                  />
                  {errors.hasDisability && <Typography color="error">{errors.hasDisability.message}</Typography>}
              </FormControl>

              {hasDisability === "yes" && (
                    <Controller
                          name="disability"
                          control={control}
                          rules={{required: "يرجى وصف الإعاقة"}}
                          render={({field}) => (
                                <TextField
                                      {...field}
                                      label="وصف الإعاقة"
                                      fullWidth
                                      margin="normal"
                                      error={!!errors.disability}
                                      helperText={errors.disability ? errors.disability.message : ""}
                                />
                          )}
                    />
              )}

          </>
    );
}
