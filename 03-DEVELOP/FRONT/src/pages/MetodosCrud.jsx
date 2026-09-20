import { useEffect, useState } from "react";
import metodosApi from "../api/metodosApi";

/**
 * CRUD para gestionar los métodos de pago disponibles en el sistema.
 * Permite listar, crear, editar, eliminar y buscar registros por ID.
 */
export default function MetodosCrud() {
  // Guarda la lista de métodos consultados al backend.
  const [items, setItems] = useState([]);
  // Nombre del método que se está creando o editando.
  const [nombre, setNombreTipo] = useState("");
  // ID ingresado por el usuario para la búsqueda rápida.
  const [searchId, setSearchId] = useState("");
  // Resultado obtenido por búsqueda por ID.
  const [searchResult, setSearchResult] = useState(null);
  // ID del registro que se está editando. Si es null, el formulario está en modo crear.
  const [editingId, setEditingId] = useState(null);
  // Estado de carga general mientras se ejecuta la petición a la API.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = editingId !== null;

  // El return genera la pantalla CRUD con el formulario, búsqueda, tabla y
  // acciones de editar o eliminar, usando los estados y funciones de arriba.
  /**
   * Obtiene la lista completa de métodos desde el backend.
   */
  const loadList = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await metodosApi.list();
      setItems(res.data);
    } catch (err) {
      setError(err?.response?.statusText || err.message || "Error listando");
    } finally {
      setLoading(false);
    }
  };

  // Al cargar la página, se consulta automáticamente la lista de métodos.
  useEffect(() => {
    loadList();
  }, []);

  /**
   * Limpia el formulario y vuelve al estado inicial de creación.
   */
  const resetForm = () => {
    setNombreTipo("");
    setEditingId(null);
  };

  /**
   * Crea o actualiza un método según el modo actual del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setError("");
    try {
      if (isEditing) {
        await metodosApi.update(editingId, { nombre: nombre });
      } else {
        await metodosApi.create({ nombre: nombre });
      }
      resetForm();
      loadList();
    } catch (err) {
      setError(err?.response?.statusText || err.message || "Error guardando");
    }
  };

  /**
   * Carga un registro en el formulario para editarlo.
   */
  const handleEdit = (item) => {
    setEditingId(item.id);
    setNombreTipo(item.nombre);
  };

  /**
   * Elimina el método seleccionado luego de confirmar la acción.
   */
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este método?")) return;
    try {
      await metodosApi.remove(id);
      loadList();
    } catch (err) {
      setError(err?.response?.statusText || err.message || "Error eliminando");
    }
  };

  /**
   * Busca un método específico por su ID y muestra el resultado.
   */
  const handleSearch = async () => {
    if (!searchId) return;
    setError("");
    setSearchResult(null);
    try {
      const res = await metodosApi.getById(searchId);
      setSearchResult(res.data);
    } catch (err) {
      setError("No se encontró el registro");
    }
  };

  return (
    <div className="crud-page">
      <h1 className="crud-title"> Métodos de Pago</h1>

      {/* Formulario para crear un método o guardar cambios del registro editado. */}
      <div className="card">
        <div className="card-title">
          {isEditing ? `Editar método #${editingId}` : "Crear nuevo"}
        </div>
        <form className="form-row" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre del método</label>
            <input
              className="input"
              placeholder="Pago en efectivo, Tarjeta de crédito..."
              value={nombre}
              onChange={(e) => setNombreTipo(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            {isEditing ? "Guardar cambios" : "Crear"}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </form>
        {error && <div className="status-msg status-error">{error}</div>}
      </div>

      {/* Buscador que consulta un método específico usando su identificador. */}
      <div className="card">
        <div className="card-title">Buscar por ID</div>
        <div className="form-row">
          <div className="field">
            <input
              className="input"
              placeholder="Ej: 1"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button className="btn btn-outline" onClick={handleSearch}>
            Buscar
          </button>
        </div>
        {searchResult && (
          <div className="status-msg">
            Encontrado: <span className="badge">#{searchResult.id}</span>{" "}
            {searchResult.nombre}
          </div>
        )}
      </div>

      {/* Tabla con todos los métodos y sus acciones disponibles. */}
      <div className="card">
        <div className="card-title" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Listado</span>
          {/* Vuelve a solicitar los datos más recientes al backend. */}
          <button className="btn btn-outline" onClick={loadList}>
            Refrescar
          </button>
        </div>
        {loading && <div className="status-msg status-loading">Cargando...</div>}
        <div className="table-wrap">
          {/* Recorre la lista y crea una fila para cada método de pago. */}
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del método</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>
                    {/* Acciones disponibles para el registro actual. */}
                    <div className="actions">
                      <button className="btn btn-outline" onClick={() => handleEdit(item)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
