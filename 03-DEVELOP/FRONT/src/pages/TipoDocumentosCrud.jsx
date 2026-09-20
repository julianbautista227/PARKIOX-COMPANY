import { useEffect, useState } from "react";
import tipoDocumentosApi from "../api/tipoDocumentosApi";

/**
 * CRUD para administrar los tipos de documento del sistema.
 * Permite listar, crear, actualizar, eliminar y buscar registros por ID.
 */
export default function TipoDocumentosCrud() {
  // Lista completa de tipos de documento obtenidos del backend.
  const [items, setItems] = useState([]);
  // Campos del formulario de creación y edición.
  const [sigla, setSigla] = useState("");
  const [nombreDocumento, setNombreDocumento] = useState("");
  // Búsqueda rápida por ID.
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  // Indica si el formulario está en modo edición.
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = editingId !== null;

  // El return renderiza la interfaz de gestión de tipos de documento,
  // conectando el formulario y la tabla con los estados de la vista.
  /**
   * Carga la lista de tipos de documento desde el backend.
   */
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

  // Carga inicial de la información al renderizar la página.
  useEffect(() => {
    loadList();
  }, []);

  /**
   * Reinicia el formulario y vuelve al modo de creación.
   */
  const resetForm = () => {
    setSigla("");
    setNombreDocumento("");
    setEditingId(null);
  };

  /**
   * Crea o actualiza un tipo de documento según el estado del formulario.
   */
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

  /**
   * Selecciona un registro para editarlo en el formulario.
   */
  const handleEdit = (item) => {
    setEditingId(item.id);
    setSigla(item.sigla);
    setNombreDocumento(item.nombre_documento);
  };

  /**
   * Elimina un tipo de documento después de confirmar la acción.
   */
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este tipo de documento?")) return;
    try {
      await tipoDocumentosApi.remove(id);
      loadList();
    } catch (err) {
      setError(err?.response?.statusText || err.message || "Error eliminando");
    }
  };

  /**
   * Busca un documento específico por su ID y muestra el resultado.
   */
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
