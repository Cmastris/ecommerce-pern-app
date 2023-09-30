import { NavLink, useNavigate, useRouteLoaderData } from "react-router-dom";

export default function MainNav() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const navigate = useNavigate();

  async function handleClickLogOut () {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/logout`,
        {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        }
      );
      if (!res.ok) {
        throw new Error('Unexpected status code.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      navigate(0);  // Refresh page to clear auth state and re-render
    }
  }

  return (
    <nav>
      <ul>
        <li><NavLink to="/">All Products</NavLink></li>
        <li><NavLink to="/category/books">Books</NavLink></li>
        <li><NavLink to="/category/movies">Movies</NavLink></li>
      </ul>
      
      {authData?.logged_in ?
      <ul>
        <li><NavLink to="/account">Account</NavLink></li>
        <li><NavLink to="/cart">Cart</NavLink></li>
        <li><NavLink to="#" onClick={handleClickLogOut}>Log Out</NavLink></li>
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
