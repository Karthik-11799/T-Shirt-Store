const posts = [
    { title: 'Bootstrap', author: 'Twitter' },
    { title: 'SemanticUI', author: 'Dont know' },
]

function getPosts() {
    setTimeout(() => {
        let output = '';
        posts.forEach((post, index) => {
            output += `<li>${post.title}</li>`;
        });
        document.body.innerHTML = output;
    }, 1000);
}

// getPosts();

function creatPost(post, callback) {
    setTimeout(() => {
        posts.push(post);
        callback();
    }, 2000)
}

creatPost({ title: 'Firebase', author: 'Google' }, getPosts)

app.listen(3000);