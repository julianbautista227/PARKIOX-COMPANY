import { useEffect, useState } from "react";
import tipoDocumentosApi from "../api/tipoDocumentosApi";

export default function TipoDocumentosCrud() {
  const [items, setItems] = useState([]);
  const [sigla, setSigla] = useState("");
  const [nombreDocumento, setNombreDocumento] = useState("");
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
      const res = await tipoDocumentosApi.list();
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
    setSigla("");
    setNombreDocumento("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sigla.trim() || !nombreDocumento.trim()) return;
    setError("");
    try {
      const payload = { sigla, nombre_documento: nombreDocumento };
      if (isEditing) {
        await tipoDocumentosApi.update(editingId, payload);
      } else {
        await tipoDocumentosApi.create(payload);
      }
      resetForm();
      loadList();
    } catch (err) {
      setError(err?.response?.statusText || err.message || "Error guardando");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setSigla(item.sigla);
    setNombreDocumento(item.nombre_documento);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este tipo de documento?")) return;
    try {
      await tipoDocumentosApi.remove(id);
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
      const res = await tipoDocumentosApi.getById(searchId);
      setSearchResult(res.data);
    } catch (err) {
      setError("No se encontró el registro");
    }
  };

  return (
    <div className="crud-page">
      <h1 className="crud-title">Tipos de Documento</h1>

      <div className="card">
        <div className="card-title">
          {isEditing ? `Editar tipo #${editingId}` : "Crear nuevo"}
        </div>
        <form className="form-row" onSubmit={handleSubmit}>
          <div className="field">
            <label>Sigla</label>
            <input
              className="input"
              placeholder="CC, TI..."
              value={sigla}
              onChange={(e) => setSigla(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Nombre documento</label>
            <input
              className="input"
              placeholder="cédula de ciudadanía"
              value={nombreDocumento}
              onChange={(e) => setNombreDocumento(e.target.value)}
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
            {searchResult.sigla} - {searchResult.nombre_documento}
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
                <th>Sigla</th>
                <th>Nombre documento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.sigla}</td>
                  <td>{item.nombre_documento}</td>
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
