document.addEventListener('DOMContentLoaded', () => {
    const problemForm = document.getElementById('problemForm');
    const problemsTableBody = document.getElementById('problemsTableBody');

    fetchProblems();

    async function fetchProblems() {
        try {
            const res = await fetch('/api/problems');
            const data = await res.json();
            renderProblems(data);
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    }

    function renderProblems(problems) {
        problemsTableBody.innerHTML = '';
        problems.forEach(prob => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prob.title}</td>
                <td>${prob.topic || 'N/A'}</td>
                <td><span class="badge ${prob.difficulty.toLowerCase()}">${prob.difficulty}</span></td>
                <td>
                    <button class="btn-action btn-delete" data-id="${prob.id}">Delete</button>
                </td>
            `;
            problemsTableBody.appendChild(row);
        });
    }

    problemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const topic = document.getElementById('topic').value;
        const difficulty = document.getElementById('difficulty').value;
        const code = document.getElementById('code').value;

        try {
            const res = await fetch('/api/problems', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, topic, difficulty, code })
            });

            if (res.ok) {
                problemForm.reset();
                fetchProblems();
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error}`);
            }
        } catch (error) {
            console.error('Error creating problem:', error);
        }
    });

    problemsTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.getAttribute('data-id');
            try {
                const res = await fetch(`/api/problems/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchProblems();
                }
            } catch (error) {
                console.error('Error deleting problem:', error);
            }
        }
    });
});