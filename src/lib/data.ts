// app/lib/data.ts
import clientPromise from './clientpromise';

export async function getAdaniData() {
  try {
    const client = await clientPromise;
    const db = client.db("powerbi");
    
    const data = await db
      .collection("adani")
      .find({})
      .sort({ "Date ": 1 })
      .toArray();
    
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data');
  }
}