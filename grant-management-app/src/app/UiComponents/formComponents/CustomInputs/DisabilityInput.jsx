"use client";
import React from "react";
import {Controller} from "react-hook-form";
import {MenuItem, Select, TextField, Typography, FormControl, InputLabel} from "@mui/material";

export default function DisabilityInput({watch, errors, control, input}) {
    const hasDisability = watch("hasDisability", input.data.defaultValue === true ? "yes" : "no");
    return (
          <>
              <FormControl fullWidth margin="none">
                  <InputLabel id="hasDisabilityLabel">هل لديك إعاقة؟</InputLabel>
                  <Controller
                        name="hasDisability"
                        control={control}
                        defaultValue={input.data.defaultValue === true ? "yes" : "no"}
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
                                      defaultValue={input.data.disability}
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
