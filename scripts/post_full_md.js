async function loadFullPost() {

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        document.getElementById('full_post_header').textContent = "Post not found";
        return;
    }

    try {

        const postFetch = await fetch(`../posts/${postId}.md`);
        const postText = await postFetch.text();

        const parts = postText.split('---');
        const metaPart = parts[1] || "";
        const bodyPart = parts[2] || "";

        const metadata = {};
        metaPart.split('\n').forEach(
                line => {
                    const [key, value] = line.split(':');
                    if (key && value)  {
                        metadata[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
                    }
                }
            );

        document.getElementById('full_post_header').innerHTML = `<h2>${metadata.title || "No title"}</h2>`
        document.getElementById('full_post_body').innerHTML = marked.parse(bodyPart);
        
        document.title = metadata.title;

    } catch (error) {
        console.error(error);
        document.getElementById('full_post_header').textContent = "Błąd: " + error.message;
    }
}