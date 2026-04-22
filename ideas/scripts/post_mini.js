async function renderPostMini(postName, slot) {
    
    const element = document.getElementById(slot);
    const img = element.querySelector('.post_img');
    const title = element.querySelector('.post_header h2');
    const preview = element.querySelector('.post_preview p');
    const tags = element.querySelector('.post_tags');

    try {
        
        const postFetch = await fetch(`../posts/${postName}.html`);
        if (!postFetch.ok) throw new Error("FETCH_FAILED");
        const postHtmlText = await postFetch.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(postHtmlText, 'text/html');

        const getMeta = (name) => {
            const meta = doc.querySelector(`meta[name="${name}"]`);
            return meta ? meta.getAttribute('content') : "";
        };

        const postTitle = getMeta('title');
        const postPreview = getMeta('preview');
        const postTags = getMeta('tags');

        title.innerHTML = `<a href="post.html?id=${postName}">${postTitle || "No title"}</a>`;

        preview.textContent = postPreview || ""; 

        tags.innerHTML = ''; 
        if (postTags) {
            const tagsArray = postTags.split(',');
            tagsArray.forEach(tag => {
                const li = document.createElement('li');
                li.textContent = tag.trim();
                tags.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "#";
            tags.appendChild(li);
        }

    } catch (error) {
        if (title) {
            title.textContent = error.message === "FETCH_FAILED" 
                ? "Error: .html file missing" 
                : "Unknown error";
        }
    }

    try {
        const postImg = await fetch(`../posts/${postName}.png`);
        if (!postImg.ok) throw new Error("IMG_ERROR");
        img.src = `../posts/${postName}.png`;
        img.style.display = 'block';
    } catch (error) {
        if (img) {
            img.src = `../posts/error.png`;
            img.style.display = 'block';
        }
    }
}