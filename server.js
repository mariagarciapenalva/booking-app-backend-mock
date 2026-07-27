const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);

// 🛠️ CORRECCIÓN AQUÍ: Se utiliza el procesador de JSON correcto de json-server
server.use(jsonServer.bodyParser);

//  RUTA DE REGISTRO: Cuando Vue llame a /api/register, lo redirigimos internamente a la colección /login
server.post('/api/register', (req, res) => {
  const db = router.db; // Accede a la base de datos de db.json
  const { email, password } = req.body;
  
  // Guardamos el usuario nuevo y le inventamos un token simulado para que Vue no se quede colgado
  const newUser = {
    id: String(Date.now()),
    email,
    password,
    token: "mock-jwt-token-generado-" + Date.now()
  };

  db.get('login').push(newUser).write();
  res.status(201).json(newUser);
});

//  RUTA DE LOGIN: Comprueba si las credenciales coinciden con algún usuario de db.json
server.post('/api/login', (req, res) => {
  const db = router.db;
  const { email, password } = req.body;
  const user = db.get('login').find({ email, password }).value();

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(401).json({ error: "Credenciales incorrectas" });
  }
});

// Enruta el resto de peticiones estándar (/api/products, /api/categories) hacia json-server
server.use('/api', router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
