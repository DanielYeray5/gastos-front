import { useEffect, useState } from "react";
import TransactionItem from "../atoms/TransactionItem";
import { Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Transaction = () => {
  // Este componente representa la vista de transacciones.
  // Permite registrar nuevas transacciones y muestra una lista de transacciones existentes.

  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("ingreso");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setError("");
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/category`, {
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
          throw new Error(errData.message || "Error al obtener categorías");
        }
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para agregar transacciones.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, amount, type, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al agregar transacción");
      setTransactions((prev) => [...prev, data]);
      setSuccess("Transacción agregada correctamente");
      setDescription("");
      setAmount("");
      setType("ingreso");
      setCategory("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="flex flex-col items-center w-9/10 min-h-screen">
      {/* Formulario para registrar una nueva transacción */}
      <form className="w-full max-w-2xl p-3 flex flex-col items-center " onSubmit={handleSubmit}>
        <h1 className="w-full text-center text-3xl text-slate-500 mb-5">Movimientos</h1>

        <div className="flex flex-col gap-2 mb-4 w-full">
          {/* Campo para ingresar la descripción de la transacción */}
          <label className="text-slate-900 font-bold mb-2">Descripcion </label>
          <textarea
            rows={2}
            className="w-full border border-slate-500 focus:outline-none"
            value={description}
            onChange={e => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col gap-2 mb-4 w-full">
          {/* Campo para ingresar el monto de la transacción */}
          <label className=" text-slate-900 font-bold mb-2">Monto a registrar</label>
          <input
            className="border border-slate-500 focus:outline-none w-full"
            type="number"
            placeholder="3000"
            required
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mb-4 w-full">
          {/* Campo para seleccionar el tipo de movimiento */}
          <label className=" text-slate-900 font-bold mb-2">Tipo de movimiento</label>
          <select
            className="border border-slate-500 focus:outline-none w-full max-w-xs"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mb-4 w-full">
          {/* Campo para seleccionar la categoría de la transacción */}
          <label className=" text-slate-900 font-bold mb-2">Categoria</label>
          <select
            className="border border-slate-500 focus:outline-none w-full max-w-xs"
            required
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-600 font-bold mb-2">{error}</p>}
        {success && <p className="text-green-600 font-bold mb-2">{success}</p>}

        {/* Botón para enviar el formulario */}
        <button className="w-fit bg-slate-600 text-white px-3 py-1 rounded m-2 cursor-pointer hover:bg-gray-400 ">
          Agregar
        </button>
        <p className="w-full text-center text-sm text-gray-600 font-bold">Ingresa una categoria nueva</p>
      </form>

      {/* Lista de transacciones existentes */}
      <div className="w-full max-w-2xl mt-6">
        <form className="w-full flex justify-end mb-2">
          {/* Campo para buscar transacciones */}
          <input
            type="text"
            placeholder="Buscar..."
            className="border-b border-b-slate-500 text-center w-1/3"
          />
        </form>
        {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
        <ul className="mt-3 bg-slate-700 shadow p-2 rounded">
          {transactions.map((movimineto) => (
            <li key={movimineto._id} className="flex justify-between items-center">
              <TransactionItem transaction={movimineto} />
              <button
                className="ml-4 text-red-500 hover:text-red-700"
                title="Eliminar"
                onClick={async () => {
                  if (!window.confirm("¿Seguro que deseas eliminar esta transacción?")) return;
                  const token = localStorage.getItem("token");
                  try {
                    const res = await fetch(`${API_URL}/transaction/${movimineto._id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.status === 204) {
                      setTransactions(transactions.filter(t => t._id !== movimineto._id));
                      setSuccess("Transacción eliminada correctamente");
                    } else {
                      const data = await res.json().catch(() => ({}));
                      setError(data.message || "Error al eliminar transacción");
                    }
                  } catch {
                    setError("Error de red al eliminar transacción");
                  }
                }}
              >
                <Trash2 />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Transaction;
