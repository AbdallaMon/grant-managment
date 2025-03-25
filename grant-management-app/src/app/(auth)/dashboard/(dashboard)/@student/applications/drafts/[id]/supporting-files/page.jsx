"use client";
import { GrantDraftFrom } from "@/app/UiComponents/formComponents/forms/GrantDraftFrom";
import { handleRequestSubmit } from "@/app/helpers/functions/handleSubmit";
import { useToastContext } from "@/app/providers/ToastLoadingProvider";

const inputs = [
  {
    data: {
      id: "personalId",
      label: "صورة جواز السفر/الهوية الشخصية (من الجهتين)",
      type: "file",
      required: true,
    },
    size: {
      xs: 12,
      md: 6,
    },
    pattern: {
      required: { value: true, message: "هذه الخانة  مطلوبة" },
    },
  },
  {
    data: {
      id: "studentDoc",
      label: "وثيقة الطالب",
      type: "file",
      required: true,
    },
    size: {
      xs: 12,
      md: 6,
    },
    pattern: {
      required: { value: true, message: "هذه الخانة  مطلوبة" },
    },
  },
  {
    data: {
      id: "medicalReport",
      label: "تقرير طبي في حال وجود إعاقة",
      type: "file",
      required: true,
    },
    size: {
      xs: 12,
      md: 6,
    },
  },
  {
    acceptOnly: "image",
    data: {
      id: "personalPhoto",
      label: "صورة شخصية",
      type: "file",
      required: true,
    },
    size: {
      xs: 12,
      md: 6,
    },
    pattern: {
      required: { value: true, message: "هذه الخانة  مطلوبة" },
    },
  },
  {
    data: {
      id: "proofOfAddress",
      label: "وثيقة تظهر العنوان (فاتورة، عقد إيجار، ورقة إثبات سكن)",
      type: "file",
      required: true,
    },
    size: {
      xs: 12,
      md: 6,
    },
    pattern: {
      required: { value: true, message: "هذه الخانة  مطلوبة" },
      min: {
        value: 0,
        message: "المبلغ الممكن توفيره يجب أن يكون رقمًا إيجابيًا",
      },
    },
  },
];
export const SupportingFilesLabels = {
  personalId: "صورة جواز السفر/الهوية الشخصية (من الجهتين)",
  studentDoc: "وثيقة الطالب",
  medicalReport: "تقرير طبي في حال وجود إعاقة",
  personalPhoto: "صورة شخصية",
  proofOfAddress: "وثيقة تظهر العنوان (فاتورة، عقد إيجار، ورقة إثبات سكن)",
};
export default function SupportingFiles({ params: { id } }) {
  const { setLoading } = useToastContext();

  async function handleBeforeUpdate(data, PUT) {
    let count = 0;

    // Iterate over each file entry one by one
    for (const [key, value] of Object.entries(data)) {
      if (!value[0] || value[0] === "undefined") {
        delete data[key];
        continue;
      }

      const formData = new FormData();
      formData.append(key, value[0]);

      // Wait for the request to finish before moving to the next file
      const request = await handleRequestSubmit(
        formData,
        setLoading,
        "upload",
        true,
        "جاري رفع " + SupportingFilesLabels[key]
      );

      data[key] = request.data[key]; // Store uploaded file URL
    }
    console.log(data, "data returned");
    return data;
  }

  return (
    <GrantDraftFrom
      inputs={inputs}
      appId={id}
      current={"supportingFiles"}
      next={{ url: "commitment", text: "الذهاب الي صفحة التعهد " }}
      handleBeforeUpdate={handleBeforeUpdate}
      formProps={{
        formTitle: "الملفات الداعمة",
        btnText: "حفظ",
        variant: "outlined",
      }}
    />
  );
}
