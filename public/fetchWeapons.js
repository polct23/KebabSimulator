document.addEventListener('DOMContentLoaded', function() {
    fetchWeapons(); // Siempre tratar de obtener la versión más reciente de las armas
});

function fetchWeapons() {
    fetch('/dsaApp/abilities/getAbilities', {
        headers: {
            'Cache-Control': 'no-cache', // Indica al navegador no almacenar la respuesta en caché
            'Pragma': 'no-cache' // Compatibilidad con HTTP/1.0
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayWeapons(data); // Mostrar los datos directamente obtenidos del servidor
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Failed to load weapons from server. Please try again later.');
        });
}

function displayWeapons(data) {
    const listElement = document.getElementById('weapons-list');
    listElement.innerHTML = '';
    data.forEach(ability => {
        const card = createWeaponCard(ability);
        listElement.appendChild(card);
    });
}

function createWeaponCard(ability) {
    const card = document.createElement('div');
    card.className = 'card mb-3';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const abilityName = document.createElement('h5');
    abilityName.className = 'card-title';
    abilityName.textContent = ability.abilityName;

    const idAbility = document.createElement('h6');
    idAbility.className = 'card-subtitle mb-2 text-muted';
    idAbility.textContent = `ID: ${ability.idAbility}`;

    const description = document.createElement('p');
    description.className = 'card-text';
    description.textContent = `Description: ${ability.description}`;

    const value = document.createElement('p');
    value.className = 'card-text';
    value.textContent = `Value: ${ability.value}`;

    const price = document.createElement('p');
    price.className = 'card-text';
    price.textContent = `Price: $${ability.price}`;

    // Imagen
    const image = document.createElement('img');
    image.className = 'card-img-top';
    image.src = ability.imageURL; // URL de la imagen de la habilidad
    image.alt = ability.abilityName; // Nombre de la habilidad como texto alternativo
    image.style.maxWidth = '100px'; // Tamaño máximo de la imagen

    const buyButton = document.createElement('button');
    buyButton.className = 'btn btn-primary';
    buyButton.textContent = 'Buy';
    buyButton.onclick = function() {
        purchaseItem(ability.idAbility); // Pasar solo el ID de la habilidad
    };

    cardBody.appendChild(image); // Agregar la imagen al cuerpo de la tarjeta
    cardBody.appendChild(abilityName);
    cardBody.appendChild(idAbility);
    cardBody.appendChild(description);
    cardBody.appendChild(value);
    cardBody.appendChild(price);
    cardBody.appendChild(buyButton);

    card.appendChild(cardBody);
    return card;
}
