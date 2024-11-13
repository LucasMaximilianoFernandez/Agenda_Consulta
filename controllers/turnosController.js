const Turno = require('../models/Turno');
const db = require('../models/db');

// Mostrar todos los turnos
exports.mostrarTurnos = (req, res) => {
  Turno.obtenerTodos((err, turnos) => {
    if (err) return res.status(500).send('Error al obtener turnos.');
    res.render('turnos', { turnos });
  });
};

// Mostrar el detalle de un turno
exports.mostrarTurno = (req, res) => {
  const turnoId = req.params.id;
  Turno.obtenerPorId(turnoId, (err, turno) => {
    if (err || !turno) return res.status(404).send('Turno no encontrado.');
    res.render('turno', { turno });
  });
};

exports.mostrarFormularioEditarTurno = (req, res) => {
  const turnoId = req.params.id;

  // Obtener el turno por ID
  Turno.obtenerPorId(turnoId, (err, turno) => {
    if (err || !turno) return res.status(404).send('Turno no encontrado.');

    // Obtener listas de pacientes, profesionales, especialidades y sucursales
    db.query('SELECT * FROM pacientes', (err, pacientes) => {
      if (err) return res.status(500).send('Error al obtener pacientes.');
      
      db.query('SELECT * FROM profesionales', (err, profesionales) => {
        if (err) return res.status(500).send('Error al obtener profesionales.');
        
        db.query('SELECT * FROM especialidades', (err, especialidades) => {
          if (err) return res.status(500).send('Error al obtener especialidades.');
          
          db.query('SELECT * FROM sucursales', (err, sucursales) => {
            if (err) return res.status(500).send('Error al obtener sucursales.');

            // Renderizamos la vista pasando todas las listas y el turno que se quiere editar
            res.render('editar', {
              turno,
              pacientes,
              profesionales,
              especialidades,
              sucursales
            });
          });
        });
      });
    });
  });
};

// Editar un turno
exports.editarTurno = (req, res) => {
  const turnoId = req.params.id;
  const { paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora, estado } = req.body;

  // Actualizar el turno con los datos recibidos del formulario
  Turno.editar(turnoId, { paciente_id, profesional_id, especialidad_id, sucursal_id, fecha, hora, estado }, (err) => {
    if (err) return res.status(500).send('Error al editar turno.');
    res.redirect('/turnos');
  });
};


// Eliminar un turno
exports.eliminarTurno = (req, res) => {
  const turnoId = req.params.id;
  Turno.eliminar(turnoId, (err) => {
    if (err) return res.status(500).send('Error al eliminar turno.');
    res.redirect('/turnos');
  });
};

exports.crearTurno = (req, res) => {
  const turnoData = req.body;
  console.log(turnoData)
  Turno.crear(turnoData, (err) => {
    if (err) {
      return res.status(500).send('Error al crear turno HOlaaaaaaaa');
    }
    res.redirect('/turnos'); // Redirige a la lista de turnos
  });
};

