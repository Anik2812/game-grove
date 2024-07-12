let currentDate = new Date();
let events = [
    { date: '2024-07-15', title: 'Board Game Tournament', time: '19:00', location: 'Main Hall', description: 'Join us for an exciting board game tournament!', image: 'https://plus.unsplash.com/premium_vector-1682300723506-a8b852aeb1a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pbi1zYW1lLXNlcmllc3wyfHx8ZW58MHx8fHx8' },
    { date: '2024-07-20', title: 'Boba Tea Tasting Night', time: '18:00', location: 'Cafe Area', description: 'Try our new boba tea flavors while playing your favorite games.', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { date: '2024-07-25', title: 'Strategy Game Workshop', time: '17:00', location: 'Workshop Room', description: 'Learn advanced strategies for popular board games.', image: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3RyYXRlZ3klMjBnYW1lfGVufDB8fDB8fHww' }
];

function renderCalendar() {
    const calendarBody = document.querySelector('.calendar-body');
    const currentMonthElement = document.getElementById('currentMonth');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonthElement.textContent = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let html = `<table>
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                    <tr>`;

    for (let i = 0; i < firstDay.getDay(); i++) {
        html += '<td></td>';
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        if ((day + firstDay.getDay() - 1) % 7 === 0) {
            html += '</tr><tr>';
        }
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const isToday = date.toDateString() === new Date().toDateString() ? 'class="today"' : '';
        const hasEvent = events.some(event => event.date === dateString) ? 'class="has-event"' : '';
        html += `<td ${isToday} ${hasEvent} data-date="${dateString}">${day}</td>`;
    }

    html += '</tr></table>';
    calendarBody.innerHTML = html;

    calendarBody.querySelectorAll('td[data-date]').forEach(cell => {
        cell.addEventListener('click', () => showEventModal(cell.dataset.date));
    });
}

function showEventModal(date) {
    const eventModal = document.getElementById('eventModal');
    const eventDetails = document.getElementById('eventDetails');
    const eventsOnDate = events.filter(event => event.date === date);

    if (eventsOnDate.length > 0) {
        const event = eventsOnDate[0]; // Showing only the first event for simplicity
        eventDetails.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <h2 class="event-title">${event.title}</h2>
            <p class="event-info"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p class="event-info"><strong>Time:</strong> ${event.time}</p>
            <p class="event-info"><strong>Location:</strong> ${event.location}</p>
            <p class="event-description">${event.description}</p>
        `;
        eventModal.style.display = 'block';
    } else {
        alert('No events on this date');
    }
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Close modal when clicking outside or on the close button
window.onclick = function(event) {
    const modal = document.getElementById('eventModal');
    if (event.target === modal || event.target.className === 'close') {
        modal.style.display = 'none';
    }
}

// Initialize calendar when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', renderCalendar);

// Add event listener for the close button
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('eventModal').style.display = 'none';
});