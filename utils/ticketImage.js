const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const generateTicketImage = async (ticketDetails) => {
  // Create a canvas (width: 600px, height: 300px)
  const canvas = createCanvas(600, 300);
  const ctx = canvas.getContext('2d');

  // Background color (light gray)
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ticket Title
  ctx.fillStyle = '#333';
  ctx.font = '30px Arial';
  ctx.fillText('Event Ticket', 200, 40);

  // Ticket details (event name, location, date, price)
  ctx.font = '20px Arial';
  ctx.fillText(`Event: ${ticketDetails.name}`, 20, 80);
  ctx.fillText(`Location: ${ticketDetails.location}`, 20, 120);
  ctx.fillText(`Date: ${ticketDetails.date}`, 20, 160);
  ctx.fillText(`Price: $${ticketDetails.price}`, 20, 200);

  // Optionally, add a custom logo or background image
  // const logo = await loadImage('path_to_logo.png');
  // ctx.drawImage(logo, 450, 50, 100, 100); // Position the logo

  // Convert canvas to buffer (image data)
  const buffer = canvas.toBuffer('image/png');

  // Save the image to a file (optional)
  fs.writeFileSync('./ticket.png', buffer);

  return buffer; // Return the image buffer
};
module.exports = { generateTicketImage };