import * as Yup from "yup";

const baseFields = {
  name: Yup.string().required("نام الزامی است"),
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره موبایل نامعتبر است")
    .required("شماره موبایل الزامی است"),
  location: Yup.string().required("انتخاب موقعیت الزامی است"),
  shift: Yup.string().required("انتخاب شیفت الزامی است"),
};

export const AddUserSchema = Yup.object().shape({
  ...baseFields,
  password: Yup.string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .required("رمز عبور الزامی است"),
});

export const EditUserSchema = Yup.object().shape({
  ...baseFields,
  password: Yup.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});
