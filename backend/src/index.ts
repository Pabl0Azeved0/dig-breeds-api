import http from 'http';
import app from './app';

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
  console.log(`📚 API documentation available at http://localhost:${port}/docs`);
});