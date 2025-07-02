import React, { useEffect, useState } from 'react';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../services/api';
import './ListaCursos.css';
import { useNavigate } from 'react-router-dom';

const ListaCursos = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("userId");
        if (!user) navigate("/login");
    }, [navigate]);

    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        numberOfTopics: 0,
        publishedAt: ''
    });
    const [editId, setEditId] = useState(null);

    const fetchCursos = () => {
        getCourses()
            .then(response => {
                setCursos(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Error al cargar cursos');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCursos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este curso?")) {
            await deleteCourse(id);
            fetchCursos();
        }
    };

    const handleEdit = (curso) => {
        setFormData({
            title: curso.title,
            description: curso.description,
            numberOfTopics: curso.numberOfTopics,
            publishedAt: curso.publishedAt?.split("T")[0]
        });
        setEditId(curso._id);
        setFormVisible(true);
    };

    const handleAdd = () => {
        setFormData({
            title: '',
            description: '',
            numberOfTopics: 0,
            publishedAt: ''
        });
        setEditId(null);
        setFormVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            alert("Por favor completa todos los campos");
            return;
        }

        if (editId) {
            await updateCourse(editId, formData);
        } else {
            await addCourse(formData);
        }
        setFormVisible(false);
        fetchCursos();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'numberOfTopics' ? parseInt(value) : value
        }));
    };

    if (loading) return <p>Cargando cursos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="contenedor">
            <div className="btn-container">
                <button className="btn insertar" onClick={() => {
                    navigate("/laboratorio");
                }}>
                    Ingresar a Laboratorios
                </button>
            </div>
            <br>
            </br>
            <div className="btn-container">
                <button className="btn insertar" onClick={handleAdd}>Insertar</button>
            </div>
            <div className="cursos-grid">
                {cursos.map(curso => (
                    <div key={curso._id} className="card">
                        <h3>{curso.title}</h3>
                        <p><em>{curso.description}</em></p>
                        <p>Temas: {curso.numberOfTopics}</p>
                        <p>Publicado en: {new Date(curso.publishedAt).toLocaleDateString()}</p>
                        <div className="acciones">
                            <button className="btn editar" onClick={() => handleEdit(curso)}>Editar</button>
                            <button className="btn eliminar" onClick={() => handleDelete(curso._id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {formVisible && (
                <div className="modal">
                    <form className="formulario" onSubmit={handleSubmit}>
                        <h3>{editId ? "Editar Curso" : "Nuevo Curso"}</h3>
                        <input
                            type="text"
                            name="title"
                            placeholder="Título"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Descripción"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="numberOfTopics"
                            placeholder="Temas"
                            value={formData.numberOfTopics}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="date"
                            name="publishedAt"
                            value={formData.publishedAt}
                            onChange={handleChange}
                            required
                        />
                        <div className="acciones">
                            <button type="submit" className="btn insertar">Guardar</button>
                            <button type="button" className="btn eliminar" onClick={() => setFormVisible(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
            <br />
            <div className="btn-container">
                <button className="btn cerrar" onClick={() => {
                    localStorage.removeItem("userId");
                    navigate("/login");
                }}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default ListaCursos;