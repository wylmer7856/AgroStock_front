// 🌾 PERFIL DE PRODUCTOR - Formulario completo para gestionar datos del productor

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Loading, Toast } from '../../components/ReusableComponents';
import { productoresService, ubicacionesService } from '../../services';
import type { ProductorProfile } from '../../types';
import './ProductorDashboard.css';

interface PerfilProductorProps {
  onNavigate?: (view: string) => void;
  onClose?: () => void;
}

export const PerfilProductor: React.FC<PerfilProductorProps> = ({ onNavigate, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);

  const [formData, setFormData] = useState<Partial<ProductorProfile>>({
    nombre_finca: '',
    tipo_productor: 'agricultor',
    id_departamento: null,
    id_ciudad: null,
    vereda: '',
    direccion_finca: '',
    numero_registro_ica: '',
    certificaciones: '',
    descripcion_actividad: '',
    anos_experiencia: null,
    hectareas: null,
    metodo_produccion: 'tradicional',
    sitio_web: '',
    foto_perfil_finca: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar departamentos
      try {
        const deptosRes = await ubicacionesService.listarDepartamentos();
        if (deptosRes.success && deptosRes.data) {
          setDepartamentos(deptosRes.data);
        }
      } catch (error) {
        console.error('Error cargando departamentos:', error);
        // Continuar aunque falle, el usuario puede seguir usando el formulario
      }

      // Cargar perfil existente (si existe)
      if (user?.id_usuario || user?.id) {
        try {
          const perfilRes = await productoresService.obtenerMiPerfil();
          
          // Si el perfil existe, cargar los datos
          if (perfilRes.success && perfilRes.data) {
            setFormData({
              nombre_finca: perfilRes.data.nombre_finca || '',
              tipo_productor: perfilRes.data.tipo_productor || 'agricultor',
              id_departamento: perfilRes.data.id_departamento || null,
              id_ciudad: perfilRes.data.id_ciudad || null,
              vereda: perfilRes.data.vereda || '',
              direccion_finca: perfilRes.data.direccion_finca || '',
              numero_registro_ica: perfilRes.data.numero_registro_ica || '',
              certificaciones: perfilRes.data.certificaciones || '',
              descripcion_actividad: perfilRes.data.descripcion_actividad || '',
              anos_experiencia: perfilRes.data.anos_experiencia || null,
              hectareas: perfilRes.data.hectareas || null,
              metodo_produccion: perfilRes.data.metodo_produccion || 'tradicional',
              sitio_web: perfilRes.data.sitio_web || '',
              foto_perfil_finca: perfilRes.data.foto_perfil_finca || ''
            });

            // Cargar ciudades del departamento seleccionado
            if (perfilRes.data.id_departamento) {
              try {
                const ciudadesRes = await ubicacionesService.listarCiudades(perfilRes.data.id_departamento);
                if (ciudadesRes.success && ciudadesRes.data) {
                  setCiudades(ciudadesRes.data);
                }
              } catch (error) {
                console.error('Error cargando ciudades:', error);
              }
            }
          } else {
            // No hay perfil aún, pero eso está bien - el usuario puede crear uno
            console.log('No se encontró perfil de productor, se puede crear uno nuevo');
          }
        } catch (error) {
          console.error('Error obteniendo perfil:', error);
          // No mostrar error si es 404 (perfil no encontrado), es normal la primera vez
          if (error instanceof Error && !error.message.includes('404')) {
            mostrarToast('Error cargando perfil. Puedes crear uno nuevo.', 'error');
          }
        }
      }
    } catch (error) {
      console.error('Error general cargando datos:', error);
      mostrarToast('Error cargando algunos datos. Puedes continuar completando el formulario.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartamentoChange = async (idDepartamento: number) => {
    setFormData({ ...formData, id_departamento: idDepartamento, id_ciudad: null });
    
    if (idDepartamento) {
      try {
        const ciudadesRes = await ubicacionesService.listarCiudades(idDepartamento);
        if (ciudadesRes.success && ciudadesRes.data) {
          setCiudades(ciudadesRes.data);
        }
      } catch (error) {
        console.error('Error cargando ciudades:', error);
        setCiudades([]);
      }
    } else {
      setCiudades([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const result = await productoresService.guardarPerfil(formData);
      
      if (result.success) {
        mostrarToast('Perfil guardado exitosamente', 'success');
        if (onClose) {
          setTimeout(() => onClose(), 1500);
        }
      } else {
        mostrarToast(result.message || 'Error al guardar perfil', 'error');
      }
    } catch (error) {
      mostrarToast('Error al guardar perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const mostrarToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  if (loading) {
    return <Loading message="Cargando perfil..." />;
  }

  return (
    <div className="perfil-productor">
      <div className="perfil-header">
        <h2>🌾 Mi Perfil de Productor</h2>
        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            ← Volver
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="perfil-form">
        <Card className="form-section">
          <h3>📋 Información Básica</h3>
          
          <div className="form-group">
            <label>Nombre de la Finca / Asociación *</label>
            <input
              type="text"
              value={formData.nombre_finca || ''}
              onChange={(e) => setFormData({ ...formData, nombre_finca: e.target.value })}
              placeholder="Ej: Finca La Esperanza"
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Productor *</label>
            <select
              value={formData.tipo_productor || 'agricultor'}
              onChange={(e) => setFormData({ ...formData, tipo_productor: e.target.value as any })}
              required
            >
              <option value="agricultor">🌾 Agricultor</option>
              <option value="ganadero">🐄 Ganadero</option>
              <option value="apicultor">🐝 Apicultor</option>
              <option value="piscicultor">🐟 Piscicultor</option>
              <option value="avicultor">🐔 Avicultor</option>
              <option value="mixto">🌾🐄 Mixto</option>
              <option value="otro">📦 Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Años de Experiencia</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.anos_experiencia || ''}
              onChange={(e) => setFormData({ ...formData, anos_experiencia: e.target.value ? Number(e.target.value) : null })}
              placeholder="Ej: 10"
            />
          </div>
        </Card>

        <Card className="form-section">
          <h3>📍 Ubicación</h3>
          
          <div className="form-group">
            <label>Departamento</label>
            <select
              value={formData.id_departamento || ''}
              onChange={(e) => handleDepartamentoChange(Number(e.target.value))}
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map(depto => (
                <option key={depto.id_departamento} value={depto.id_departamento}>
                  {depto.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ciudad / Municipio</label>
            <select
              value={formData.id_ciudad || ''}
              onChange={(e) => setFormData({ ...formData, id_ciudad: e.target.value ? Number(e.target.value) : null })}
              disabled={!formData.id_departamento}
            >
              <option value="">Seleccione una ciudad</option>
              {ciudades.map(ciudad => (
                <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Vereda / Corregimiento</label>
            <input
              type="text"
              value={formData.vereda || ''}
              onChange={(e) => setFormData({ ...formData, vereda: e.target.value })}
              placeholder="Ej: Vereda El Paraíso"
            />
          </div>

          <div className="form-group">
            <label>Dirección Detallada de la Finca</label>
            <textarea
              value={formData.direccion_finca || ''}
              onChange={(e) => setFormData({ ...formData, direccion_finca: e.target.value })}
              placeholder="Dirección completa de la finca"
              rows={3}
            />
          </div>
        </Card>

        <Card className="form-section">
          <h3>📜 Certificaciones y Registros</h3>
          
          <div className="form-group">
            <label>Número de Registro ICA</label>
            <input
              type="text"
              value={formData.numero_registro_ica || ''}
              onChange={(e) => setFormData({ ...formData, numero_registro_ica: e.target.value })}
              placeholder="Ej: ICA-12345"
            />
          </div>

          <div className="form-group">
            <label>Certificaciones</label>
            <input
              type="text"
              value={formData.certificaciones || ''}
              onChange={(e) => setFormData({ ...formData, certificaciones: e.target.value })}
              placeholder="Ej: Orgánico, Fair Trade, GlobalGAP (separadas por comas)"
            />
            <small>Separe las certificaciones por comas</small>
          </div>

          <div className="form-group">
            <label>Método de Producción</label>
            <select
              value={formData.metodo_produccion || 'tradicional'}
              onChange={(e) => setFormData({ ...formData, metodo_produccion: e.target.value as any })}
            >
              <option value="tradicional">🌱 Tradicional</option>
              <option value="organico">🌿 Orgánico</option>
              <option value="convencional">🏭 Convencional</option>
              <option value="mixto">🔄 Mixto</option>
            </select>
          </div>
        </Card>

        <Card className="form-section">
          <h3>📊 Información Adicional</h3>
          
          <div className="form-group">
            <label>Hectáreas de Producción</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.hectareas || ''}
              onChange={(e) => setFormData({ ...formData, hectareas: e.target.value ? Number(e.target.value) : null })}
              placeholder="Ej: 5.5"
            />
          </div>

          <div className="form-group">
            <label>Descripción de Actividades Productivas</label>
            <textarea
              value={formData.descripcion_actividad || ''}
              onChange={(e) => setFormData({ ...formData, descripcion_actividad: e.target.value })}
              placeholder="Describe las actividades que realizas en tu finca..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Sitio Web (opcional)</label>
            <input
              type="url"
              value={formData.sitio_web || ''}
              onChange={(e) => setFormData({ ...formData, sitio_web: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </Card>

        <div className="form-actions">
          <Button type="submit" disabled={saving}>
            {saving ? '💾 Guardando...' : '💾 Guardar Perfil'}
          </Button>
          {onClose && (
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PerfilProductor;



