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
                    <img src="./img/trailer.png" alt="Trailer">
                </a>
                <p class="producto-advertencia">${producto.advertencia}</p>
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
  if (productoExistente) {
    // Si el producto ya está en el carrito, mostrar un mensaje
    Toastify({
      text: "Este juego ya está en el carrito de compras",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #ff6347, #ffc0cb)",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: ".75rem",
      },
      offset: {
        x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
        y: "1.5rem", // vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  } else {
    // Si el producto no está en el carrito, agregarlo
    Toastify({
      text: "Juego agregado, ve al carrito de compras para pagar",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #4b33a8, #785ce9)",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: ".75rem",
      },
      offset: {
        x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
        y: "1.5rem", // vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
      onClick: function () {}, // Callback after click
    }).showToast();

    // Agregar el producto al carrito
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
    actualizarNumerito();
    localStorage.setItem(
      "productos-en-carrito",
      JSON.stringify(productosEnCarrito)
    );
  }
}

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
