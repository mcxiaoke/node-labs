const fs = require('fs');

const pick = (...props) => o => props.reduce((a, e) => ({ ...a, [e]: o[e] }), {});

// fs.readFile(F1, 'utf8', (err, data) => {
//     if (err) {
//         if (err.code === 'ENOENT') {
//             console.error('myfile does not exist');
//             return;
//         }

//         throw err;
//     }
//     console.log('async');
// });

try {
    var repos = [];
    var counter = 0;
    for (let i = 1; i < 6; i++) {
        const fn = `../data/kotlin${i}.txt`;
        const data = fs.readFileSync(fn, 'utf8');
        const gt = JSON.parse(data);
        gt.items.forEach(it => {
            // it.name, it.html_url, it.description
            const repo = {
                "name": it.name,
                "owner": it.owner.login,
                "url": it.html_url,
                "desc": it.description,
                "stars": it.stargazers_count
            };
            repos.push(repo);
            // console.log(`[${repo.name}](${repo.url}) - ${repo.desc}`);
            // console.log(++counter, repo.stars, repo.url);
        });
    }
    console.log('Total repos before filter: ', repos.length);
    // remove asia language repos
    repos = repos.filter(it => it.desc && !it.desc.match(/[\u3400-\u9FBF]/));
    // sort by stars count
    repos.sort((a, b) => (a.stars > b.stars) ? -1 : 1);
    console.log('Total repos after filter: ', repos.length);
    fs.unlinkSync('../data/kotlin-top.md');

    var fw = fs.createWriteStream('../data/kotlin-top.md', {
        flags: 'a'
    });
    repos.forEach(it => {
        console.log('Write:', it.url, it.stars);
        fw.write(`- [${it.name}](${it.url}) - ${it.desc}\n`);
    })
    fw.close();

} catch (err) {
    console.error(err);
};

