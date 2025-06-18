import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Categories = () => {
  // Este componente representa la vista de categorías.
  // Permite agregar nuevas categorías y muestra una lista de categorías existentes.
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setError("");
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para agregar categorías.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al agregar categoría");
      setCategories((prev) => [...prev, data]);
      setSuccess("Categoría agregada correctamente");
      setNewCategory("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="flex flex-col items-center w-9/10 justify-between">
      {/* Formulario para agregar una nueva categoría */}
      <form
        className="w-fit p-3 flex flex-col items-end "
        onSubmit={handleSubmit}
      >
        <h1 className="w-full text-center text-3xl text-slate-500 mb-5">
          Categorias
        </h1>

        <div className="flex flex-col gap-2 mb-4">
          {/* Campo para ingresar el nombre de la categoría */}
          <label className=" text-slate-900 font-bold mb-2">
            Nombre de la categoría
          </label>
          <input
            className="border border-slate-500 focus:outline-none w-2x"
            type="text"
            placeholder="Gastos de casa"
            required
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-600 font-bold mb-2">{error}</p>
        )}
        {success && (
          <p className="text-green-600 font-bold mb-2">{success}</p>
        )}

        {/* Botón para enviar el formulario y agregar la categoría */}
        <button className=" w-fit bg-slate-600 text-white px-3 py-1 rounded m-2 cursor-pointer hover:bg-gray-400 ">
          Agregar
        </button>
        <p className="w-full text-center text-sm text-gray-600 font-bold">
          Ingresa una categoria nueva
        </p>
      </form>

      {/* Lista de categorías existentes */}
      <ul className=" shadow bg-gray-50 w-8/10 p-2">
        {/* Cada elemento de la lista representa una categoría */}
        {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
        {categories.map((cat, idx) => (
          <li
            key={cat._id || idx}
            className="w-full px-2 border-b border-b-slate-900 text-xl"
          >
            {cat.name || cat.nombre || "Sin nombre"}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Categories;
