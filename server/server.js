const express = require('express')
const dotenv = require('dotenv')
const error = require('./middleware/errorMiddleware')
// const userRoute = require('./middleware/errorMiddleware')

dotenv.config()

require('./db/conn.js')
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json())

//user
app.use(require('./router/userRoute'))
//Book
app.use(require('./router/bookRoute'))

app.use(error.errorMiddleware)
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
