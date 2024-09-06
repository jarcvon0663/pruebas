let productos = [];

fetch("./js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    cargarProductos(productos);
  })
  .catch((error) => console.error("Error al cargar los productos:", error));

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar;
const numerito = document.querySelector("#numerito");
const numeritoFlotante = document.querySelector("#numerito-flotante");

botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
  })
);

function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";
  productosElegidos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">Precio $${producto.precio}</p>
                <a class="producto-trailer" href="${producto.trailer}" target="_blank">
                <p class="video-trailer">
                <span class="emoji">🎬</span>Vídeo
            </p>
                </a>
                <p class="producto-advertencia"><span class="emoji">⚠️</span>${producto.advertencia}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
    contenedorProductos.append(div);
  });

  actualizarBotonesAgregar();

  const trailerLinks = document.querySelectorAll(".producto-trailer");
  trailerLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      mostrarTrailer(this.href);
    });
  });

  const popupClose = document.querySelector(".popup-close");
  popupClose.addEventListener("click", cerrarTrailer);
}

function mostrarTrailer(url) {
  const videoId = getYoutubeVideoId(url);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const popup = document.getElementById("popup-trailer");
  const popupVideo = document.getElementById("popup-video");
  popupVideo.src = embedUrl;
  popup.style.display = "block";
}

function cerrarTrailer() {
  const popup = document.getElementById("popup-trailer");
  const popupVideo = document.getElementById("popup-video");
  popup.style.display = "none";
  popupVideo.src = "";
}

function getYoutubeVideoId(url) {
  const urlObj = new URL(url);
  return urlObj.hostname === "youtu.be"
    ? urlObj.pathname.slice(1)
    : urlObj.searchParams.get("v");
}

window.addEventListener("click", function (event) {
  const popup = document.getElementById("popup-trailer");
  if (event.target == popup) {
    cerrarTrailer();
  }
});

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    const categoriaId = e.currentTarget.id;
    if (categoriaId != "todos") {
      const productosFiltrados = productos.filter(
        (producto) => producto.categoria.id === categoriaId
      );
      const productoCategoria = productosFiltrados[0];
      tituloPrincipal.innerText = productoCategoria.categoria.nombre;
      cargarProductos(productosFiltrados);
    } else {
      tituloPrincipal.innerText = "Todos los productos";
      cargarProductos(productos);
    }
  });
});

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  botonesAgregar.forEach((boton) =>
    boton.addEventListener("click", agregarAlCarrito)
  );
}

let productosEnCarrito =
  JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
actualizarNumerito();

function agregarAlCarrito(e) {
  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(
    (producto) => producto.id === idBoton
  );

  // Verificar si el producto ya está en el carrito
  const productoExistente = productosEnCarrito.find(
    (producto) => producto.id === idBoton
  );

  // Crear el contenido HTML para la notificación
  const contenido = `
        <div style="display: flex; align-items: center; padding: 5px; width: 100vw; max-width: 300px; margin: 10px auto;">
        <img src="${productoAgregado.imagen}" alt="Imagen del juego" style="width: 70px; height: 70px; margin-right: 5px;" />
        <div style="flex: 1;">
            <p style="margin: 0; font-size: 14px; color: #ffffff;">${productoAgregado.titulo} ${productoExistente ? "ya está en el carrito" : "se agregó al carrito"}</p>
            <div style="margin-top: 10px;">
                <button id="btnHacerPago" style="background-color: #00641e; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px;">Pagar</button>
                <button id="btnSeguirEscogiendo" style="background-color: #ff0000; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;">Añadir +</button>
            </div>
        </div>
    </div>
    `;

  // Mostrar la notificación
  const toast = Toastify({
    node: (() => {
      const div = document.createElement("div");
      div.innerHTML = contenido;
      return div;
    })(),
    gravity: "top", // Posición superior
    position: "center", // En la derecha
    duration: 7000, // Duración más larga
    close: false, // Ocultar la "X"
    stopOnFocus: true, // Evitar que se cierre al pasar el ratón sobre la notificación
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      fontSize: ".85rem",
    },
  }).showToast();

  // Asignar los eventos a los botones después de mostrar la notificación
  setTimeout(() => {
    document.getElementById("btnHacerPago").onclick = () => {
      document.getElementById("hacerpago").click(); // Simular clic en "Hacer pago"
    };

    document.getElementById("btnSeguirEscogiendo").onclick = () => {
      toast.hideToast(); // Cerrar la notificación
      Toastify({
        text: "¡Sigue explorando!",
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          fontSize: ".85rem",
        },
      }).showToast();
    };
  }, 100); // Esperar un momento para asegurarse de que los botones se carguen

  if (!productoExistente) {
    // Agregar el producto al carrito si no existe
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
    localStorage.setItem(
      "productos-en-carrito",
      JSON.stringify(productosEnCarrito)
    );

    animarProductoAlCarrito(e.currentTarget); // Ejecutar la animación de agregar al carrito
  }

  actualizarNumerito(); // Actualizar el numerito del carrito
}

function agitarBotonPago() {
  const botonPago = document.querySelector(".boton-flotante");
  botonPago.classList.add("agitar");
  setTimeout(() => {
    botonPago.classList.remove("agitar");
  }, 500); // Ajustar el tiempo según sea necesario
}

// Función de animación de agregar al carrito
function animarProductoAlCarrito(imagen) {
  const carrito = document.querySelector(".boton-flotante");
  const imagenRect = imagen.getBoundingClientRect();
  const carritoRect = carrito.getBoundingClientRect();

  const imagenClon = imagen.cloneNode(true);
  imagenClon.classList.add("animate-to-cart");
  document.body.appendChild(imagenClon);

  const scrollY = window.scrollY; // Obtener la posición de desplazamiento actual

  imagenClon.style.top = `${imagenRect.top + scrollY}px`; // Ajustar por el desplazamiento
  imagenClon.style.left = `${imagenRect.left}px`;
  imagenClon.style.width = `${imagenRect.width}px`;
  imagenClon.style.height = `${imagenRect.height}px`;

  requestAnimationFrame(() => {
    imagenClon.style.transform = `translate(${
      carritoRect.left - imagenRect.left
    }px, ${carritoRect.top - imagenRect.top}px) scale(0.1)`;
    imagenClon.style.width = `10px`;
    imagenClon.style.height = `10px`;
  });

  setTimeout(() => {
    imagenClon.remove();
  }, 2000);
}

document.addEventListener("DOMContentLoaded", actualizarNumerito);

function actualizarNumerito() {
  const nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;
  numeritoFlotante.innerText = nuevoNumerito; // Actualizar también el numerito del botón flotante
}

function buscarJuegos() {
  const input = document.getElementById("search-input");
  const term = input.value.toLowerCase();
  const juegosFiltrados = productos.filter((juego) =>
    juego.titulo.toLowerCase().includes(term)
  );
  cargarProductos(juegosFiltrados);
}

function ordenarPorPopularidad() {
  const juegosOrdenados = [...productos].sort((a, b) =>
    a.id.localeCompare(b.id)
  );
  cargarProductos(juegosOrdenados);
}

function ordenarAlfabeticamente() {
  const juegosOrdenados = [...productos].sort((a, b) =>
    a.titulo.localeCompare(b.titulo)
  );
  cargarProductos(juegosOrdenados);
}

function ordenarPorIdAlta() {
  const juegosOrdenados = productos.filter(
    (producto) => producto.categoria.id === "PCalta"
  );
  cargarProductos(juegosOrdenados);
}

function ordenarPorIdBaja() {
  const juegosOrdenados = productos.filter(
    (producto) => producto.categoria.id === "PCbaja"
  );
  cargarProductos(juegosOrdenados);
}
