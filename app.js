document.addEventListener('DOMContentLoaded', () => {
    // REEMPLAZA ESTA URL con la que obtuviste de Google Sheets
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTu5-zivnn-dNKJRuS3E3J2FE43fETSXFUbfej726soomXHHbTiIMYKSQrW_rkKOjwrsXENJZEwBP7_/pub?output=csv';
    const catalogoContainer = document.getElementById('catalogo-container');

    async function cargarCatalogo() {
        try {
            // Añadir un timestamp para evitar la caché del navegador
            const urlConTimestamp = `${csvUrl}?v=${new Date().getTime()}`;
            const response = await fetch(urlConTimestamp);
            const csvData = await response.text();
            const productos = parseCSV(csvData);

            // Mostrar solo los productos que tengan una URL de imagen
            const productosConImagen = productos.filter(producto => producto.url_imagen && producto.url_imagen.trim() !== '');

            // Ordenar por categoría
            productosConImagen.sort((a, b) => a.categoria.localeCompare(b.categoria));

            mostrarProductos(productosConImagen);
        } catch (error) {
            console.error('Error al cargar el catálogo:', error);
            catalogoContainer.innerHTML = '<p>Error al cargar el catálogo. Por favor, inténtelo de nuevo más tarde.</p>';
        }
    }

    function parseCSV(csvString) {
        const lines = csvString.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(header => header.trim());
        const productos = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(value => value.trim().replace(/^"|"$/g, ''));
            if (values.length === headers.length) {
                const producto = {};
                for (let j = 0; j < headers.length; j++) {
                    producto[headers[j]] = values[j];
                }
                productos.push(producto);
            }
        }
        return productos;
    }

    function mostrarProductos(productos) {
        const productosPorCategoria = productos.reduce((acc, producto) => {
            const categoria = producto.categoria || 'Sin categoría';
            if (!acc[categoria]) acc[categoria] = [];
            acc[categoria].push(producto);
            return acc;
        }, {});

        catalogoContainer.innerHTML = '<h2>CATÁLOGO LOS PARRITAS</h2>';

        for (const categoria in productosPorCategoria) {
            const categoriaTitulo = document.createElement('h3');
            categoriaTitulo.className = 'categoria-titulo';
            categoriaTitulo.textContent = categoria;
            catalogoContainer.appendChild(categoriaTitulo);

            const productosGrid = document.createElement('div');
            productosGrid.className = 'productos-grid';
            
            productosPorCategoria[categoria].forEach(producto => {
                const productoCard = document.createElement('div');
                productoCard.className = 'producto-card';

                let urlImagen = producto.url_imagen.trim();

                // Si no es una URL externa, la tratamos como imagen local
                if (!/^https?:\/\//i.test(urlImagen)) {
                    urlImagen = `img/${urlImagen}`;
                }

                productoCard.innerHTML = `
                    <img src="${urlImagen}" alt="${producto.nombre}" class="producto-imagen" 
                        onerror="this.onerror=null;this.src='img/placeholder.png';">
                    <p class="producto-titulo">${producto.nombre}</p>
                    <p class="producto-categoria">${producto.categoria}</p>
                `;
                productosGrid.appendChild(productoCard);
            });

            catalogoContainer.appendChild(productosGrid);
        }
    }

    cargarCatalogo();
});