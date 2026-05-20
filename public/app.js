const API_URL = '/api/problems';

// 1. Veritabanındaki tüm problemleri çekip ekrana basar (GET)
async function fetchProblems() {
    const res = await fetch(API_URL);
    const data = await res.json();
    const list = document.getElementById('problems-list');
    list.innerHTML = '';
    
    data.forEach(p => {
        list.innerHTML += `
            <div class="card">
                <div class="card-header">
                    <h3>${p.title}</h3>
                    <span class="badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                </div>
                <p><strong>Konu:</strong> ${p.topic}</p>
                <pre><code>${p.code}</code></pre>
                <button onclick="deleteProblem(${p.id})" class="delete-btn">Sil</button>
            </div>
        `;
    });
}

// 2. Yeni problem ekler (POST)
async function addProblem() {
    const title = document.getElementById('title').value;
    const difficulty = document.getElementById('difficulty').value;
    const topic = document.getElementById('topic').value;
    const code = document.getElementById('code').value;

    if(!title) return alert("Problem adı zorunludur!");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, difficulty, topic, code })
    });

    // Ekledikten sonra inputları temizle ve listeyi yenile
    document.getElementById('title').value = '';
    document.getElementById('difficulty').value = '';
    document.getElementById('topic').value = '';
    document.getElementById('code').value = '';
    fetchProblems();
}

// 3. Problemi siler (DELETE)
async function deleteProblem(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchProblems();
}

// Sayfa ilk yüklendiğinde verileri getir
fetchProblems();