const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../posts');
const outputFile = path.join(postsDir, 'posts.json');

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
// fs.readdirSync(postsDir) -> returns array of file names with extensions

const allPosts = files.map(file => {

    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    
    const match = content.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
    const meta = {};
    
    if (match) {
        const metaPart = match[1];
        metaPart.split('\n').forEach(line => {
            const [key, ...val] = line.split(':');
            if (key && val.length) meta[key.trim()] = val.join(':').trim();
        });
    }

    return {
        fileName: file,
        timestamp: meta.date ? new Date(meta.timestamp).getTime() : 0,
        ...meta
    };
});

allPosts.sort((a, b) => b.timestamp - a.timestamp);

fs.writeFileSync(outputFile, JSON.stringify(allPosts, null, 2));

console.log(`Zapisano ${allPosts.length} postów do posts_data.json`);