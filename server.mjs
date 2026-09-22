import 'dotenv/config';
import http from 'http';
import { MongoClient } from 'mongodb';

const port = 3001;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freshfold-prd';
const dbName = 'freshfold-prd';
const collectionName = 'documents';

const server = http.createServer(async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.url === '/api/prd' && req.method === 'GET') {
    try {
      const client = new MongoClient(mongoUri);
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const doc = await collection.findOne({ name: 'freshfold-prd' });
      await client.close();

      res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
      res.end(JSON.stringify(doc ?? {
        sections: {},
        collaborators: [],
        updatedAt: new Date().toISOString(),
      }));
      return;
    } catch (error) {
      const fallback = {
        sections: {},
        collaborators: [],
        updatedAt: new Date().toISOString(),
      };
      res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fallback));
      return;
    }
  }

  if (req.url === '/api/prd' && req.method === 'POST') {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(raw || '{}');
        const client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        await collection.updateOne(
          { name: 'freshfold-prd' },
          { $set: { ...payload, name: 'freshfold-prd', updatedAt: new Date().toISOString() } },
          { upsert: true }
        );

        await client.close();
        res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (error) {
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Failed to save document' }));
      }
    });
    return;
  }

  res.writeHead(404, { ...headers, 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: false, message: 'Not found' }));
});

server.listen(port, () => {
  console.log(`Mongo-backed PRD API listening on http://localhost:${port}`);
});
