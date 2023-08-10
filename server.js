const express = require('express');
const fetch = require('node-fetch'); // 추가: fetch를 사용하기 위해 node-fetch를 import해야 합니다.
const app = express();
const cors = require('cors');
const xml2js = require('xml2js');

app.use(cors());

// req 요청에 관한 정보를 담음
// res 응답에 관한 정보를 담음
app.get('/gpx', (req, res) => {
    const GPX_URL = req.query.data;
    console.log(req);
    // req.body
    async function get(url) {
        try {
            const fetchUrl = await fetch(url);
            const file = await fetchUrl.text();
            const parser = new xml2js.Parser();

            parser.parseString(file, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }

                const coordinates = [];
                const trkpts = result.gpx.trk[0].trkseg[0].trkpt;
                for (const trkpt of trkpts) {
                    const lat = parseFloat(trkpt.$.lat);
                    const lon = parseFloat(trkpt.$.lon);

                    coordinates.push({ lat, lon });
                }
                res.send(coordinates);
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }

    get(GPX_URL);
});

const port = 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
