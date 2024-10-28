import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {useForm} from "react-hook-form";
import {Box, Button, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2"
import TextAreaField from "@/app/UiComponents/FormComponents/MUIInputs/TextAreaField";
import {MuiSelect} from "@/app/UiComponents/FormComponents/MUIInputs/MuiSelect";
import {MuiDatePicker} from "@/app/UiComponents/FormComponents/MUIInputs/MuiDatePicker";
import MuiSwitchField from "@/app/UiComponents/FormComponents/MUIInputs/MuiSwitchField";
import {useRef} from "react";
import SelectField from "@/app/UiComponents/FormComponents/MUIInputs/SelectField";
import InputField from "@/app/UiComponents/FormComponents/MUIInputs/InputField";
import MuiFileField from "@/app/UiComponents/formComponents/MUIInputs/MuiFileField";

const locales = ["en-gb"];

export function Form({
                         formStyle,
                         onSubmit,
                         inputs,
                         variant,
                         formTitle,
                         subTitle,
                         btnText,
                         differentButton,
                         children,
                         extraData,
                         disabled,
                         reFetch,
                         gridGap = 2,
                         removeButton = false,
                     }) {
    const {
        formState,
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        control,
    } = useForm();
    const {errors} = formState;
    const formRef = useRef();
    return (
          <Box
                sx={{
                    p: {xs: 2, md: 4},
                    my: 3
                }}
          >
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locales}>
                  <form
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                        style={{...formStyle}}
                        ref={formRef}
                  >
                      <Typography
                            variant="h4"
                            color="primary"
                            sx={{
                                mb: 3,
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                      >
                          {formTitle}
                      </Typography>
                      <Typography variant="subtitle1" sx={{
                          fontWeight: "bold",
                          mb: 2
                      }}>
                          {subTitle}
                      </Typography>
                      <Grid container spacing={gridGap}>
                          {inputs.map((input) => (
                                <Grid size={input.size || 12} key={input.data.id}>
                                    <RenderInputs input={input} watch={watch} setValue={setValue} trigger={trigger}
                                                  errors={errors} register={register} control={control}
                                                  disabled={disabled} extraData={extraData} reFetch={reFetch}
                                                  variant={variant}/>
                                </Grid>
                          ))}
                          {children}
                      </Grid>
                      {differentButton ? (
                            differentButton
                      ) : (
                            <>
                                {!removeButton && (
                                      <Button
                                            type={"submit"}
                                            variant={"contained"}
                                            sx={{
                                                mt: 2,
                                                px: 4,
                                                py: 1,
                                            }}
                                      >
                                          {btnText}
                                      </Button>
                                )}
                            </>
                      )}
                  </form>
              </LocalizationProvider>
          </Box>
    );
}

function RenderInputs({
                          input,
                          register,
                          errors,
                          watch,
                          trigger,
                          variant,
                          control,
                          disabled,
                          extraData,
                          reFetch,
                          setValue
                      }) {
    switch (input.data.type) {
        case "SelectField":
            return (
                  <SelectField
                        key={input.data.id}
                        select={input}
                        register={register}
                        errors={errors}
                        variant={variant}
                        set_value={setValue}
                  />
            );
        case "textarea":
            return (
                  <TextAreaField
                        errors={errors}
                        input={input}
                        register={register}
                        variant={variant}
                        control={control}
                        key={input.data.id}
                  />
            );
        case "select":
            return (
                  <MuiSelect
                        errors={errors}
                        register={register}
                        variant={variant}
                        select={input}
                        key={input.data.id}
                        extraData={extraData}
                        disabled={disabled}
                        reFetch={reFetch}
                        control={control}
                        triggerValue={setValue}
                  />
            );
        case "date":
            return (
                  <MuiDatePicker
                        input={input}
                        control={control}
                        key={input.data.id}
                        errors={errors}
                        watch={watch}
                        variant={variant}
                        setValue={setValue}
                  />
            );
        case "switch":
            return (
                  <MuiSwitchField
                        register={register}
                        control={control}
                        input={input}
                        key={input.data.id}
                  />
            );
        case "number":
            return (
                  <InputField
                        key={input.data.id}
                        input={input}
                        register={register}
                        errors={errors}
                        variant={variant}
                        watch={watch}
                        trigger={trigger}
                        setValue={setValue}

                  />
            );
        case "outComponent":
            const Component = input.data.component
            return (
                  <Component input={input} setValue={setValue} register={register} watch={watch} trigger={trigger}
                             errors={errors} variant={variant}
                             control={control}

                  />
            )
        case "file":
            return <MuiFileField control={control} register={register} errors={errors} input={input}
                                 setValue={setValue}
                                 variant={variant}

            />
        default:
            return (
                  <InputField
                        key={input.data.id}
                        input={input}
                        register={register}
                        errors={errors}
                        variant={variant}
                        watch={watch}
                        trigger={trigger}
                        setValue={setValue}
                  />
            );
    }

}