// Ophalen opgeslagen cliënten
let clienten = JSON.parse(localStorage.getItem('clienten')) || [];

const form = document.getElementById('new-client-form');
const dropdown = document.getElementById('client-dropdown');

// Bij het laden: dropdown vullen
window.addEventListener('DOMContentLoaded', () => {
  sorteerEnVulDropdown();
});

// Nieuwe cliënt toevoegen
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const naam = formData.get('naam').trim();
  const telefoon = formData.get('telefoon').trim();
  const opnamedatum = formData.get('opnamedatum');
  const reden = formData.get('eersteafspraak').trim();

  if (!naam || !opnamedatum) return alert('Vul alle velden correct in.');

  const id = Date.now(); // unieke ID op tijd
  const bestandsnaam = `client-${id}-${naam.replace(/\s+/g, '_')}.html`;

  const nieuweClient = { id, naam, telefoon, opnamedatum, reden, bestandsnaam };
  clienten.push(nieuweClient);
  localStorage.setItem('clienten', JSON.stringify(clienten));

  genereerClientDossier(nieuweClient); // HTML maken
  sorteerEnVulDropdown();
  form.reset();

  window.open(bestandsnaam, '_blank');
});

function sorteerEnVulDropdown() {
  dropdown.innerHTML = '<option>Kies een cliënt...</option>';

  clienten
    .sort((a, b) => new Date(b.opnamedatum) - new Date(a.opnamedatum))
    .forEach(cli => {
      const opt = document.createElement('option');
      opt.value = cli.bestandsnaam;
      opt.textContent = `${cli.naam} – ${cli.opnamedatum}`;
      dropdown.appendChild(opt);
    });
}

dropdown.addEventListener('change', () => {
  const bestand = dropdown.value;
  if (bestand && bestand !== 'Kies een cliënt...') {
    window.open(bestand, '_blank');
  }
});

// HTML genereren voor cliëntdossier
function genereerClientDossier(cli) {
  const inhoud = `
  <!DOCTYPE html>
  <html lang="nl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dossier – ${cli.naam}</title>
    <style>
      body { font-family: sans-serif; padding: 2em; background: #f5faff; color: #0d47a1; }
      h1 { color: #0d47a1; }
      section { background: white; border: 3px solid #ffeb3b; padding: 1.5em; border-radius: 8px; margin-bottom: 2em; }
      label { font-weight: bold; display: block; margin-top: 1em; }
    </style>
  </head>
  <body>
    <h1>🩺 Dossier van ${cli.naam}</h1>

    <section>
      <h2>Persoonsgegevens</h2>
      <p><strong>Naam:</strong> ${cli.naam}</p>
      <p><strong>Telefoonnummer:</strong> ${cli.telefoon}</p>
      <p><strong>Opnamedatum:</strong> ${cli.opnamedatum}</p>
    </section>

    <section>
      <h2>📝 Eerste afspraak</h2>
      <p><strong>Reden:</strong> ${cli.reden}</p>
      <p><em>Vul hier extra informatie aan...</em></p>
    </section>

    <section>
      <h2>Medisch beleid</h2>
      <p><em>Nog niet ingevuld</em></p>
    </section>

    <section>
      <h2>Medische voorgeschiedenis</h2>
      <p><em>Nog niet ingevuld</em></p>
    </section>

    <section>
      <h2>Afsprakenlijst</h2>
      <ul><li>${cli.opnamedatum}: ${cli.reden}</li></ul>
    </section>
  </body>
  </html>`;

  const blob = new Blob([inhoud], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = cli.bestandsnaam;
  link.click();
}
