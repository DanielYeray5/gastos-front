import { useState } from "react";
import imagenLogin from "../img/Login.svg";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  // Este componente representa la vista de inicio de sesión.
  // Permite a los usuarios iniciar sesión o registrarse.

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (isRegister && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const endpoint = isRegister ? "/user/register" : "/user/login";
      const body = { email, password };
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en la autenticación");
      if (data.token) {
        localStorage.setItem("token", data.token);
        setError("");
        window.location.reload(); // Fuerza recarga para que App.jsx detecte el login y muestre las demás páginas
      } else if (isRegister) {
        alert("Registro exitoso");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-200">
      {/* Formulario de inicio de sesión o registro */}
      <form
        className="w-9/12 h-8/10 bg-white shadow-lg rounded flex "
        onSubmit={handleSubmit}
      >
        {/* Imagen decorativa */}
        <img src={imagenLogin} className="w-4/10 h-full" />

        {/* Contenido del formulario */}
        <div className=" flex justify-start items-start flex-col w-4/6 p-2 ml-auto">
          {/* Enlace para alternar entre registro e inicio de sesión */}
          <p className="w-full text-end text-base">
            ¿Aún no tienes una cuenta?
            <a
              onClick={() => setIsRegister(!isRegister)}
              className="ms-1 text-blue-600 text-base mr-5 cursor-pointer"
            >
              ¡Crea una cuenta aquí!
            </a>
          </p>

          {/* Títulos dinámicos según el estado del formulario */}
          <h1 className="text-slate-700 text-2xl w-full mt-12 font-bold">
            {isRegister ? "¿Aún no tienes una cuenta?" : "¿Ya tienes una cuenta?"}
          </h1>
          <h2 className="text-slate-800 font-bold text-xl w-full mt-3">
            {isRegister ? "Registrate" : "Inicia sesion aquí"}
          </h2>

          {/* Campos del formulario */}
          <div className="flex flex-col w-full items-start gap-2 my-2">
            <label className="mb-1 text-base">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-slate-8000 rounded shadow focus:outline-none text-center text-base p-2"
            />
          </div>

          <div className="flex flex-col w-full items-start gap-2 my-2 mb-4">
            <label className="mb-1 text-base">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-slate-8000 rounded shadow focus:outline-none text-center text-base p-2"
            />
          </div>

          {/* Campo de confirmar contraseña solo si isRegister es true */}
          {isRegister && (
            <div className="flex flex-col w-full items-start gap-2 my-2 mb-4">
              <label className="mb-1 text-base">Confirmar Contraseña</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-slate-8000 rounded shadow focus:outline-none text-center text-base p-2"
              />
            </div>
          )}

          {error && <p className="text-red-600 font-bold mb-2">{error}</p>}

          {/* Botón para enviar el formulario */}
          <button className="bg-blue-500 text-white p-2 px-5 rounded text-lg font-semibold hover:shadow hover:bg-blue-700 cursor-pointer">
            {isRegister ? "Registrate" : "Ingresar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
