const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../posts');
const outputFile = path.join(postsDir, 'posts.json');

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));

const allPosts = files.map(file => {
    
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');

    const getMeta = (name) => {
        const regex = new RegExp(`<meta\\s+name="${name}"\\s+content="(.*?)"`, 'i');
        const match = content.match(regex);
        return match ? match[1] : '';
    };

    // const contentMatch = content.match(/<div class="post_html"[^>]*>([\s\S]*?)<\/div>/i);
    // const postContent = contentMatch ? contentMatch[1].trim() : '';

    const meta = {
        title: getMeta('title'),
        preview: getMeta('preview'),
        tags: getMeta('tags'),
        timestamp: getMeta('timestamp')
    };

    return {
        fileName: file,
        timestamp: meta.timestamp ? new Date(meta.timestamp).getTime() : 0,
        ...meta,
        // content: postContent
    };
});

allPosts.sort((a, b) => b.timestamp - a.timestamp);

fs.writeFileSync(outputFile, JSON.stringify(allPosts, null, 2));

console.log(`Zapisano ${allPosts.length} postów do posts.json`);