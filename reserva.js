class RoomType {
  constructor(name, description, maxGuests, price) {
      this.name = name;
      this.description = description;
      this.maxGuests = maxGuests;
      this.price = price;
  }
}

class Room {
  constructor(number, roomType) {
      this.number = number;
      this.roomType = roomType;
      this.isAvailable = true;
  }
 // criação de classes : room type para definir as caracteristicas dos tipos de quartos e room que representa um quarto especifico 
 // com seu respectivo número. devia ter adotado herança para a criaçaõ de subclasses para cada qaurto! -markus coment
  

  async book(bookingData) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const nameRegex = /^[a-zA-Z\s]+$/;
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

              if (!nameRegex.test(bookingData.fullName)) {
                  reject(new Error('Nome inválido.')); // Verificação de nome -markus coment.
                  return;
              }
// uso de promise para tratar a reserva de modo assincrono -markus coment
              if (!emailRegex.test(bookingData.email)) {
                  reject(new Error('Email inválido.')); // Verificação de email -markus coment.
                  return;
              }

              if (this.isAvailable) {
                  this.isAvailable = false;
                  console.log(`Reserva confirmada para o quarto ${this.number} para ${bookingData.fullName}.`);
                  console.log(`Email: ${bookingData.email}, Telefone: ${bookingData.phone}, Pedidos Especiais: ${bookingData.specialRequests}`);
                  resolve();
              } else {
                  reject(new Error('Este quarto já está reservado.'));
              }
          }, 1000);
      });
  }

  async cancelBooking() {
      return new Promise((resolve) => {
          setTimeout(() => {
              this.isAvailable = true;
              console.log(`Reserva cancelada para o quarto ${this.number}`);
              resolve();
          }, 1000);
      });
  }
}


// metodos de reserva: book e cancelbooking. validação bem feita dos dados utlizando regex e tratamento de erros usando o regect
// - markus coment.

class RoomListView {
  constructor(roomListElement, onBookClick, onCancelBookingClick) {
      this.roomListElement = roomListElement;
      this.onBookClick = onBookClick;
      this.onCancelBookingClick = onCancelBookingClick;
  }

  renderRooms(rooms) {
      this.roomListElement.innerHTML = '';
      rooms.forEach(room => {
          const roomElement = document.createElement('div');
          roomElement.className = `room ${room.isAvailable ? 'available' : 'unavailable'}`;
          roomElement.innerHTML = `
              <h3>${room.roomType.name} - Quarto ${room.number}</h3>
              <p>${room.roomType.description}</p>
              <p>Preço: R$${room.roomType.price.toFixed(2)}</p>
              <p>Máx. Hóspedes: ${room.roomType.maxGuests}</p>
              <p>Disponibilidade: ${room.isAvailable ? 'Disponível' : 'Indisponível'}</p>
              ${room.isAvailable ? '<button class="book-btn">Reservar</button>' : '<button class="cancel-booking-btn">Cancelar Reserva</button>'}
          `;
          const bookBtn = roomElement.querySelector('.book-btn');
          const cancelBookingBtn = roomElement.querySelector('.cancel-booking-btn');
          if (bookBtn) {
              bookBtn.addEventListener('click', () => this.onBookClick(room));
          }
          if (cancelBookingBtn) {
              cancelBookingBtn.addEventListener('click', () => this.onCancelBookingClick(room));
          }
          this.roomListElement.appendChild(roomElement);
      });
  }
}

// manipulação de doom roomlistview responsavel por disponibilizar a lista de quartos disponiveis no DOOM, innerhtml para exibiçaõ
// atualização de reservas do doom atravez da funçao renderooms -markus coment


// driver principal que gerencia o usuario ao sistema de reservas -markus coment
class BookingController {
  constructor(roomListElement, searchFormElement, bookingModalElement) {
      this.roomListElement = roomListElement;
      this.searchFormElement = searchFormElement;
      this.bookingModalElement = bookingModalElement;
      this.rooms = [
          new Room(1, new RoomType('Simples', 'Quarto Simples, ideal para viajantes sozinhos.', 2, 100)),
          new Room(2, new RoomType('Duplo', 'Quarto Duplo com cama de casal, perfeito para casais.', 4, 150)),
          new Room(3, new RoomType('Triplo', 'Quarto Triplo, acomoda até três pessoas.', 6, 200)),
          new Room(4, new RoomType('Luxo', 'Quarto Luxuoso com vista, inclui amenities especiais.', 2, 300)),
          new Room(5, new RoomType('Familiar', 'Quarto Familiar com espaço para até cinco pessoas.', 5, 250)),
          new Room(6, new RoomType('Executivo', 'Quarto Executivo com área de trabalho e conforto.', 2, 400)),
          new Room(7, new RoomType('Premium', 'Quarto Premium com spa e serviços personalizados.', 2, 500)),
          new Room(8, new RoomType('Presidencial', 'Quarto Presidencial com jacuzzi e vista panorâmica.', 4, 1000)),
          new Room(9, new RoomType('Estúdio', 'Estúdio com cozinha e sala de estar, ideal para estadias longas.', 3, 450)),
          new Room(10, new RoomType('Cottage', 'Cottage rústico, perfeito para relaxar em meio à natureza.', 2, 350)),
      ];
      this.roomListView = new RoomListView(this.roomListElement, this.handleBookClick.bind(this), this.handleCancelBookingClick.bind(this));
      this.searchFormElement.addEventListener('submit', this.handleSearchFormSubmit.bind(this));
      this.bookingModalElement.querySelector('.close-modal').addEventListener('click', this.closeBookingModal.bind(this));
      this.bookingModalElement.querySelector('#confirmBookingBtn').addEventListener('click', this.handleConfirmBooking.bind(this));

      // validaçaõ real do emaill e numero do telefone -markus coment.
      this.bookingModalElement.querySelector('#email').addEventListener('input', this.validateEmail.bind(this));
      this.bookingModalElement.querySelector('#phone').addEventListener('input', this.validatePhone.bind(this));
  }

  async handleSearchFormSubmit(event) {
      event.preventDefault();
      const checkinDate = new Date(this.searchFormElement.elements.checkin.value);
      const checkoutDate = new Date(this.searchFormElement.elements.checkout.value);
      const guests = parseInt(this.searchFormElement.elements.guests.value, 10);

      if (checkinDate >= checkoutDate) {
          alert('A data de check-in deve ser anterior à de check-out.');
          return;
      }

      const availableRooms = this.rooms.filter(room => room.isAvailable && room.roomType.maxGuests >= guests);
      this.roomListView.renderRooms(availableRooms);
  }

  // controlador de reservas bookingcontroller. utilização do metodo handleSearchformsubmit para filtrar a lista de qaurtos disponiveis
  // com base do n de hospedes e quartos disponiveis, uso da funçao matriz filter para buscar info
  // muito uso de metodos async e await no book e cancelbooking para agilizar -markus coment

  async handleBookClick(room) {
      this.bookingModalElement.style.display = 'block';
      this.bookingModalElement.querySelector('#fullName').focus();
      this.selectedRoom = room;

      // calcular o custo total -markus coment
      const checkinDate = new Date(this.searchFormElement.elements.checkin.value);
      const checkoutDate = new Date(this.searchFormElement.elements.checkout.value);
      const totalDays = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
      const totalCost = room.roomType.price * totalDays;
      this.bookingModalElement.querySelector('#totalCost').textContent = totalCost.toFixed(2);
  }

  async handleCancelBookingClick(room) {
      if (confirm('Deseja cancelar a reserva do quarto?')) {
          try {
              await room.cancelBooking();
              this.roomListView.renderRooms(this.rooms);
              alert('Reserva cancelada com sucesso.');
          } catch (error) {
              console.error(error);
          }
      }
  }

  async handleConfirmBooking() {
      const fullName = this.bookingModalElement.querySelector('#fullName').value;
      const email = this.bookingModalElement.querySelector('#email').value;
      const phone = this.bookingModalElement.querySelector('#phone').value;
      const specialRequests = this.bookingModalElement.querySelector('#specialRequests').value;

      if (!fullName || !email || !phone) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
      }

      try {
          await this.selectedRoom.book({ fullName, email, phone, specialRequests });
          this.roomListView.renderRooms(this.rooms);
          this.closeBookingModal();
          alert('Reserva confirmada com sucesso!');  // Feedback visual -markus coemnt
          this.bookingModalElement.querySelector('#modalMessage').textContent = 'Reserva realizada com sucesso!';
      } catch (error) {
          console.error(error);
          this.bookingModalElement.querySelector('#modalMessage').textContent = error.message;
      }
  }

  validateEmail() {
      const emailInput = this.bookingModalElement.querySelector('#email');
      const emailError = this.bookingModalElement.querySelector('#emailError');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailInput.value)) {
          emailError.style.display = 'block';
      } else {
          emailError.style.display = 'none';
      }
  }

  validatePhone() {
      const phoneInput = this.bookingModalElement.querySelector('#phone');
      const phoneError = this.bookingModalElement.querySelector('#phoneError');
      const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

      if (!phoneRegex.test(phoneInput.value)) {
          phoneError.style.display = 'block';
      } else {
          phoneError.style.display = 'none';
      }
  }

  // validação em tempo real do email e numero do telefone -markus coment

  closeBookingModal() {
      this.bookingModalElement.style.display = 'none';
      this.bookingModalElement.querySelector('#fullName').value = '';
      this.bookingModalElement.querySelector('#email').value = '';
      this.bookingModalElement.querySelector('#phone').value = '';
      this.bookingModalElement.querySelector('#specialRequests').value = '';
      this.bookingModalElement.querySelector('#modalMessage').textContent = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const roomListElement = document.querySelector('.room-list');
  const searchFormElement = document.getElementById('searchForm');
  const bookingModalElement = document.getElementById('bookingModal');
  new BookingController(roomListElement, searchFormElement, bookingModalElement);
});

// incialização
