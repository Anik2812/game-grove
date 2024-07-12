let currentDate = new Date();
let events = [
    { date: '2024-07-15', title: 'Board Game Tournament', time: '19:00', location: 'Main Hall', description: 'Join us for an exciting board game tournament!', image: 'https://example.com/board-game-tournament.jpg' },
    { date: '2024-07-20', title: 'Boba Tea Tasting Night', time: '18:00', location: 'Cafe Area', description: 'Try our new boba tea flavors while playing your favorite games.', image: 'https://example.com/boba-tea-night.jpg' },
    { date: '2024-07-25', title: 'Strategy Game Workshop', time: '17:00', location: 'Workshop Room', description: 'Learn advanced strategies for popular board games.', image: 'https://example.com/strategy-workshop.jpg' }
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
    const eventDetails = document.getElementById('eventDetails');
    const eventsOnDate = events.filter(event => event.date === date);

    if (eventsOnDate.length > 0) {
        const event = eventsOnDate[0]; // Showing only the first event for simplicity
        eventDetails.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <h2 class="event-title">${event.title}</h2>
            
            <p class="event-info"><strong>Time:</strong> ${event.time}</p>
            <p class="event-info"><strong>Location:</strong> ${event.location}</p>
            <p class="event-description">${event.description}</p>
        `;
        document.getElementById('eventModal').style.display = 'block';
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

window.onclick = function(event) {
    if (event.target.className === 'modal' || event.target.className === 'close') {
        document.getElementById('eventModal').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', renderCalendar);