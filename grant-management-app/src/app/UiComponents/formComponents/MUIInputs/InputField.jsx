"use client";
import {IconButton, InputAdornment, TextField} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {FaRegEye} from "react-icons/fa";
import {FaRegEyeSlash} from "react-icons/fa6";

export default function InputField({
                                       input,
                                       variant = "filled",
                                       register,
                                       errors,
                                       watch,
                                       trigger,
                                   }) {
    const [inputData, setInputData] = useState(input.data);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);
    const handleClickShowPassword = () => {
        setInputData({
            ...inputData,
            type: inputData.type === "password" ? "text" : "password",
        });
    };


    const [type, setType] = useState(null);
    const fieldValue = watch(inputData.id);

    useEffect(() => {
        if (type) {
            if (input.data.type === "password" || input.data.type === "email") {
                trigger(inputData.id);
            }
        }
    }, [fieldValue]);

    useEffect(() => {
        setShowPassword(inputData.type !== "text");
    }, [inputData.type]);

    return (
          <TextField
                fullWidth
                sx={input.sx ? input.sx : {width: "100%"}}
                onInput={() => setType(true)}
                variant={variant}
                error={Boolean(errors[inputData.id])}
                disabled={input.disabled}
                helperText={errors[inputData.id]?.message ? errors[inputData.id]?.message : inputData.helperText}
                margin="dense"

                ref={inputRef}
                {...inputData}
                {...register(inputData.id, input.pattern)}
                InputProps={{
                    endAdornment: input.data.type === "password" && (
                          <InputAdornment position="end">
                              <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"

                              >
                                  {showPassword ? <FaRegEyeSlash/> : <FaRegEye/>}
                              </IconButton>
                          </InputAdornment>
                    ),
                }}
          />
    );
}
