const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 6005;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Container 2!!'))

app.post('/calculate', (req, res) => {
  const data = req.body;

  if (!data || !data.file) {
    return res.json({ file: null, error: "Invalid JSON input." });
  }

  const fileName = data.file;
  const filePath = `/BHAVYA_PV_dir/data/${fileName}`;

  if (!fs.existsSync(filePath)) {
    return res.json({ file: fileName, error: "File not found." });
  }

  const product = data.product || '';
  let totalSum = 0;
  let arr = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        arr.push(row);
        if (row.product === product) {
          totalSum += parseInt(row.amount);
        }
      })
      .on('end', () => {
        if(arr.length == 0){
          return res.json({ file: fileName, error: "Input file not in CSV format." });
        }
        return res.json({ file: fileName, sum: totalSum });
      });
  } catch (error) {
    return res.json({ file: fileName, error: "Input file not in CSV format." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port${port}`);
});