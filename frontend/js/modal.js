document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openFormBtn');
  const closeBtn = document.getElementById('closeModal');
  const modal = document.getElementById('modal');

  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
});
