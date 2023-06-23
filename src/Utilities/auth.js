import cookie from "./cookie";
import i18n from "@/i18n";

export default () => {
  const auth_token = cookie.getCookie("auth-token");
  if (auth_token !== null && auth_token !== "") {
    if (window.location.pathname == `/${i18n.locale}/signin`) {
      window.location.replace(`/${i18n.locale}`);
    }
  } else {
    if (window.location.pathname != `/${i18n.locale}/signin`) {
      window.location.replace(`/${i18n.locale}/signin`);
    }
  }
};
