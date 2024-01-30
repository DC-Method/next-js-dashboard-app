const { db } = require('@vercel/postgres');

async function seedPosts(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "posts" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug TEXT NOT NULL,
        user_id UUID NOT NULL,
        date_created DATE NOT NULL
      );
    `;

    console.log(`Created "posts" table`);

  } catch (error) {
    console.error('Error seeding posts:', error);
    throw error;
  }
}

async function seedPostMeta(client) {
  try {
    // Create the "post_meta" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS post_meta (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        post_id UUID NOT NULL,
        post_title TEXT NOT NULL,
        meta_title TEXT NOT NULL,
        meta_description TEXT NOT NULL,
        header_image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "post_meta" table`);

  } catch (error) {
    console.error('Error seeding post meta:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedPosts(client);
  await seedPostMeta(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
