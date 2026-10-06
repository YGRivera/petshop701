// --- LÓGICA DE USUARIOS Y AUTENTICACIÓN ---

// Cargar usuarios existentes o crear el usuario por defecto (admin/1234)
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    { usuario: "admin", password: "1234" }
];

const modalAuth = document.getElementById("modal-auth");
const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");
const msgAuth = document.getElementById("msg-auth");

const userDisplay = document.getElementById("user-display");
const btnLogout = document.getElementById("btn-logout");

// Cambiar pestaña entre Login y Registro
window.cambiarTab = function(tab) {
    msgAuth.style.display = "none";
    
    document.getElementById("tab-login").classList.toggle("active", tab === 'login');
    document.getElementById("tab-registro").classList.toggle("active", tab === 'registro');
    
    document.getElementById("form-login").classList.toggle("active", tab === 'login');
    document.getElementById("form-registro").classList.toggle("active", tab === 'registro');
};

function mostrarMensaje(texto, tipo) {
    msgAuth.textContent = texto;
    msgAuth.className = `auth-msg ${tipo}`;
    msgAuth.style.display = "block";
}

// Verificar Estado de Sesión
function verificarSesion() {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");
    if (usuarioLogueado) {
        modalAuth.style.display = "none";
        userDisplay.textContent = `👤 ${usuarioLogueado}`;
    } else {
        modalAuth.style.display = "flex";
    }
}

// Evento Iniciar Sesión
formLogin.addEventListener("submit", function(e) {
    e.preventDefault();
    const user = document.getElementById("login-usuario").value.trim();
    const pass = document.getElementById("login-password").value.trim();

    const existeUsuario = usuarios.find(u => u.usuario === user && u.password === pass);

    if (existeUsuario) {
        localStorage.setItem("usuarioLogueado", user);
        formLogin.reset();
        msgAuth.style.display = "none";
        verificarSesion();
    } else {
        mostrarMensaje("Usuario o contraseña incorrectos", "error");
    }
});

// Evento Registrarse
formRegistro.addEventListener("submit", function(e) {
    e.preventDefault();
    const user = document.getElementById("reg-usuario").value.trim();
    const pass = document.getElementById("reg-password").value.trim();
    const passConfirm = document.getElementById("reg-password-confirm").value.trim();

    if (pass !== passConfirm) {
        mostrarMensaje("Las contraseñas no coinciden", "error");
        return;
    }

    if (usuarios.some(u => u.usuario === user)) {
        mostrarMensaje("El nombre de usuario ya existe", "error");
        return;
    }

    // Registrar nuevo usuario
    usuarios.push({ usuario: user, password: pass });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    
    formRegistro.reset();
    mostrarMensaje("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.", "exito");
    
    setTimeout(() => cambiarTab('login'), 1500);
});

// Cerrar Sesión
btnLogout.addEventListener("click", function() {
    localStorage.removeItem("usuarioLogueado");
    verificarSesion();
});

verificarSesion();


// --- LÓGICA CRUD PRODUCTOS ---
const IMAGEN_DEFAULT = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=80";

const productosIniciales = [
    { id: "1", nombre: "Alimento Premium", precio: 450, stock: 15 },
    { id: "2", nombre: "Correa Profesional", precio: 250, stock: 8 },
    { id: "3", nombre: "Cama Deluxe", precio: 850, stock: 5 }
];

const contenedorProductos = document.getElementById("contenedor-productos");
const formProducto = document.getElementById("form-producto");
const inputId = document.getElementById("producto-id");
const inputNombre = document.getElementById("producto-nombre");
const inputPrecio = document.getElementById("producto-precio");
const inputStock = document.getElementById("producto-stock");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");

let productos = JSON.parse(localStorage.getItem("productos")) || productosIniciales;

function renderizarProductos() {
    contenedorProductos.innerHTML = "";

    if (productos.length === 0) {
        contenedorProductos.innerHTML = "<p>No hay productos registrados actualmente.</p>";
        return;
    }

    productos.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${IMAGEN_DEFAULT}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p class="precio">$${prod.precio} MXN</p>
            <p class="stock">Disponibles: ${prod.stock} ud.</p>
            <div class="card-acciones">
                <button class="btn-editar" onclick="prepararEdicion('${prod.id}')">✏️ Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto('${prod.id}')">🗑️ Eliminar</button>
            </div>
            <button class="btn-carrito" onclick="alert('Producto agregado al carrito 🛒')">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(card);
    });

    localStorage.setItem("productos", JSON.stringify(productos));
}

formProducto.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = inputId.value;
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const stock = parseInt(inputStock.value);

    if (id) {
        productos = productos.map(p => p.id === id ? { id, nombre, precio, stock } : p);
        alert("¡Producto actualizado exitosamente!");
    } else {
        const nuevoProducto = {
            id: Date.now().toString(),
            nombre,
            precio,
            stock
        };
        productos.push(nuevoProducto);
        alert("¡Producto creado exitosamente!");
    }

    limpiarFormulario();
    renderizarProductos();
});

window.prepararEdicion = function (id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    inputId.value = producto.id;
    inputNombre.value = producto.nombre;
    inputPrecio.value = producto.precio;
    inputStock.value = producto.stock;

    btnGuardar.textContent = "Actualizar Producto";
    btnCancelar.style.display = "inline-block";
    
    document.getElementById("admin-productos").scrollIntoView({ behavior: "smooth" });
};

window.eliminarProducto = function (id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        productos = productos.filter(p => p.id !== id);
        renderizarProductos();
    }
};

btnCancelar.addEventListener("click", limpiarFormulario);

function limpiarFormulario() {
    formProducto.reset();
    inputId.value = "";
    btnGuardar.textContent = "Guardar Producto";
    btnCancelar.style.display = "none";
}

document.getElementById("form-contacto")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Gracias por contactarnos. Te responderemos pronto.");
    this.reset();
});

renderizarProductos();