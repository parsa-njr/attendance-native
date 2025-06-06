import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[آ-یa-zA-Z\s]+$/, "نام فقط باید شامل حروف و فاصله باشد")
    .min(2, "نام باید حداقل ۲ حرف باشد")
    .required("نام الزامی است"),
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره موبایل نامعتبر است")
    .required("شماره موبایل الزامی است"),
  password: Yup.string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .required("رمز عبور الزامی است"),
});

export default SignUpSchema;
