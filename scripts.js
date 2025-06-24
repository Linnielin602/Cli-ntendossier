// 📦 Ophalen bestaande cliënten uit localStorage
let clienten = JSON.parse(localStorage.getItem('clienten')) || [];

const form = document.getElementById('new-client-form');
const dropdown = document.getElementById('client-dropdown');

// 🔁 Bij het laden: dropdown vullen
window.addEventListener('DOMContentLoaded', () => {
  vulDropdown();
});

// 🧾 Formulier voor nieuwe cliënt
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const naam = formData.get('naam').trim();
  const telefoon = formData.get('telefoon').trim();
  const opnamedatum = formData.get('opnamedatum');
  const reden = formData.get('eersteafspraak').trim();

  if (!naam || !telefoon || !opnamedatum || !reden) {
    alert('Vul alle velden volledig in.');
    return;
  }

  const id = Date.now(); // unieke ID
  const nieuweClient = { id, naam, telefoon, opnamedatum, reden };

  clienten.push(nieuweClient);
  localStorage.setItem('clienten', JSON.stringify(clienten));

  vulDropdown();
  form.reset();

  // 🚀 Doorsturen naar dossierpagina
  window.location.href = `dossier.html?id=${id}`;
});

// 📥 Dropdown vullen met bestaande cliënten (gesorteerd op opnamedatum)
function vulDropdown() {
  dropdown.innerHTML = '<option>Kies een cliënt...</option>';

  clienten
    .sort((a, b) => new Date(b.opnamedatum) - new Date(a.opnamedatum))
    .forEach(cli => {
      const opt = document.createElement('option');
      opt.value = cli.id;
      opt.textContent = `${cli.naam} – ${cli.opnamedatum}`;
      dropdown.appendChild(opt);
    });
}

// 📂 Doorverwijzen naar dossierpagina bij selectie
dropdown.addEventListener('change', () => {
  const gekozenId = dropdown.value;
  if (gekozenId && gekozenId !== 'Kies een cliënt...') {
    window.location.href = `dossier.html?id=${gekozenId}`;
  }
});
