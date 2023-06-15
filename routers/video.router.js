const Router = require('express')
const router = new Router()
const fs = require('fs')

router.get('/:id', function(req, res) {
    const videoId = req.params.id;
    const path = `video/${videoId}`;

    // Перевірка наявності файлу перед подальшою обробкою
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File doesn't exist");
            return res.status(404).send('File not found');
        }

        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1;

            const chunksize = (end-start)+1;
            const file = fs.createReadStream(path, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(200, head);
            fs.createReadStream(path).pipe(res);
        }
    });
});

module.exports = router