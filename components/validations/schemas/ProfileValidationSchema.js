import * as Yup from "yup";

const ProfileValidationSchema = Yup.object().shape({
  name: Yup.string().required("نام الزامی است"),
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره موبایل نامعتبر است")
    .required("شماره موبایل الزامی است"),
  password: Yup.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export default ProfileValidationSchema;
