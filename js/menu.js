document.addEventListener("DOMContentLoaded", () => {
    const openMenu = document.querySelector("#open-menu");
    const aside = document.querySelector("aside");

    // Función para alternar la visibilidad del aside
    function toggleAside() {
        aside.classList.toggle("aside-visible");
    }

    // Evento para abrir o cerrar el aside con el botón del menú
    openMenu.addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que el clic en el botón cierre el aside
        toggleAside();
    });

    // Evento para cerrar el aside si se hace clic fuera de él
    document.addEventListener("click", (event) => {
        if (aside.classList.contains("aside-visible") && !aside.contains(event.target) && event.target !== openMenu) {
            aside.classList.remove("aside-visible");
        }
    });

    // Evita que los clics dentro del aside cierren el aside
    aside.addEventListener("click", (event) => {
        event.stopPropagation();
    });
});

document.getElementById('buscar').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});