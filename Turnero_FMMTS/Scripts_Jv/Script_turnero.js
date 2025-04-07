// Función para guardar un nuevo paciente
function guardarNombre() {
    const nombre = document.getElementById('nombre').value;
    const servicio = document.getElementById('opciones').value;

    if (!nombre.trim()) {
        alert("Por favor, ingresa un nombre.");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const nuevoUsuario = {
        nombre: nombre,
        servicio: servicio
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert("Usuario guardado con éxito");
    document.getElementById('nombre').value = '';
    mostrarUsuarios();
}

// Función para mostrar los usuarios filtrados según el servicio
function mostrarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const listaUsuarios = document.getElementById('lista-usuarios');
    if (!listaUsuarios) return; // Verifica si existe en esta página

    listaUsuarios.innerHTML = '';

    const filtro = document.getElementById('filtro')?.value || 'Todos';

    let usuariosFiltrados = usuarios;
    if (filtro === 'Caja 1' || filtro === 'Caja 2') {
        usuariosFiltrados = usuarios.filter(usuario => usuario.servicio === 'Caja');
    } else if (filtro === 'Recepción') {
        usuariosFiltrados = usuarios.filter(usuario => usuario.servicio === 'Recepción');
    }

    if (usuariosFiltrados.length > 0) {
        usuariosFiltrados.forEach((usuario, index) => {
            const usuarioDiv = document.createElement('div');
            usuarioDiv.classList.add('usuario');
            usuarioDiv.innerHTML = `
                <p><strong>${index + 1}:</strong> ${usuario.nombre}</p>
                <p><strong>Servicio:</strong> ${usuario.servicio}</p>
                <button class="btn-llamar" onclick="llamarPaciente(${index})">Llamar</button>
                <button onclick="eliminarPacientePorNombre('${usuario.nombre}')">Eliminar</button>
            `;
            listaUsuarios.appendChild(usuarioDiv);
        });
    } else {
        listaUsuarios.innerHTML = '<p>No hay pacientes con este servicio.</p>';
    }
}

// Función para eliminar un paciente por nombre
function eliminarPacientePorNombre(nombre) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios = usuarios.filter(usuario => usuario.nombre !== nombre);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // También eliminar de pacientes llamados
    let pacientesLlamados = JSON.parse(localStorage.getItem('pacientesLlamados')) || [];
    pacientesLlamados = pacientesLlamados.filter(paciente => paciente.nombre !== nombre);
    localStorage.setItem('pacientesLlamados', JSON.stringify(pacientesLlamados));

    mostrarUsuarios();
    mostrarPacientesLlamados();
}

// Función para llamar a un paciente
function llamarPaciente(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const paciente = usuarios[index];

    let pacientesLlamados = JSON.parse(localStorage.getItem('pacientesLlamados')) || [];

    const yaLlamado = pacientesLlamados.some(p => p.nombre === paciente.nombre && p.servicio === paciente.servicio);

    if (!yaLlamado) {
        pacientesLlamados.push(paciente);
        localStorage.setItem('pacientesLlamados', JSON.stringify(pacientesLlamados));
        alert(`Paciente ${paciente.nombre} llamado para el módulo ${paciente.servicio}`);
    } else {
        alert(`El paciente ${paciente.nombre} ya fue llamado.`);
    }

    mostrarPacientesLlamados();
}

// Función para mostrar pacientes en el turnero
function mostrarPacientesLlamados() {
    const pacientesLlamados = JSON.parse(localStorage.getItem('pacientesLlamados')) || [];
    const contenedorPacientes = document.getElementById('pacientes-llamados');
    if (!contenedorPacientes) return;

    contenedorPacientes.innerHTML = '';

    pacientesLlamados.forEach((paciente, index) => {
        const pacienteDiv = document.createElement('div');
        pacienteDiv.classList.add('paciente');
        pacienteDiv.innerHTML = `
    <div><p>${index + 1}. <span>${paciente.nombre}</span></p></div>
    <div><p>${paciente.servicio}</p></div>
`;

        contenedorPacientes.appendChild(pacienteDiv);
    });
}

// Ejecutar funciones automáticamente al cargar la página
window.onload = () => {
    if (document.getElementById('lista-usuarios')) {
        mostrarUsuarios();
    }
    if (document.getElementById('pacientes-llamados')) {
        mostrarPacientesLlamados();
    }
};

// Refrescar automáticamente el turnero cada 15 segundos
setInterval(() => {
    if (document.getElementById('pacientes-llamados')) {
        mostrarPacientesLlamados();
    }
}, 15000);
