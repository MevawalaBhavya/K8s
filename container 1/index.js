const express = require ('express');
const bodyParser = require('body-parser');
const fs = require('fs'); 
const axios = require('axios'); 
const app = express();
const port = 6000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Container 1 working for CI/CD !!'))


app.post('/store-file', async (req, res) => {
    // Validate the input JSON
    
    const { file, data } = req.body;

    if (!file || !data) {
      return res.json({ file: null, error: "Invalid JSON input." });
    }
  
    // Remove extra white spaces
    const cleanedData = data
      .split("\n")
      .map((line) =>
        line
          .split(",")
          .map((item) => item.trim())
          .join(",")
      )
      .join("\n");
  
    fs.writeFile(`/BHAVYA_PV_dir/data/${file}`, cleanedData, (err) => {
      if (err) {
        return res.json({
          file: file,
          error: "Error while storing the file to the storage.",
        });
      }
      res.json({ file: file, message: "Success." });
    });

});

app.post('/calculate', async (req, res) => {
    
    // Validate the input JSON
    if (!req.body.file) {
        return res.status(200).json({
            file: null,
            error: "Invalid JSON input."
        });
    }

    // Verify that the file exists
    const file = req.body.file;
    const path = `/BHAVYA_PV_dir/data/${file}`;
    if (!fs.existsSync(path)) {
        return res.status(200).json({
            file: file,
            error: "File not found."
        });
    } 

    // Send the file details to Container2
    try {
        const response = await axios.post('http://cloud-major-assignment-loadbalancer:60001/calculate', {
            file: file,
            product: req.body.product,
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log('errorr ===>', error)
        res.status(200).json({ error });
    }
});

app.listen(port, () => {console.log(`Server is running on port ${port}`);});