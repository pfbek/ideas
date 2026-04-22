async function loadArchive() {
    try {
        const postsFetch = await fetch('../posts/posts.json');
        const postsAll = await postsFetch.json();

        const container = document.querySelector('.middle');
        const postElement = document.querySelector('.post').cloneNode(true);
        const leftBar = document.querySelector('.left_bar');

        container.innerHTML = '';
        const allTags = new Set();

        postsAll.forEach(post => {
            
            const clone = postElement.cloneNode(true);
            
            clone.querySelector('h2').innerHTML = `<a href="post.html?id=${post.fileName.replace('.html', '')}">${post.title || "No title"}</a>`;

            clone.querySelector('.post_preview p').innerHTML = post.preview || "";
            
            clone.setAttribute('post_tags_label', (post.tags || "").toLowerCase());

            const tagsList = clone.querySelector('.post_tags');
            tagsList.innerHTML = '';
            
            if (post.tags) {
                post.tags.split(',').forEach(tag => {
                    const cleanTag = tag.trim();
                    if (cleanTag) {
                        allTags.add(cleanTag);
                        const li = document.createElement('li');
                        li.textContent = cleanTag;
                        tagsList.appendChild(li);
                    }
                });
            }

            container.appendChild(clone);
        });

        // --- Reszta kodu (lewy pasek, wyszukiwarka i filtry) pozostaje bez zmian ---
        leftBar.innerHTML = '';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'search tag...';
        searchInput.className = 'tag-search-input';
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.tag-filter-btn').forEach(btn => {
                if (btn.textContent === "All") return; 
                const isMatch = btn.textContent.toLowerCase().includes(term);
                btn.style.display = isMatch ? 'inline-block' : 'none';
            });
        };
        leftBar.appendChild(searchInput);

        allTags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.textContent = tag;
            tagButton.className = 'tag-filter-btn';
            tagButton.onclick = function() { filterPosts(tag.toLowerCase(), this); };
            leftBar.appendChild(tagButton);
        });

        const resetButton = document.createElement('button');
        resetButton.textContent = "All";
        resetButton.className = 'tag-filter-btn';
        resetButton.onclick = function() { filterPosts('all', this); };
        leftBar.prepend(resetButton);

    } catch (err) {
        console.error('Błąd ładowania danych:', err);
    }    
}

function filterPosts(selectedTag, clickedButton) {
    // 1. Usuń klasę 'active' ze wszystkich przycisków
    document.querySelectorAll('.tag-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 2. Dodaj klasę 'active' do klikniętego przycisku
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    // 3. Reszta Twojej logiki filtrowania...
    const allPosts = document.querySelectorAll('.post');
    allPosts.forEach(post => {
        const postTags = post.getAttribute('post_tags_label');
        const isVisible = selectedTag === 'all' || postTags.split(',').map(t => t.trim()).includes(selectedTag);
        post.style.display = isVisible ? 'block' : 'none';
    });
}