// 🛍️ FORMULARIO DE PRODUCTO - Crear y Editar

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Loading, Toast } from '../../components/ReusableComponents';
import { productosService, categoriasService, ubicacionesService } from '../../services';
import type { Producto } from '../../types';
import './ProductorDashboard.css';

interface ProductoFormProps {
  productoId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductoForm: React.FC<ProductoFormProps> = ({ productoId, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);

  const [formData, setFormData] = useState<Partial<Producto>>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    stock_minimo: 5,
    unidad_medida: 'kg',
    id_categoria: null,
    id_ciudad_origen: null,
    imagen_principal: '',
    disponible: true
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
    if (productoId) {
      cargarProducto();
    }
  }, [productoId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [categoriasRes, ciudadesRes] = await Promise.all([
        categoriasService.listarCategorias(),
        ubicacionesService.listarCiudades()
      ]);

      if (categoriasRes.success && categoriasRes.data) {
        console.log('Categorías cargadas:', categoriasRes.data.length);
        setCategorias(categoriasRes.data);
      } else {
        console.error('Error cargando categorías:', categoriasRes);
        mostrarToast('Error cargando categorías', 'error');
      }

      if (ciudadesRes.success && ciudadesRes.data) {
        console.log('Ciudades cargadas:', ciudadesRes.data.length);
        setCiudades(ciudadesRes.data);
      } else {
        console.error('Error cargando ciudades:', ciudadesRes);
        mostrarToast('Error cargando ciudades', 'error');
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      mostrarToast('Error cargando datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cargarProducto = async () => {
    if (!productoId) return;
    
    try {
      setLoading(true);
      const response = await productosService.obtenerProducto(productoId);
      
      if (response.success && response.data) {
        setFormData({
          nombre: response.data.nombre,
          descripcion: response.data.descripcion || '',
          precio: response.data.precio,
          stock: response.data.stock,
          stock_minimo: response.data.stock_minimo,
          unidad_medida: response.data.unidad_medida,
          id_categoria: response.data.id_categoria || null,
          id_ciudad_origen: response.data.id_ciudad_origen || null,
          imagen_principal: response.data.imagen_principal || '',
          disponible: response.data.disponible
        });
        // Si hay imagen, establecer preview (usar imagenUrl si está disponible, sino construir URL)
        const imagenUrl = (response.data as any).imagenUrl || response.data.imagen_principal;
        if (imagenUrl) {
          // Si es una ruta relativa, construir URL completa
          let urlCompleta = imagenUrl;
          if (!imagenUrl.startsWith('http')) {
            const baseUrl = 'http://localhost:8000';
            urlCompleta = `${baseUrl}/${imagenUrl.replace(/^\/+/, '')}`;
          }
          setImagenPreview(urlCompleta);
          // Guardar la ruta original en formData para referencia
          setFormData(prev => ({ ...prev, imagen_principal: response.data.imagen_principal || imagenUrl }));
        } else {
          // Si no hay imagen, limpiar el preview
          setImagenPreview(null);
          setFormData(prev => ({ ...prev, imagen_principal: '' }));
        }
      }
    } catch (error) {
      mostrarToast('Error cargando producto', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        mostrarToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        mostrarToast('La imagen no debe superar los 5MB', 'error');
        return;
      }

      setImagenFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.precio || formData.precio <= 0) {
      mostrarToast('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    try {
      setSaving(true);
      const userId = user?.id_usuario || user?.id;
      
      // Si es edición y solo hay imagen nueva (sin cambios en otros campos), subir solo la imagen
      if (productoId && imagenFile) {
        try {
          const imagenResponse = await productosService.subirImagenProducto(productoId, imagenFile);
          if (imagenResponse.success) {
            mostrarToast('Imagen actualizada exitosamente', 'success');
            setTimeout(() => {
              onSuccess();
            }, 1000);
            return;
          }
        } catch (error) {
          console.error('Error subiendo imagen:', error);
          // Si falla, continuar con el flujo normal de actualización
        }
      }
      
      const productoData: any = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        precio: Number(formData.precio),
        stock: Number(formData.stock) || 0,
        stock_minimo: Number(formData.stock_minimo) || 5,
        unidad_medida: formData.unidad_medida || 'kg',
        id_usuario: userId,
        id_categoria: formData.id_categoria || null,
        id_ciudad_origen: formData.id_ciudad_origen || null,
        disponible: formData.disponible !== false
      };

      let response;
      let productoIdFinal = productoId;
      
      if (productoId) {
        // Si es edición, actualizar el producto
        response = await productosService.actualizarProducto(productoId, productoData);
        productoIdFinal = productoId;
      } else {
        // Si es creación, crear el producto
        response = await productosService.crearProducto(productoData);
        if (response.success && response.data?.id_producto) {
          productoIdFinal = response.data.id_producto;
        }
      }

      if (response.success && productoIdFinal) {
        // Si hay una imagen nueva para subir, subirla (incluso si no se modificaron otros campos)
        if (imagenFile) {
          try {
            const imagenResponse = await productosService.subirImagenProducto(productoIdFinal, imagenFile);
            if (imagenResponse.success) {
              console.log('Imagen subida exitosamente');
            }
          } catch (error) {
            console.error('Error subiendo imagen:', error);
            // No fallar el proceso si la imagen falla, solo mostrar advertencia
            mostrarToast('Producto guardado, pero hubo un error al subir la imagen', 'error');
          }
        }
        
        mostrarToast(
          productoId ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente',
          'success'
        );
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        mostrarToast(response.message || 'Error guardando producto', 'error');
      }
    } catch (error: any) {
      console.error('Error guardando producto:', error);
      mostrarToast(error.message || 'Error guardando producto', 'error');
    } finally {
      setSaving(false);
    }
  };

  const mostrarToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  if (loading && productoId) {
    return <Loading message="Cargando producto..." />;
  }

  return (
    <div className="producto-form">
      <div className="form-header">
        <h2>{productoId ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto'}</h2>
        <Button variant="secondary" onClick={onClose}>
          ← Volver
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="producto-form-content">
        <Card className="form-section">
          <h3>📋 Información Básica</h3>
          
          <div className="form-group">
            <label>Nombre del Producto *</label>
            <input
              type="text"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Tomates orgánicos"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.descripcion || ''}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe tu producto..."
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio por Unidad (COP) *</label>
              <input
                type="number"
                value={formData.precio || ''}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                step="100"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Unidad de Medida *</label>
              <select
                value={formData.unidad_medida || 'kg'}
                onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
                required
              >
                <option value="kg">Kilogramos (kg)</option>
                <option value="g">Gramos (g)</option>
                <option value="lb">Libras (lb)</option>
                <option value="unidad">Unidad</option>
                <option value="litro">Litros (L)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="docena">Docena</option>
                <option value="caja">Caja</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="form-section">
          <h3>📦 Inventario</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Stock Disponible *</label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Stock Mínimo *</label>
              <input
                type="number"
                value={formData.stock_minimo || 5}
                onChange={(e) => setFormData({ ...formData, stock_minimo: parseInt(e.target.value) || 5 })}
                placeholder="5"
                min="0"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.disponible !== false}
                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
              />
              {' '}Producto disponible para venta
            </label>
          </div>
        </Card>

        <Card className="form-section">
          <h3>🏷️ Clasificación</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select
                value={formData.id_categoria ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ 
                    ...formData, 
                    id_categoria: value === '' ? null : parseInt(value) 
                  });
                }}
                className="form-input"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.length > 0 ? (
                  categorias.map(cat => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando categorías...</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Ciudad de Origen</label>
              <select
                value={formData.id_ciudad_origen ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ 
                    ...formData, 
                    id_ciudad_origen: value === '' ? null : parseInt(value) 
                  });
                }}
                className="form-input"
              >
                <option value="">Seleccionar ciudad</option>
                {ciudades.length > 0 ? (
                  ciudades.map(ciudad => (
                    <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                      {ciudad.nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando ciudades...</option>
                )}
              </select>
            </div>
          </div>
        </Card>

        <Card className="form-section">
          <h3>🖼️ Imagen del Producto</h3>
          
          <div className="form-group">
            <label>Seleccionar Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-input"
            />
            <small>Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB</small>
            
            {imagenPreview && (
              <div className="image-preview-container">
                <img 
                  src={imagenPreview} 
                  alt="Vista previa" 
                  className="image-preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagenFile(null);
                    setImagenPreview(null);
                  }}
                  className="remove-image-btn"
                >
                  ✕ Eliminar imagen
                </button>
              </div>
            )}
          </div>
        </Card>

        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            loading={saving}
          >
            {productoId ? '💾 Actualizar Producto' : '➕ Crear Producto'}
          </Button>
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

