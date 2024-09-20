export const signupInputs = [
  {
    data: {
      id: "firstName",
      type: "text",
      label: "الاسم الأول",
      name: "firstName",
    },
    sx: {
      width: "100%",
      "@media (min-width:600px)": {
        width: "48%",
      },
      ml: "4%",
      mt:"10px"
    },
    pattern: {
      required: {
        value: true,
        message: "يجب إدخال الاسم الأول",
      },
    },
  },
  {
    data: {
      id: "lastName",
      type: "text",
      label: "الاسم الأخير",
      name: "lastName",
    },
    sx: {
      width: "100%",
      "@media (min-width:600px)": {
        width: "48%",
      },
      mt:"10px"

    },
    pattern: {
      required: {
        value: true,
        message: "يجب إدخال الاسم الأخير",
      },
    },
  },
  {
    data: {
      id: "email",
      type: "email",
      label: "الايميل",
      name: "email",
    },
    sx: {
    mt:"10px"
    },
    pattern: {
      required: {
        value: true,
        message: "الرجاء إدخال البريد الإلكتروني",
      },
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: "الرجاء إدخال بريد إلكتروني صحيح",
      },
    },
  },
  {
    data: {
      id: "password",
      type: "password",
      label: "كلمة المرور",
      name: "password",
    },
    sx:{
      mt:"10px"

    },
    pattern: {
      required: {
        value: true,
        message: " كلمة المرور مطلوبة",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        message:
          "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم وأن تكون 8 أحرف على الأقل",
      },
    },
  },
  {
    data: {
      id: "confirmPassword",
      type: "password",
      label: "تأكيد كلمة المرور",
      name: "confirmPassword",
    },
    sx:{      my:"10px"
    },
    pattern: {
      required: {
        value: true,
        message: "الرجاء تأكيد كلمة المرور",
      },
      validate: {
        matchesPreviousPassword: (value) => {
          const password = document.getElementById("password").value;
          return password === value || "كلمة المرور غير متطابقة";
        },
      },
    },
  },
];
