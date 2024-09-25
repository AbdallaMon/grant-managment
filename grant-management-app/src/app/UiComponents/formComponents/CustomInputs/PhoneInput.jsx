import {Controller} from "react-hook-form";
import {matchIsValidTel, MuiTelInput} from "mui-tel-input";

export default function PhoneInput({control, input}) {
    return (
          <>
              <Controller
                    name={input.data.id}
                    control={control}
                    fullWidth
                    defaultValue={input.data.defaultValue}
                    rules={{
                        validate: (value) => matchIsValidTel(value,)
                        , required: input.pattern?.required.message,
                        pattern: {
                            value: input.pattern?.pattern?.value,
                            message: input.pattern?.pattern?.message,
                        }
                    }
                    }
                    render={({field: {ref: fieldRef, value, ...fieldProps}, fieldState}) => (
                          <MuiTelInput
                                {...fieldProps}
                                fullWidth={true}
                                value={value ?? ''}
                                margin="dense"
                                defaultCountry="EG"
                                label={input.data.label}
                                sx={{bgcolor: 'background.default'}}

                                id={input.id}
                                defaultValue={input.data.defaultValue}
                                inputRef={fieldRef}
                                helperText={fieldState.invalid ? "" : ""}
                                error={fieldState.invalid}
                          />
                    )}
              />
          </>
    )
}
