import Dashboard from "../routes/Dashboard";
import Login from "../routes/Login";
import Transaction from "../routes/Transaction";
import Categories from "../routes/Categories";
import NotFound from "../routes/NotFound";

export const CustomRoute = (ruta, setRuta) => {
  const isLogged = !!localStorage.getItem("token");
  const asignarComponente = () => {
    if (!isLogged && ruta !== "/login") {
      return <Login />;
    }
    if (ruta === "/") {
      return <Dashboard setRuta={setRuta} />;
    } else if (ruta === "/login") {
      return <Login />;
    } else if (ruta === "/transaction") {
      return <Transaction />;
    } else if (ruta === "/categories") {
      return <Categories />;
    } else {
      return <NotFound />;
    }
  };
  return { asignarComponente };
};
