async function loadFullPost() {
    
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        document.getElementById('full_post_header').textContent = "Post not found";
        return;
    }

    try {
        
        const postFetch = await fetch(`../posts/${postId}.html`);
        if (!postFetch.ok) throw new Error("FILE_NOT_FOUND");
        
        const postHtmlText = await postFetch.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(postHtmlText, 'text/html');


        const postStyle = doc.querySelector('style');
        if (postStyle) {
            // Usuwamy stare style posta (jeśli istnieją), by się nie dublowały przy przechodzeniu między postami
            const oldStyle = document.getElementById('dynamic-post-style');
            if (oldStyle) oldStyle.remove();

            // Tworzymy nową kopię stylu i dodajemy do <head>
            const newStyle = postStyle.cloneNode(true);
            newStyle.id = 'dynamic-post-style';
            document.head.appendChild(newStyle);
        }

        const postTitle = doc.querySelector('meta[name="title"]')?.getAttribute('content') || "No title";
        const postContent = doc.querySelector('.post_html')?.outerHTML || "Brak treści posta";

        document.getElementById('full_post_header').innerHTML = `<h2>${postTitle}</h2>`;
        document.getElementById('full_post_body').innerHTML = postContent;
        
        document.title = postTitle;

    } catch (error) {
        console.error(error);
        const header = document.getElementById('full_post_header');
        if (header) {
            header.textContent = error.message === "FILE_NOT_FOUND" ? "Post nie istnieje" : "Błąd ładowania";
        }
    }
}