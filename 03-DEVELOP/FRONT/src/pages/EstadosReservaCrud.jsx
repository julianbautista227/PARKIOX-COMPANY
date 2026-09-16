import { useEffect, useState } from "react";
import estadosReservaApi from "../api/estadosReservaApi";


export default function EstadosReservaCrud() {
  // Guarda la lista de estados recibida desde el backend.
  const [items, setItems] = useState([]);
  // Guarda el texto escrito en el formulario de crear o editar.
  const [nombreEstado, setNombreEstado] = useState("");
  // Guarda el ID que el usuario quiere buscar.
  const [searchId, setSearchId] = useState("");
  // Guarda el resultado de la busqueda por ID.
  const [searchResult, setSearchResult] = useState(null);
  // Si tiene un ID, el formulario esta editando; si es null, esta creando.
  const [editingId, setEditingId] = useState(null);
  // Indica si la lista esta esperando una respuesta del backend.
  const [loading, setLoading] = useState(false);
  // Guarda el mensaje que se muestra cuando ocurre un error.
  const [error, setError] = useState("");

  // Convierte el ID de edicion en un valor booleano facil de consultar.
  const isEditing = editingId !== null;

  const loadList = async () => {
    setError("");
    setLoading(true);
    try {
      // Solicita todos los estados al endpoint GET /estados-reserva.
      const res = await estadosReservaApi.list();
      // Guarda los datos recibidos para mostrarlos en la tabla.
      setItems(res.data);
    } catch (err) {
      // Captura y muestra un mensaje si la consulta falla.
      setError(err?.response?.statusText || err.message || "Error listando");
    } finally {
      // Termina la carga tanto si la peticion funciono como si fallo.
      setLoading(false);
    }
  };

  // Carga la lista automaticamente cuando la pantalla aparece por primera vez.
  useEffect(() => {
    loadList();
  }, []);

  const resetForm = () => {
    // Limpia el formulario y vuelve al modo crear.
    setNombreEstado("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    // Evita que el navegador recargue la pagina al enviar el formulario.
    e.preventDefault();
    // No envia datos vacios al backend.
    if (!nombreEstado.trim()) return;
    setError("");
    try {
      if (isEditing) {
        // En modo edicion, actualiza el registro con PUT.
        await estadosReservaApi.update(editingId, { nombre_estado: nombreEstado });
      } else {
        // En modo creacion, agrega un registro nuevo con POST.
        await estadosReservaApi.create({ nombre_estado: nombreEstado });
      }
      // Limpia el formulario y actualiza la tabla con los datos mas recientes.
      resetForm();
      loadList();
    } catch (err) {
      // Muestra el error si crear o actualizar no fue posible.
      setError(err?.response?.statusText || err.message || "Error guardando");
    }
  };

  const handleEdit = (item) => {
    // Copia los datos del registro seleccionado al formulario.
    setEditingId(item.id);
    setNombreEstado(item.nombre_estado);
  };

  const handleDelete = async (id) => {
    // Pide confirmacion antes de eliminar permanentemente el registro.
    if (!confirm("¿Eliminar este estado?")) return;
    try {
      // Elimina el registro usando su ID mediante DELETE.
      await estadosReservaApi.remove(id);
      // Recarga la tabla para quitar de pantalla el registro eliminado.
      loadList();
    } catch (err) {
      // Muestra el error si la eliminacion falla.
      setError(err?.response?.statusText || err.message || "Error eliminando");
    }
  };

  const handleSearch = async () => {
    // No busca si el campo de ID esta vacio.
    if (!searchId) return;
    setError("");
    setSearchResult(null);
    try {
      // Solicita un unico registro mediante GET /estados-reserva/:id.
      const res = await estadosReservaApi.getById(searchId);
      // Guarda el resultado para mostrarlo debajo del buscador.
      setSearchResult(res.data);
    } catch (err) {
      // Informa que el ID no existe o que la consulta fallo.
      setError("No se encontró el registro");
    }
  };

  return (
    <div className="crud-page">
      <h1 className="crud-title">Estados de Reserva</h1>

      <div className="card">
        <div className="card-title">
          {isEditing ? `Editar estado #${editingId}` : "Crear nuevo"}
        </div>
        <form className="form-row" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre del estado</label>
            <input
              className="input"
              placeholder="Confirmada, Pendiente, Cancelada..."
              value={nombreEstado}
              onChange={(e) => setNombreEstado(e.target.value)}
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
            {searchResult.nombre_estado}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Listado</span>
          <button className="btn btn-outline" onClick={loadList}>
            Refrescar
          </button>
        </div>
        {loading && <div className="status-msg status-loading">Cargando...</div>}
        <div className="table-wrap">
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre_estado}</td>
                  <td>
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
