import {Controller} from "react-hook-form";
import {TextField} from "@mui/material";
import {useState} from "react";
import Image from "next/image";

export default function MuiFileField({
                                         control,
                                         input,
                                         register,
                                         errors,
                                         variant = "filled",
                                     }) {
    const {id, label} = input.data;
    const [preview, setPreview] = useState(input.value || input.data.defaultValue || null);
    const [fileName, setFileName] = useState(""); // Track file name

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name); // Store file name
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // Set preview to base64 for images
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    // Check if the file is a PDF
    const isPdf = preview && preview.includes("pdf");

    // Render the appropriate preview (PDF link or image preview)
    const renderPreview = () => {
        if (!preview) return null;

        // If it's a PDF
        if (isPdf) {
            return (
                  <a href={preview} target="_blank" rel="noopener noreferrer">
                      {fileName || "عرض الملف"} {/* Show file name if uploaded, else default label */}
                  </a>
            );
        }

        return (
              <Image
                    src={preview}
                    alt="Preview"
                    width={60}
                    height={60}
                    style={{objectFit: "cover", maxHeight: "60px"}}
              />
        );
    };

    return (
          <div className="flex gap-5">
              <Controller
                    name={input.data.id}
                    control={control}

                    render={({field: {onChange, value = input.value}}) => (
                          <TextField
                                label={label}
                                id={id}
                                sx={(theme) => ({
                                    backgroundColor: variant === "outlined" ? theme.palette.background.default : 'inherit',
                                    ...(input.sx && input.sx),
                                })}
                                type="file"
                                InputLabelProps={{shrink: true}}
                                {...register(id, input.pattern)}
                                error={Boolean(errors[id])}
                                helperText={errors[id]?.message}
                                variant={variant}
                                fullWidth
                                value={value}
                                accept={input.data.accept}
                                onChange={(e) => {
                                    onChange(e); // default handler
                                    handleFileChange(e); // our handler
                                }}
                          />
                    )}
              />
              {renderPreview()}
          </div>
    );
}
