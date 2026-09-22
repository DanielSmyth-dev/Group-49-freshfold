import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freshfold-prd';
const dbName = 'freshfold-prd';
const collectionName = 'documents';

const withCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req, res) {
  withCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    if (req.method === 'GET') {
      const doc = await collection.findOne({ name: 'freshfold-prd' });
      const payload = doc ?? {
        sections: {},
        collaborators: [],
        updatedAt: new Date().toISOString(),
      };
      res.status(200).json(payload);
      return;
    }

    if (req.method === 'POST') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      await collection.updateOne(
        { name: 'freshfold-prd' },
        { $set: { ...payload, name: 'freshfold-prd', updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Mongo PRD API error:', error);
    res.status(500).json({ ok: false, error: 'Failed to save or load document' });
  } finally {
    await client.close();
  }
}
