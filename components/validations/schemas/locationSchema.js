import * as Yup from "yup";

const locationValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("نام مکان الزامی است")
    .test("is-valid-name", "لطفاً نام معتبر وارد کنید", (value) => {
      if (!value) return false;
      const words = value.trim().split(/\s+/);
      return words.length >= 1; // or 2 if you want full name
    }),

  range: Yup.string()
    .required("فاصله الزامی است")
    .test("is-valid-range", "فاصله باید عددی مثبت باشد", (value) => {
      if (!value) return false;
      const number = Number(value);
      return !isNaN(number) && number > 0;
    }),
  latitude: Yup.number()
    .required("لطفاً موقعیت را روی نقشه انتخاب کنید")
    .typeError("مختصات نامعتبر است"),
  longitude: Yup.number()
    .required("لطفاً موقعیت را روی نقشه انتخاب کنید")
    .typeError("مختصات نامعتبر است"),
});

export default locationValidationSchema;
