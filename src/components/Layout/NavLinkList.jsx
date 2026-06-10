import { NavLink } from "react-router-dom";

export default function NavLinkList({ links, getLinkClassName, onClick }) {
  return links.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.to === "/"}
      className={getLinkClassName}
      onClick={onClick}
    >
      {link.label}
    </NavLink>
  ));
}
