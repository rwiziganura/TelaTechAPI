const API = '/api/clients';

async function fetchClients(){
  const res = await fetch(API);
  const data = await res.json();
  renderClients(Array.isArray(data)?data:[]);
}

function renderClients(clients){
  const tbody = document.querySelector('#clients-table tbody');
  tbody.innerHTML = '';
  clients.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${escapeHtml(c.names)}</td>
      <td>${escapeHtml(c.sex)}</td>
      <td>${escapeHtml(c.address||'')}</td>
      <td>${escapeHtml(c.phone)}</td>
      <td>${escapeHtml(c.email)}</td>
      <td class="actions">
        <button class="btn-small" data-edit="${c.id}">Edit</button>
        <button class="btn-small" data-delete="${c.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s){
  if(s===null||s===undefined) return '';
  return String(s).replace(/[&<>"']/g, ch=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"
  }[ch]));
}

async function submitForm(e){
  e.preventDefault();
  const id = document.getElementById('client-id').value;
  const payload = {
    names: document.getElementById('names').value.trim(),
    sex: document.getElementById('sex').value,
    address: document.getElementById('address').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim()
  };

  try{
    let res;
    if(id){
      res = await fetch(`${API}/${id}`,{
        method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
      });
    } else {
      res = await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    }
    const json = await res.json();
    showMessage(json.message || json.error || 'Saved');
    resetForm();
    fetchClients();
  }catch(err){
    showMessage('Network error', true);
  }
}

function resetForm(){
  document.getElementById('client-form').reset();
  document.getElementById('client-id').value='';
  document.getElementById('form-title').textContent='Add Client';
}

function showMessage(msg, isError){
  const el = document.getElementById('message');
  el.textContent = msg || '';
  el.style.color = isError ? '#c00' : '#0a0';
  setTimeout(()=>el.textContent='',4000);
}

document.addEventListener('click', async (e)=>{
  if(e.target.matches('[data-edit]')){
    const id = e.target.getAttribute('data-edit');
    const res = await fetch(`${API}`);
    const data = await res.json();
    const c = data.find(x=>String(x.id)===String(id));
    if(c){
      document.getElementById('client-id').value = c.id;
      document.getElementById('names').value = c.names || '';
      document.getElementById('sex').value = c.sex || 'Male';
      document.getElementById('address').value = c.address || '';
      document.getElementById('phone').value = c.phone || '';
      document.getElementById('email').value = c.email || '';
      document.getElementById('form-title').textContent='Edit Client';
    }
  }

  if(e.target.matches('[data-delete]')){
    const id = e.target.getAttribute('data-delete');
    if(!confirm('Delete client #' + id + '?')) return;
    try{
      const res = await fetch(`${API}/${id}`,{method:'DELETE'});
      const json = await res.json();
      showMessage(json.message || json.error || 'Deleted');
      fetchClients();
    }catch(err){ showMessage('Network error', true); }
  }
});

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('client-form').addEventListener('submit', submitForm);
  document.getElementById('cancel').addEventListener('click', resetForm);
  fetchClients();
});
