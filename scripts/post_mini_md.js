async function renderPostMini(postName, slot) {
    
    const element = document.getElementById(slot);
    
    const img = element.querySelector('.post_img');
    const title = element.querySelector('.post_header h2');
    const preview = element.querySelector('.post_preview p');
    const tags = element.querySelector('.post_tags');

    try {
        
        const postFetch = await fetch(`../posts/${postName}.md`);
        if (!postFetch.ok) throw new Error("FETCH_FAILED");
        const postText = await postFetch.text();

        const parts = postText.split('---');
        const metaPart = parts[1];
        // const bodyPart = parts.slice(2).join('---');

        const metadata = {};
        metaPart.split('\n').forEach(
            line => {
                const [key, value] = line.split(':');
                if (key && value)  {
                    metadata[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
                }
            }
        );

        title.innerHTML = `<a href="post.html?id=${postName}">${metadata.title || "No title"}</a>`;
        // preview.textContent = metadata.preview || "";
        preview.innerHTML = marked.parse(metadata.preview) || "";

        tags.innerHTML = ''; 
        if (metadata.tags) {

            const tagsArray = metadata.tags.split(',');
            
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
        switch (true) {
            case error.message.includes("FETCH_FAILED"):
                if (title) title.textContent = "Error: .md file missing";
                break;
            default:
                if (title) title.textContent = "Unknown error";
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