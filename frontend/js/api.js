let currentTable = null;
let currentColumns = null;

async function loadTables() {
  try {
    const res = await fetch('http://localhost:4000/tables/all');
    const data = await res.json();
    const allTDiv = document.querySelector('.allT');
    allTDiv.innerHTML = '';

    data.tables.forEach(tableName => {
      const div = document.createElement('div');
      div.textContent = tableName;
      div.className = 'table-item';
      div.addEventListener('click', () => showTableStructure(tableName));
      allTDiv.appendChild(div);
    });
  } catch (error) {
    console.error('Failed to load tables:', error);
  }
}

loadTables();

async function showTableStructure(tableName) {
  try {
    const res = await fetch(`http://localhost:4000/tables/structure/${tableName}`);
    const data = await res.json();

    currentTable = tableName;
    currentColumns = data.columns;

    const tableContent = document.querySelector('.table-content');
    tableContent.innerHTML = '';

    const insertBtn = document.createElement('button');
    insertBtn.textContent = 'Insert record';
    insertBtn.addEventListener('click', () => openInsertModal(tableName, data.columns));
    tableContent.appendChild(insertBtn);

    const title = document.createElement('h2');
    tableContent.appendChild(title);

    const table = document.createElement('table');
    table.className = 'structure-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    data.columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.Field;
      headerRow.appendChild(th);
    });
    const actionTh = document.createElement('th');
    actionTh.textContent = 'Actions';
    headerRow.appendChild(actionTh);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    tableContent.appendChild(table);

    fetchTableRecords(tableName, tbody, data.columns);
  } catch (error) {
    console.error('Failed to load table structure:', error);
  }
}

async function fetchTableRecords(tableName, tbody, columns) {
  try {
    const res = await fetch(`http://localhost:4000/tables/records/${tableName}`);
    const data = await res.json();

    tbody.innerHTML = '';

    data.records.forEach(record => {
      const row = document.createElement('tr');
      columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = record[col.Field];
        row.appendChild(td);
      });

      const actionTd = document.createElement('td');
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => deleteRecord(tableName, record.id));
      actionTd.appendChild(delBtn);
      row.appendChild(actionTd);

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Failed to fetch records:', error);
  }
}

async function deleteRecord(tableName, id) {
  try {
    await fetch(`http://localhost:4000/tables/delete/${tableName}/${id}`, { method: 'DELETE' });
    showTableStructure(tableName);
  } catch (error) {
    console.error('Delete failed:', error);
  }
}

function setModalMode(mode) {
  const tableLabel = document.querySelector('label[for="table"]');
  const tableInput = document.getElementById('table');
  const addFieldBtn = document.getElementById('addFieldBtn');
  const modalTitle = document.querySelector('#modal .modal-content h2');
  const submitBtn = document.querySelector('#tableForm button[type="submit"]');

  if (mode === 'create') {
    modalTitle.textContent = 'Create Table';
    tableLabel.style.display = 'block';
    tableInput.style.display = 'block';
    addFieldBtn.style.display = 'inline-block';
    if (submitBtn) submitBtn.textContent = 'Create Table';
  } else if (mode === 'insert') {
    modalTitle.textContent = 'Insert Record';
    tableLabel.style.display = 'none';
    tableInput.style.display = 'none';
    addFieldBtn.style.display = 'none';
    if (submitBtn) submitBtn.textContent = 'Insert record';
  }
}

function openInsertModal(tableName, columns) {
  setModalMode('insert');

  const fieldsDiv = document.querySelector('.fields');
  fieldsDiv.innerHTML = '';

  columns.forEach(col => {
    if (col.Extra === 'auto_increment' || col.Field === 'createdAt' || col.Field === 'updatedAt') return;

    const fieldRow = document.createElement('div');
    fieldRow.className = 'field-row';

    const label = document.createElement('label');
    label.textContent = col.Field;

    const input = document.createElement('input');
    input.name = col.Field;

    fieldRow.appendChild(label);
    fieldRow.appendChild(input);
    fieldsDiv.appendChild(fieldRow);
  });

  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');

  const form = document.getElementById('tableForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const values = {};
    formData.forEach((value, key) => {
      if (key !== 'table') values[key] = value;
    });

    try {
      await fetch(`http://localhost:4000/tables/insert/${tableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values })
      });
      modal.classList.add('hidden');
      showTableStructure(tableName);
    } catch (error) {
      console.error('Insert failed:', error);
    }
  };
}

document.getElementById('openFormBtn').addEventListener('click', () => {
  setModalMode('create');

  const fieldsDiv = document.querySelector('.fields');
  fieldsDiv.innerHTML = `
    <div class="field-row">
      <div>
        <label for="field">Field Name</label>
        <input placeholder="Field name" name="field[]">
      </div>
      <div>
        <label for="type">Type</label>
        <input placeholder="type" name="type[]">
      </div>
    </div>
  `;

  document.getElementById('modal').classList.remove('hidden');

  const form = document.getElementById('tableForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    const tableName = document.getElementById('table').value;
    const fieldNames = document.getElementsByName('field[]');
    const types = document.getElementsByName('type[]');
    const fields = [];
    fieldNames.forEach((fieldInput, idx) => {
      const typeInput = types[idx];
      if (fieldInput.value && typeInput.value) {
        fields.push({ name: fieldInput.value, type: typeInput.value });
      }
    });

    try {
      await fetch('http://localhost:4000/tables/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName, fields })
      });
      document.getElementById('modal').classList.add('hidden');
      loadTables();
    } catch (error) {
      console.error('Create table failed:', error);
    }
  };
});

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});
