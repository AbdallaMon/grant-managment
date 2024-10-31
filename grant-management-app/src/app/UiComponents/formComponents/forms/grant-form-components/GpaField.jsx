import {useEffect, useState} from "react";
import {FormControl, MenuItem, Select, TextField, FormHelperText, Grid2 as Grid} from "@mui/material";
import MuiInputField from "@/app/UiComponents/formComponents/MUIInputs/MuiInputField";

export default function GpaField({errors, register, setValue, input}) {
    const [gpaType, setGpaType] = useState(input.data.defaultValue?.gpaType);
    useEffect(() => {
        if (input.data.defaultValue) {

        }
    }, [input.data])
    const handleGpaTypeChange = (event) => {
        setGpaType(event.target.value);
        setValue("gpaValue", ""); // Reset gpaValue when gpaType changes
    };


    return (
          <Grid size={12}>
              <Grid container spacing={2}>
                  <Grid size={6}>
                      <FormControl fullWidth margin="none" error={Boolean(errors.gpaType)}>
                          <MuiInputField>نوع المعدل الاكاديمي</MuiInputField>
                          <Select
                                {...register("gpaType", {required: "هذه الخانة مطلوبة"})}
                                value={gpaType}
                                onChange={handleGpaTypeChange}
                                displayEmpty
                          >
                              <MenuItem value="" disabled>اختر نوع المعدل</MenuItem>
                              <MenuItem value="GPA_4">معدل تراكمي من 4 نقاط</MenuItem>
                              <MenuItem value="PERCENTAGE">معدل مئوي</MenuItem>
                          </Select>
                          {errors.gpaType && <FormHelperText>{errors.gpaType.message}</FormHelperText>}
                      </FormControl>
                  </Grid>

                  <Grid size={6}>
                      {gpaType && (
                            <FormControl fullWidth margin="none" error={Boolean(errors.gpaValue)}>
                                <TextField
                                      label={gpaType === "GPA_4" ? "أدخل المعدل (0 - 4)" : "أدخل المعدل (0 - 100)"}
                                      type="number"
                                      defaultValue={input.data.defaultValue?.gpaValue}
                                      inputProps={{
                                          step: "0.1", // Allow floating point numbers
                                          min: 0,
                                          max: gpaType === "GPA_4" ? 4 : 100,
                                      }}
                                      {...register("gpaValue", {
                                          required: "هذه الخانة مطلوبة",
                                          valueAsNumber: true,
                                          validate: (value) =>
                                                gpaType === "GPA_4"
                                                      ? value >= 0 && value <= 4 || "المعدل يجب أن يكون بين 0 و 4"
                                                      : value >= 0 && value <= 100 || "النسبة يجب أن تكون بين 0 و 100",
                                      })}
                                />
                                {errors.gpaValue && <FormHelperText>{errors.gpaValue.message}</FormHelperText>}
                            </FormControl>
                      )}
                  </Grid>
              </Grid>
          </Grid>
    );
}
