import {FormControl, FormHelperText, InputLabel, Select} from "@mui/material";
import {useState} from "react";
import MenuItem from "@mui/material/MenuItem";

export default function SelectField({
                                        select,
                                        variant = "filled",
                                        register,
                                        errors,
                                        set_value
                                    }) {
    const selectData = select.data;
    const options = selectData.options;
    const [value, setValue] = useState(selectData.defaultValue || "");

    const handleChange = (event) => {
        setValue(event.target.value);
        select.onChange && select.onChange(event, set_value)
    };
    return (
          <FormControl
                fullWidth={true}
                variant={variant}
                margin="none"
                sx={select.sx ? select.sx : {minWidth: 120, width: "100%"}}
                error={Boolean(errors[selectData.id])}
          >
              <InputLabel id={selectData.label}>{selectData.label}</InputLabel>
              <Select
                    {...register(selectData.id, select.pattern)}
                    {...selectData}
                    value={value}
                    onChange={handleChange}
              >
                  {options.map((item) => {
                      return (
                            <MenuItem value={item.value} key={item.value}>
                                {item.label}
                            </MenuItem>
                      );
                  })}
              </Select>
              <FormHelperText>{errors[selectData.id]?.message}</FormHelperText>
          </FormControl>
    );
}
