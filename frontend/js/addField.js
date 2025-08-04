document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addFieldBtn').addEventListener('click', function() {
    const fieldsContainer = document.querySelector('.fields');

    const newFieldRow = document.createElement('div');
    newFieldRow.className = 'field-row';
    newFieldRow.innerHTML = `
      <div>
        <label>Field Name</label>
        <input placeholder="Field name" name="field[]">
      </div>
      <div>
        <label>Type</label>
        <input placeholder="type" name="type[]">
      </div>
    `;
    fieldsContainer.appendChild(newFieldRow);
  });
});
