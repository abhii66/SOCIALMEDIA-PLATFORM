import { NavLink } from "react-router";
import { primaryBtn, pageTitleClass, bodyText } from "../styles/common.js";

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center gap-6">
      <h1 className={pageTitleClass}>403</h1>
      <p className={bodyText}>You don't have permission to access this page.</p>
      <NavLink to="/" className={primaryBtn}>
        Go Home
      </NavLink>
    </div>
  );
}

export default Unauthorized;
