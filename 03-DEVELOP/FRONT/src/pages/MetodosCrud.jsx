import { useEffect, useState } from "react";
import metodosApi from "../api/metodosApi";


export default function MetodosCrud() {
  const [items, setItems] = useState([]);
  const [nombre, setNombreTipo] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = editingId !== null;

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

  useEffect(() => {
    loadList();
  }, []);

  const resetForm = () => {
    setNombreTipo("");
    setEditingId(null);
  };

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

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNombreTipo(item.nombre);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este método?")) return;
    try {
      await metodosApi.remove(id);
      loadList();
    } catch (err) {
      setError(err?.response?.statusText || err.message || "Error eliminando");
    }
  };

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
