import * as Yup from "yup";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const RequestValidationSchema = Yup.object().shape({
  requestType: Yup.string().required("نوع درخواست الزامی است"),
  startDate: Yup.string().required("تاریخ شروع و ساعت شروع الزامی است"),
  endDate: Yup.string()
    .required("تاریخ پایان و ساعت پایان الزامی است")

  ,

  startTime: Yup.string().required("تاریخ شروع و ساعت شروع الزامی است"),
  endTime: Yup.string().required("تاریخ پایان و ساعت پایان الزامی است"),

  note: Yup.string()
    .max(500, "یادداشت نباید بیش از ۵۰۰ کاراکتر باشد")
    .nullable(),
});

export default RequestValidationSchema;
