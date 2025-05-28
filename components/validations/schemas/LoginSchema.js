import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره موبایل نامعتبر است")
    .required("شماره موبایل الزامی است"),
  password: Yup.string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .required("رمز عبور الزامی است"),
});

export default LoginSchema;
