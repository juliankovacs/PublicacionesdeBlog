const express = require('express');
const app = express();
const port = 3000;

// Parsear los datos a JSON
app.use(express.json());

// Middleware de registro de solicitudes
app.use((req, res, next) => {
    const tiempo = new Date();
    console.log(`Solicitud recibida: ${tiempo}`);
    console.log(`Consulta realizada al endpoint: ${req.path}`);
    console.log(`Metodo HTTP: ${req.method}`);
    next();
});

// Middleware para validar que la publicación tenga título y contenido
function validarPublicacion(req, res, next) {
    const { titulo, contenido } = req.body;
    if (!titulo || !contenido) {
        return res.status(400).json({ mensaje: 'El título y el contenido son obligatorios.' });
    }
    next();
}

// Middleware para validar que el comentario tenga autor y contenido
function validarComentario(req, res, next) {
    const { autor, contenido } = req.body;
    if (!autor || !contenido) {
        return res.status(400).json({ mensaje: 'El autor y el contenido son obligatorios.' });
    }
    next();
}

const publicaciones = [
    { id: 1, titulo: 'Boca 1 - Velez 0', contenido: 'futbol', fecha: new Date() },
    { id: 2, titulo: '10 Mejores alimentos para tu mascota', contenido: 'animales', fecha: new Date() },
    { id: 3, titulo: 'Como Realizar una API-Rest con JS', contenido: 'IT', fecha: new Date() },
];

const comentarios = [];

// Ruta para crear una nueva publicación
app.post('/publicaciones', validarPublicacion, (req, res) => {
    const { titulo, contenido } = req.body;
    const nuevaPublicacion = { id: publicaciones.length + 1, titulo, contenido, fecha: new Date() };
    publicaciones.push(nuevaPublicacion);
    res.status(201).json(nuevaPublicacion);
});

// Ruta para obtener todas las publicaciones
app.get('/publicaciones', (req, res) => {
    res.json(publicaciones);
});

// Ruta para actualizar una publicación existente
app.put('/publicaciones/:id', validarPublicacion, (req, res) => {
    const { id } = req.params;
    const { titulo, contenido } = req.body;
    const publicacionIndex = publicaciones.findIndex(p => p.id === parseInt(id));
    if (publicacionIndex !== -1) {
        publicaciones[publicacionIndex] = { ...publicaciones[publicacionIndex], titulo, contenido };
        res.json(publicaciones[publicacionIndex]);
    } else {
        res.status(404).send('Publicación no encontrada');
    }
});

// Ruta para eliminar una publicación existente
app.delete('/publicaciones/:id', (req, res) => {
    const { id } = req.params;
    const publicacionIndex = publicaciones.findIndex(p => p.id === parseInt(id));
    if (publicacionIndex !== -1) {
        const eliminado = publicaciones.splice(publicacionIndex, 1);
        res.json(eliminado);
    } else {
        res.status(404).send('Publicación no encontrada');
    }
});

// Endpoint para buscar publicaciones por título o contenido usando POST
app.post('/buscar-publicaciones', (req, res) => {
    const { titulo, contenido } = req.body;

    // Filtrar publicaciones por título y/o contenido
    const publicacionesFiltradas = publicaciones.filter(publicacion => {
        const tituloCoincide = titulo ? publicacion.titulo.toLowerCase().includes(titulo.toLowerCase()) : true;
        const contenidoCoincide = contenido ? publicacion.contenido.toLowerCase().includes(contenido.toLowerCase()) : true;
        return tituloCoincide && contenidoCoincide;
    });

    res.json(publicacionesFiltradas);
});

// Ruta para crear un nuevo comentario publicaciones/3/comentarios
app.post('/publicaciones/:id/comentarios', validarComentario, (req, res) => {
    const { id } = req.params;
    const { autor, contenido } = req.body;
    const publicacion = publicaciones.find(p => p.id === parseInt(id));
    if (!publicacion) {
        return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }
    const nuevoComentario = { id: comentarios.length + 1, autor, contenido, fecha: new Date(), publicacionId: parseInt(id) };
    comentarios.push(nuevoComentario);
    res.status(201).json(nuevoComentario);
});

// Ruta para obtener todos los comentarios de una publicación específica 
app.get('/publicaciones/:id/comentarios', (req, res) => {
    const { id } = req.params;
    const comentariosDePublicacion = comentarios.filter(comentario => comentario.publicacionId === parseInt(id));
    res.json(comentariosDePublicacion);
});

// Ruta para actualizar un comentario existente
app.put('/comentarios/:id', validarComentario, (req, res) => {
    const { id } = req.params;
    const { autor, contenido } = req.body;
    const comentarioIndex = comentarios.findIndex(c => c.id === parseInt(id));
    if (comentarioIndex !== -1) {
        comentarios[comentarioIndex] = { ...comentarios[comentarioIndex], autor, contenido };
        res.json(comentarios[comentarioIndex]);
    } else {
        res.status(404).send('Comentario no encontrado');
    }
});

// Ruta para eliminar un comentario existente
app.delete('/comentarios/:id', (req, res) => {
    const { id } = req.params;
    const comentarioIndex = comentarios.findIndex(c => c.id === parseInt(id));
    if (comentarioIndex !== -1) {
        const eliminado = comentarios.splice(comentarioIndex, 1);
        res.json(eliminado);
    } else {
        res.status(404).send('Comentario no encontrado');
    }
});

app.listen(port, () => {
    console.log(`API de blog escuchando en http://localhost:${port}`);
});
