
const db = require('./db');

class Profesional {
  // Obtener todos los profesionales con sus especialidades
  static obtenerTodos(callback) {
    const query = `
      SELECT p.id, p.nombre_completo, p.estado, GROUP_CONCAT(e.nombre) AS especialidades
      FROM profesionales p
      LEFT JOIN profesional_especialidad pe ON p.id = pe.profesional_id
      LEFT JOIN especialidades e ON pe.especialidad_id = e.id
      GROUP BY p.id
    `;
    db.query(query, callback);
  }

  // Crear un nuevo profesional
  static crear({ nombre, especialidades }, callback) {
    const profesionalQuery = 'INSERT INTO profesionales (nombre_completo) VALUES (?)';
    db.query(profesionalQuery, [nombre], (err, result) => {
      if (err) return callback(err);
      const profesionalId = result.insertId;

      // Insertar especialidades asociadas
      if (especialidades && especialidades.length > 0) {
        const values = especialidades.map(eid => [profesionalId, eid]);
        const especialidadQuery = 'INSERT INTO profesional_especialidad (profesional_id, especialidad_id) VALUES ?';
        db.query(especialidadQuery, [values], callback);
      } else {
        callback(null);
      }
    });
  }

  // Editar profesional y sus especialidades
  static editar(id, { nombre, especialidades }, callback) {
    const profesionalQuery = 'UPDATE profesionales SET nombre_completo = ? WHERE id = ?';
    db.query(profesionalQuery, [nombre, id], (err) => {
      if (err) return callback(err);

      // Actualizar especialidades
      const deleteQuery = 'DELETE FROM profesional_especialidad WHERE profesional_id = ?';
      db.query(deleteQuery, [id], (err) => {
        if (err) return callback(err);

        if (especialidades && especialidades.length > 0) {
          const values = especialidades.map(eid => [id, eid]);
          const especialidadQuery = 'INSERT INTO profesional_especialidad (profesional_id, especialidad_id) VALUES ?';
          db.query(especialidadQuery, [values], callback);
        } else {
          callback(null);
        }
      });
    });
  }

  static inactivar(id, callback) {
    const query = 'UPDATE profesionales SET estado = "inactivo" WHERE id = ?';
    db.query(query, [id], callback);
  }

  // Activar un profesional
  static activar(id, callback) {
    const query = 'UPDATE profesionales SET estado = "activo" WHERE id = ?';
    db.query(query, [id], callback);
  }

  // Obtener especialidades disponibles
  static obtenerEspecialidades(callback) {
    db.query('SELECT * FROM especialidades', callback);
  }

  // Obtener un profesional por ID, incluyendo sus especialidades
  static obtenerPorId(id, callback) {
    const query = `
      SELECT p.id, p.nombre_completo, p.estado, GROUP_CONCAT(e.nombre) AS especialidades
      FROM profesionales p
      LEFT JOIN profesional_especialidad pe ON p.id = pe.profesional_id
      LEFT JOIN especialidades e ON pe.especialidad_id = e.id
      WHERE p.id = ?
      GROUP BY p.id
    `;

    db.query(query, [id], (err, resultados) => {
      if (err) return callback(err);
      if (resultados.length === 0) return callback(new Error('Profesional no encontrado'));

      const profesional = resultados[0];
      profesional.especialidades = profesional.especialidades ? profesional.especialidades.split(',') : [];
      callback(null, profesional);
    });
  }
}

module.exports = Profesional;
