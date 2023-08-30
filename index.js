const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send("Hey by hammad")
})

app.get('/about', (req, res) => {
  res.json({message: "Success By Hamamd"})
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})