const $checkoutProducts = document.getElementById('checkoutProducts');
const $checkoutTotal = document.getElementById('checkoutTotal');

const checkoutProductTemplate = (product) => {
  const { title, image, color, quantityProduct, price } = product;
  return `
    <article>
      <div>
        <img src="${image}" alt="${title.toUpperCase()}">
        <div>
          <p><b>${title}</b></p>
          <p>Color: ${color}</p>
          <p>Cantidad: <span>${quantityProduct}</span></p>
        </div>
      </div>
      <p>Precio unit: <b>S/ ${price}</b></p>
    </article>
  `;
};

const loadCheckoutProducts = () => {
  let total = 0;
  const cart = JSON.parse(localStorage.getItem('cart'));
  
  if (!cart || cart.length === 0) {
    // Si no hay ningún producto en el carrito, mostrar el mensaje
    $checkoutProducts.innerHTML = '<p>Todavía no has querido colocar algún producto al carrito.</p>';
    $checkoutTotal.textContent = `S/ 0.00`;
    return;
  }
  
  for (const item of cart) {
    // Multiplica el precio por la cantidad del producto
    const totalPriceForItem = item.price * item.quantityProduct;
    total += totalPriceForItem;
    $checkoutProducts.innerHTML += checkoutProductTemplate(item);
  }
  
  $checkoutTotal.textContent = `S/ ${total.toFixed(2)}`;
};

document.addEventListener('DOMContentLoaded', () => {
  loadCheckoutProducts();
});

// Evento de clic para el botón "Comprar"
const buyButton = document.querySelector('.btn-primary');
buyButton.addEventListener('click', () => {
    // Verificar si no hay ningún producto en el carrito
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart || cart.length === 0) {
        alert('No hay productos en el carrito. Agrega al menos un producto antes de enviar el formulario.');
        return;
    }

    // Obtener los datos del usuario
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Verificar si los campos de nombre, celular y correo electrónico están vacíos
    if (name.trim() === '' || phone.trim() === '' || email.trim() === '') {
        alert('Por favor, completa todos los campos antes de enviar el formulario.');
        return; // Evitar que se ejecute el envío del formulario
    }

    // Obtener y formatear los datos del carrito
    const cartData = getCartData();

    // Crear un objeto con los datos del usuario y del carrito
    const formData = {
        'Nombre': name,
        'Celular': phone,
        'Correo Electrónico': email,
        'Detalles del Carrito': cartData.cartContent
    };

    // Enviar los detalles del carrito y los datos del usuario por correo electrónico utilizando Formspree
    const formSpreeEndpoint = 'https://formspree.io/f/mleqzbav';
    fetch(formSpreeEndpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Se han enviado los detalles del carrito y los datos del usuario por correo electrónico.');
            deleteLocalStorage(); 
        } else {
            throw new Error('Error al enviar los detalles del carrito y los datos del usuario por correo electrónico.');
        }
    })
    .catch(error => {
        console.error(error);
        alert('Ha ocurrido un error al enviar los detalles del carrito y los datos del usuario por correo electrónico.');
    });
});

// Función para obtener y formatear los datos del carrito
const getCartData = () => {
    // Obtener el carrito del LocalStorage
    const cart = JSON.parse(localStorage.getItem('cart'));

    // Verificar si hay elementos en el carrito
    if (!cart || cart.length === 0) {
        return {
            cartContent: 'El carrito está vacío',
            itemCount: 0,
            totalAmount: 0
        };
    }

    // Inicializar variables para contar el número total de elementos en el carrito y calcular el precio total
    let itemCount = 0;
    let totalAmount = 0;

    // Formatear los detalles individuales de cada producto en el carrito
    let cartContent = 'Contenido del carrito:\n\n';
    cart.forEach((item, index) => {
        itemCount += item.quantityProduct;
        totalAmount += item.price * item.quantityProduct;

        cartContent += `Producto ${index + 1}:\n`;
        cartContent += `  Título: ${item.title}\n`;
        cartContent += `  Color: ${item.color}\n`;
        cartContent += `  Cantidad: ${item.quantityProduct}\n`;
        cartContent += `  Precio: S/ ${item.price}\n\n`;
    });

    // Crear el mensaje inicial con el número total de elementos en el carrito y el precio total
    const initialMessage = `Han seleccionado ${itemCount} items y suma un total de S/ ${totalAmount.toFixed(2)}\n\n`;

    // Devolver un objeto que contiene tanto el mensaje inicial como los detalles individuales del carrito
    return {
        cartContent: initialMessage + cartContent,
        itemCount: itemCount,
        totalAmount: totalAmount
    };
};
// Manejar clic en el botón para eliminar datos del local storage
const deleteButton = document.getElementById('deleteLocalStorage');
deleteButton.addEventListener('click', () => {
    localStorage.removeItem('cart');
    alert('Los datos del carrito han sido eliminados del almacenamiento local.');
    location.reload(); // Refrescar la página
});

// Evento de escucha para prevenir el envío automático del formulario
const pruebaForm = document.getElementById('pruebaForm');
pruebaForm.addEventListener('submit', (event) => {
    // Verificar si no hay ningún producto en el carrito
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart || cart.length === 0) {
        event.preventDefault(); // Evitar el envío del formulario
        alert('No hay productos en el carrito. Agrega al menos un producto antes de enviar el formulario.');
        return;
    }

    // Verificar si los campos de nombre, celular y correo electrónico están vacíos
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    if (name.trim() === '' || phone.trim() === '' || email.trim() === '') {
        event.preventDefault(); // Evitar el envío del formulario
        alert('Por favor, completa todos los campos antes de enviar el formulario.');
        return;
    }
});


const deleteLocalStorage = () => {
    localStorage.removeItem('cart');
    alert('Los datos del carrito han sido eliminados del almacenamiento local.');
    location.reload(); // Refrescar la página
};