const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const total = document.querySelector("#total");

cargarProductosCarrito();

function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
        contenedorCarritoProductos.innerHTML = "";
        
        let mensajeDescuento = "";

        productosEnCarrito.forEach((producto, index) => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
            contenedorCarritoProductos.append(div);

            // Agregar mensajes de descuento según la cantidad de juegos en el carrito
            if (productosEnCarrito.length === 1 && index === 0) {
                mensajeDescuento = "¡Agrega 2 juegos más y obtén un descuento especial!";
            } else if (productosEnCarrito.length === 2 && index === 1) {
                mensajeDescuento = "¡Agrega 1 juego más y obtén un descuento especial!";
            } else if (productosEnCarrito.length === 3 && index === 2) {
                mensajeDescuento = "¡Agrega 2 juegos más y tendrás acceso a todo el catálogo!";
            } else if (productosEnCarrito.length === 4 && index === 3) {
                mensajeDescuento = "¡Agrega 1 juego más y tendrás acceso a todo el catálogo!";
            } else if (productosEnCarrito.length === 5 && index === 4) {
                mensajeDescuento = "¡Por una compra de $30.000 obtienes acceso a todo el catálogo!";
            } else if (productosEnCarrito.length === 6 && index === 5) {
                mensajeDescuento = "¡Por una compra de $30.000 obtienes acceso a todo el catálogo!";
            } else if (productosEnCarrito.length === 7 && index === 6) {
                mensajeDescuento = "¡Por una compra de $30.000 obtienes acceso a todo el catálogo!";
            } else if (productosEnCarrito.length === 8 && index === 7) {
                mensajeDescuento = "¡Por una compra de $30.000 obtienes acceso a todo el catálogo!";
            }            

            // Mostrar el mensaje de descuento si existe
            if (mensajeDescuento !== "") {
                const mensajeDescuentoElement = document.createElement("p");
                mensajeDescuentoElement.textContent = mensajeDescuento;
                contenedorCarritoProductos.append(mensajeDescuentoElement);
            }
        });
        
        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}


function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    if (index !== -1) {
        productosEnCarrito.splice(index, 1);
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito();
        Toastify({
            text: "Juego eliminado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #4b33a8, #785ce9)",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem"
            }
        }).showToast();
    }
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} juegos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}

function mostrarMetodoPago() {
    var metodoSeleccionado = document.getElementById("metodo-pago").value;

    if (!metodoSeleccionado) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor selecciona un método de pago'
        });
        return;
    }

    // Obtener el total a pagar desde el DOM
    var totalPagar = document.getElementById("total").textContent;

    // Configuración para cada método de pago
    var infoPago = {
        nequi: {
            titulo: "3143394021",
            texto: `Total a pagar: ${totalPagar}`,
            link: "nequi://app",
            img: "../img/nequi.png"
        },
        daviplata: {
            titulo: "3143394021",
            texto: `Total a pagar: ${totalPagar}`,
            link: "https://play.google.com/store/apps/details?id=com.davivienda.daviplataapp",
            img: "../img/daviplata.png"
        },
        dale: {
            titulo: "3143394021",
            texto: `Total a pagar: ${totalPagar}`,
            link: "https://play.google.com/store/apps/details?id=com.avalsolucionesdigitalessa.dale_app_embedded",
            img: "../img/dale.png"
        },
        transfiya: {
            titulo: "3143394021",
            texto: `Desde cualquier aplicación bancaria paga por transfiya al Nequi 3143394021\nTotal a pagar: ${totalPagar}`,
            img: "../img/transfiya.png"
        },
        pse: {
            titulo: "Realiza una recarga desde cualquier entidad bancaria a Nequi 3143394021",
            texto: `Total a pagar: ${totalPagar}`,
            link: "https://recarga.nequi.com.co/bdigitalpsl/?_ga=2.189700267.1416431342.1700047997",
            img: "../img/pse.png"
        },
        bancolombia: {
            titulo: "Bancolombia o Ahorro a la mano cuenta de ahorros: 30400010907",
            texto: `Total a pagar: ${totalPagar}`,
            link: "https://play.google.com/store/apps/details?id=co.com.tcs.bancolombia.bancaalamano",
            img: "../img/bancolombia.png"
        }
    };

    var metodo = infoPago[metodoSeleccionado];
    
    Swal.fire({
        title: metodo.titulo,
        text: metodo.texto,
        imageUrl: metodo.img,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: 'Abrir la APP',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        background: '#ececec', // Fondo gris claro
        color: 'var(--clr-main)', // Asegúrate de que el texto sea visible
        imageAlt: metodo.titulo // Alternativo de imagen para accesibilidad
    }).then((result) => {
        if (result.isConfirmed && metodo.link) {
            window.open(metodo.link, "_blank");
        }
    });
    
}


botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
    Toastify({
        text: "Gracias por tu compra",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        }
    }).showToast();
}

function actualizarTotal() {
    let totalCalculado = 0;
    let descuento = 0;

    productosEnCarrito.forEach(producto => {
        totalCalculado += producto.precio; // Sumar el precio de cada juego al total inicialmente
    });

    // Aplicar descuentos según la cantidad de juegos en el carrito
    if (productosEnCarrito.length >= 3 && productosEnCarrito.length < 5) {
        descuento = 3000; // Descuento para 3 juegos: se descuentan $3000
    } else if (productosEnCarrito.length >= 5) {
        totalCalculado = 30000; // Descuento para todos los juegos: total $30000
    }

    // Si se agregan 5 juegos, se aplica el descuento especial
    if (productosEnCarrito.length === 5) {
        totalCalculado = 30000; // Descuento para todos los juegos: total $30000
    } else {
        // Aplicar descuento al total calculado si hay descuento
        totalCalculado -= descuento;
    }

    // Actualizar el texto del total en el HTML
    total.innerText = `$${totalCalculado}`;

    // Actualizar el texto del descuento en el HTML
    const descuentoElement = document.getElementById("descuento");
    if (descuento > 0) {
        descuentoElement.textContent = `Descuento: -$${descuento}`;
    } else {
        descuentoElement.textContent = "";
    }
}

function actualizarMensaje(event) {
    // Evitar que se abra la página por defecto
    event.preventDefault();

    // Obtener los títulos de los videojuegos en el carrito
    const carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    const titulos = carrito.map(producto => producto.titulo);

    // Crear el mensaje con los títulos de los videojuegos
    const mensaje = encodeURIComponent(`Hola, te envío el comprobante de la consignación para instalar en mi celular los siguientes videojuegos: ${titulos.join(', ')}`);

    // Actualizar el href del enlace del botón de WhatsApp con el mensaje generado
    document.getElementById('whatsapp-link').href = `https://api.whatsapp.com/send?phone=573042672810&text=${mensaje}`;

    // Seguir con el enlace después de actualizar el href
    window.location = document.getElementById('whatsapp-link').href;
}
