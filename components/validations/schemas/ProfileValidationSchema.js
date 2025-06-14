import * as Yup from "yup";

const ProfileValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("نام الزامی است")
    .test("is-full-name", "لطفاً نام را وارد کنید", (value) => {
      if (!value) return false;
      const words = value.trim().split(/\s+/);
      return words.length >= 2;
    }),
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره موبایل نامعتبر است")
    .required("شماره موبایل الزامی است"),
  password: Yup.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export default ProfileValidationSchema;
