const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const excelRoutes = require('./routes/excelRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/excel-template-db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

app.use('/api/excel', excelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});