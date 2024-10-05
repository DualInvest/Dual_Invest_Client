export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = (hours % 12) || 12; // Convert hours to 12-hour format
    const formattedHours = hours.toString().padStart(2, '0');
    return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${period}`;
}
