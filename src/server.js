import app from './app.js'

// porta do servidor
const PORT = 5433
app.listen(PORT, () => {
    console.log(` -> Server running on port ${PORT} <-`);
  });

