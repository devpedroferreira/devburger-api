import app from './app.js'

// porta do servidor
const PORT = 2345
app.listen(PORT, () => {
    console.log(` -> Server running on port ${PORT} <-`);
  });

