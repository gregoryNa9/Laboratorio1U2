import React, { useState, useEffect } from 'react';
import { getLabs, addLab, updateLab, deleteLab, getCourses } from '../services/api';
import './ListaCursos.css'; // reutilizamos estilos
import { useNavigate } from 'react-router-dom'; // <-- Agrega esta línea


const Laboratorios = () => {
    const [labs, setLabs] = useState([]);
    const [courses, setCourses] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        labId: '',
        courseId: '',
        nombre: '',
        cantidadPCs: 1
    });

    const fetchData = async () => {
        const [labsRes, coursesRes] = await Promise.all([getLabs(), getCourses()]);
        setLabs(labsRes.data);
        setCourses(coursesRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Generador simple de ID automático (puedes mejorarlo si lo deseas)
    const generarLabId = () => `LAB-${Date.now()}`;

    const handleAdd = () => {
        setFormData({ labId: generarLabId(), courseId: '', nombre: '', cantidadPCs: 1 });
        setEditId(null);
        setFormVisible(true);
    };

    const handleEdit = (lab) => {
        setFormData({
            labId: lab.labId,
            courseId: lab.courseId?._id || lab.courseId,
            nombre: lab.nombre,
            cantidadPCs: lab.cantidadPCs
        });
        setEditId(lab._id);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar laboratorio?")) {
            await deleteLab(id);
            fetchData();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.cantidadPCs < 1) {
            alert("La cantidad de PCs debe ser al menos 1");
            return;
        }
        if (editId) {
            await updateLab(editId, formData);
        } else {
            await addLab(formData);
        }
        setFormVisible(false);
        fetchData();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'cantidadPCs' ? Math.max(1, parseInt(value) || 1) : value
        }));
    };

    return (
        <div className="contenedor">
            <h2>Laboratorios</h2>
            <div className="btn-container">
                <button className="btn insertar" onClick={handleAdd}>Nuevo Laboratorio</button>
            </div>
            <div className="btn-container">
                <button className="btn cerrar" onClick={() => navigate("/cursos")}>
                    Volver a Cursos
                </button>
            </div>
            <div className="cursos-grid">
                {labs.map(lab => (
                    <div key={lab._id} className="card">
                        <h3>{lab.nombre}</h3>
                        <p><strong>ID:</strong> {lab.labId}</p>
                        <p><strong>Curso:</strong> {lab.courseId?.title || "Desconocido"}</p>
                        <p><strong>PCs disponibles:</strong> {lab.cantidadPCs}</p>
                        <div className="acciones">
                            <button className="btn editar" onClick={() => handleEdit(lab)}>Editar</button>
                            <button className="btn eliminar" onClick={() => handleDelete(lab._id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {formVisible && (
                <div className="modal">
                    <form className="formulario" onSubmit={handleSubmit}>
                        <h3>{editId ? "Editar Laboratorio" : "Nuevo Laboratorio"}</h3>
                        <input
                            type="text"
                            name="labId"
                            placeholder="ID del laboratorio"
                            value={formData.labId}
                            onChange={handleChange}
                            required
                            readOnly={!editId} // Solo editable al editar
                        />
                        <select name="courseId" value={formData.courseId} onChange={handleChange} required>
                            <option value="">-- Selecciona un curso --</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.title}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre del laboratorio"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="cantidadPCs"
                            placeholder="Cantidad de PCs"
                            value={formData.cantidadPCs}
                            onChange={handleChange}
                            required
                            min={1}
                        />
                        <div className="acciones">
                            <button type="submit" className="btn insertar">Guardar</button>
                            <button type="button" className="btn eliminar" onClick={() => setFormVisible(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Laboratorios;