const Router = require('express')
const router = new Router()
const fs = require('fs')
const path = require('path')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
// const author_middleware = require('../middlewares/author.middleware')
// const student_middleware = require('../middlewares/student.middleware')

router.get('/:id', auth_middleware, function(req, res, next) {
    const videoId = req.params.id;
    const path_ = path.join(__dirname, `../src/videos/${videoId}`)

    // Перевірка наявності файлу перед подальшою обробкою
    fs.access(path_, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File doesn't exist");
            return res.status(404).send('File not found');
        }

        const stat = fs.statSync(path_);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1;

            const chunksize = (end-start)+1;
            const file = fs.createReadStream(path_, {start, end});
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
            fs.createReadStream(path_).pipe(res);
        }
    });
});

module.exports = router