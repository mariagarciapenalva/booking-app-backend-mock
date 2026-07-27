const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

//  RUTA DE REGISTRO: Vincula usuarios al recurso /login
server.post('/api/register', (req, res) => {
  const db = router.db;
  const { email, password } = req.body;
  
  const newUser = {
    id: String(Date.now()),
    email,
    password,
    token: "mock-jwt-token-generado-" + Date.now()
  };

  db.get('login').push(newUser).write();
  res.status(201).json(newUser);
});

//  RUTA DE LOGIN: Validación de credenciales
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

//  INTERCEPTOR DE PRODUCTOS: Simula la paginación nativa de Laravel
server.get('/api/products', (req, res) => {
  const db = router.db;
  const allProducts = db.get('products').value();
  
  res.status(200).json({
    data: allProducts,
    total: allProducts.length,
    per_page: 15,
    current_page: 1,
    last_page: 1
  });
});

//  INTERCEPTOR DE CATEGORÍAS: Envuelve la lista en la propiedad .data
server.get('/api/categories', (req, res) => {
  const db = router.db;
  const allCategories = db.get('categories').value();
  
  res.status(200).json({
    data: allCategories
  });
});

// Enruta el resto de peticiones estándar (POST, PUT, DELETE de productos/categorías)
server.use('/api', router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
