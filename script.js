// Imagen genérica que se usará para todos los productos
const IMAGEN_DEFAULT = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=80";

// Datos iniciales si localStorage está vacío
const productosIniciales = [
    {
        id: "1",
        nombre: "Alimento Premium",
        precio: 450,
        stock: 15
    },
    {
        id: "2",
        nombre: "Correa Profesional",
        precio: 250,
        stock: 8
    },
    {
        id: "3",
        nombre: "Cama Deluxe",
        precio: 850,
        stock: 5
    }
];

// Elementos del DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const formProducto = document.getElementById("form-producto");
const inputId = document.getElementById("producto-id");
const inputNombre = document.getElementById("producto-nombre");
const inputPrecio = document.getElementById("producto-precio");
const inputStock = document.getElementById("producto-stock");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");

let productos = JSON.parse(localStorage.getItem("productos")) || productosIniciales;

// 1. LEER (READ): Renderizar la lista
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

// 2. CREAR Y ACTUALIZAR
formProducto.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = inputId.value;
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const stock = parseInt(inputStock.value);

    if (id) {
        // MODO EDITAR
        productos = productos.map(p => p.id === id ? { id, nombre, precio, stock } : p);
        alert("¡Producto actualizado exitosamente!");
    } else {
        // MODO CREAR
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

// Preparar edición
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

// 3. ELIMINAR
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

// Formulario de Contacto
document.getElementById("form-contacto")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Gracias por contactarnos. Te responderemos pronto.");
    this.reset();
});

renderizarProductos();