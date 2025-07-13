import moment from "moment-jalaali";

export const toJalaliDate = (isoDate) => {
  if (!isoDate) return "";
  return moment(isoDate).format("jYYYY/jMM/jDD");
};

export const convertToISODateTime = (jalaliDate, time = "00:00") => {
  if (!jalaliDate || !time) return "";
  const gregorian = moment(jalaliDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD");
  const normalizedTime = moment(time, "HH:mm").format("HH:mm");
  return `${gregorian}T${normalizedTime}:00Z`;
};
