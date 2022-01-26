const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", (_request, response) => {
    response.sendFile(__dirname + "/index.html");
});

app.get("/video", (request, response) => {

    const range = request.headers.range;
    if (!range) {
        request.status(400).send("Requires Range header");
    }
    const videoPath = "assets/Fun-Animation.mp4";
    const videoSize = fs.statSync("assets/Fun-Animation.mp4").size;

    const CHUNK_SIZE = 10 ** 3; // 300Kb
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    response.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, {start, end});
    videoStream.pipe(response);

});

app.listen(8000, () => {
    console.log("Hey, There I am listening it on: 8000");
});
