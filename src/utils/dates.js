import moment from "moment";
import "moment/locale/es";

export const date = (date = new Date()) => {
  return moment(date).locale("es");
};

export const unix = date => {
  return moment.unix(date).locale("es");
};

export const compare = (date, duration = "minutes") => {
  return moment().diff(date, duration);
};
