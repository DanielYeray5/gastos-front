import { useState } from "react";
import { CustomRoute } from "./hooks/CustomRoute";
import NavLi from "./atoms/NavLi";
import {
  ChartNoAxesCombined,
  ArrowLeftRight,
  Blocks,
  HousePlug,
} from "lucide-react";

const App = () => {
  const [ruta, setRuta] = useState("/");
  const { asignarComponente } = CustomRoute(ruta, setRuta);

  // Mostrar Nav en todas las rutas excepto login Y si hay token
  const isLogged = !!localStorage.getItem("token");
  const showNav = ruta !== "/login" && isLogged;
  return (
    <>
      {showNav && (
        <nav className="w-2/12 shadow rounded bg-gray-600 h-screen fixed left-0 top-0 flex flex-col">
          <ul className="m-3 flex-1 flex flex-col justify-between text-white text-xl gap-3 items-center">
            <div className="w-full flex flex-col items-center">
              <NavLi setHook={() => setRuta("/")}> <ChartNoAxesCombined /> Dashboard </NavLi>
              <NavLi setHook={() => setRuta("/transaction")}> <ArrowLeftRight /> Transactions </NavLi>
              <NavLi setHook={() => setRuta("/categories")}> <Blocks /> Categories </NavLi>
            </div>
            <NavLi setHook={() => {
              localStorage.removeItem("token");
              setRuta("/login");
            }} className="mb-8 w-full flex justify-center"> <HousePlug /> LogOut </NavLi>
          </ul>
        </nav>
      )}
      {asignarComponente()}
    </>
  );
}

export default App