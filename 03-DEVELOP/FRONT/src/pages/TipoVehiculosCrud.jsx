import { useEffect, useState } from "react";
import tipoVehiculosApi from "../api/tipoVehiculosApi";


export default function TipoVehiculosCrud() {
  const [items, setItems] = useState([]);
  const [nombreTipo, setNombreTipo] = useState("");
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
      const res = await tipoVehiculosApi.list();
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
    if (!nombreTipo.trim()) return;
    setError("");
    try {
      if (isEditing) {
        await tipoVehiculosApi.update(editingId, { nombre_tipo: nombreTipo });
      } else {
        await tipoVehiculosApi.create({ nombre_tipo: nombreTipo });
      }
      resetForm();
      loadList();
    } catch (err) {
      setError(err?.response?.statusText || err.message || "Error guardando");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNombreTipo(item.nombre_tipo);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este tipo de vehículo?")) return;
    try {
      await tipoVehiculosApi.remove(id);
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
      const res = await tipoVehiculosApi.getById(searchId);
      setSearchResult(res.data);
    } catch (err) {
      setError("No se encontró el registro");
    }
  };

  return (
    <div className="crud-page">
      <h1 className="crud-title">Tipo de Vehículos</h1>

      <div className="card">
        <div className="card-title">
          {isEditing ? `Editar tipo #${editingId}` : "Crear nuevo"}
        </div>
        <form className="form-row" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre del tipo</label>
            <input
              className="input"
              placeholder="Automóvil particular, Motocicleta..."
              value={nombreTipo}
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
            {searchResult.nombre_tipo}
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
                <th>Nombre del tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre_tipo}</td>
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
