import { NavLink, useRouteLoaderData } from "react-router-dom";

export default function MainNav() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");

  return (
    <nav>
      <ul>
        <li><NavLink to="/">All Products</NavLink></li>
        <li><NavLink to="/books">Books</NavLink></li>
        <li><NavLink to="/movies">Movies</NavLink></li>
      </ul>
      
      {authData.logged_in ?
      <ul>
        <li><NavLink to="/account">Account</NavLink></li>
        <li><NavLink to="/cart">Cart</NavLink></li>
        <li><NavLink to="#" onClick={() => console.log('log out')}>Log Out</NavLink></li>
      </ul>
      :
      <ul>
        <li><NavLink to="/login">Log In</NavLink></li>
        <li><NavLink to="/register">Register</NavLink></li>
      </ul>
      }
    </nav>
  );
}
