const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

// Create a write stream to the results file
const writeStream = fs.createWriteStream('results.txt');

// Read the CSV file and process each row
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', async (row) => {
    const recipient = row.recipient.trim();

    console.log(recipient);
    // Make the DELETE request
    try {
      const response = await axios.delete(
        'https://kong.command-api.kw.com/raven/api/v1/recipients',
        {
          headers: {
            'Content-Type': 'application/json',
            ApiKey: '',
          },
          data: {
            recipient: recipient,
            sender: null,
            type: 'EMAIL',
            status: 'blocked',
          },
        }
      );

      const result = `Recipient '${recipient}' deleted successfully.\n${JSON.stringify(
        response.data
      )}\n`;
      console.log(result);

      // Write the result to the file
      writeStream.write(result);
    } catch (error) {
      const result = `Error deleting recipient '${recipient}': ${error.message}\n`;
      console.error(result);

      // Write the result to the file
      writeStream.write(result);
    }
  })
  .on('end', () => {
    // Close the write stream when all requests are completed
    writeStream.end(() => {
      console.log('Results file created.');
    });
  });
