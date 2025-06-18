import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  BadgeDollarSign,
  Blocks,
  ChartNoAxesCombined,
  HousePlug,
} from "lucide-react";
import NavLi from "../atoms/NavLi";
import SectList from "../atoms/SectList";
import TransactionItem from "../atoms/TransactionItem";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard({ setRuta }) {
  // Este componente representa la vista principal del dashboard.
  // Muestra un resumen de ingresos, egresos y balance, además de los últimos movimientos.

  const [navVisible, setNavVisible] = useState(true);
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/transaction`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (errData.message && errData.message.toLowerCase().includes("token")) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
          }
          throw new Error(errData.message || "Error al obtener transacciones");
        }
        return res.json();
      })
      .then((data) => {
        setTransactions(data);
        // Calcular ingresos y egresos
        let totalIngresos = 0;
        let totalEgresos = 0;
        data.forEach((tx) => {
          if (tx.type === "ingreso") totalIngresos += Number(tx.amount);
          if (tx.type === "egreso") totalEgresos += Number(tx.amount);
        });
        setIngresos(totalIngresos);
        setEgresos(totalEgresos);
        setError("");
      })
      .catch((err) => {
        setTransactions([]);
        setIngresos(0);
        setEgresos(0);
        setError(err.message);
      });
  }, []);

  return (
    <>
      {/* Menú lateral de navegación */}
      {navVisible && (
        <nav className="w-2/12 shadow rounded bg-gray-600 h-screen fixed left-0 top-0 flex flex-col">
          <ul className="m-3 flex-1 flex flex-col justify-between text-white text-xl gap-3 items-center">
            <div className="w-full flex flex-col items-center">
              {/* Enlaces de navegación */}
              <NavLi setHook={() => setRuta("/")}>
                <ChartNoAxesCombined /> Dashboard
              </NavLi>

              <NavLi setHook={() => setRuta("/transaction")}>
                <ArrowLeftRight /> Transactions
              </NavLi>

              <NavLi setHook={() => setRuta("/categories")}>
                <Blocks /> Categories
              </NavLi>
            </div>

            {/* Botón de logout */}
            <NavLi
              setHook={() => {
                setNavVisible(false);
                setRuta("/login");
              }}
              className="mb-8 w-full flex justify-center"
            >
              <HousePlug /> LogOut
            </NavLi>
          </ul>
        </nav>
      )}

      {/* Contenido principal del dashboard */}
      <main className="w-10/12 h-screen text-center flex flex-wrap flex-col items-center">
        {/* Resumen de ingresos, egresos y balance */}
        <section className="flex gap-4 justify-evenly w-full">
          <SectList
            precio={`$${ingresos}`}
            texto={"Gastos de ingreso"}
            color={"text-emerald-600"}
          >
            <ArrowUp />
          </SectList>

          <SectList
            precio={`-$${egresos}`}
            texto={"Gastos de egreso"}
            color={"text-red-600"}
          >
            <ArrowDown />
          </SectList>

          <SectList
            precio={`$${ingresos - egresos}`}
            texto={"Balance"}
            color={"text-sky-600"}
          >
            <BadgeDollarSign />
          </SectList>
        </section>

        {/* Lista de últimos movimientos */}
        <section className="w-10/12 ">
          <h2 className="text-slate-700 text-3xl text-start my-7">
            Ultimos movimientos
          </h2>
          {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
          <ul className=" bg-slate-700 text-white p-2 rounded mt-4 shadow">
            {transactions.map((item, index) => {
              return <TransactionItem transaction={item} key={index} />;
            })}
          </ul>
        </section>
      </main>
    </>
  );
}

export default Dashboard;
