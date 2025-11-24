import postgres from 'postgres';

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);

    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const result = await sql`SELECT NOW()`;
    console.log('Database connected successfully!', result);

    await sql.end();

    return Response.json({
      message: 'Database connection successful',
      timestamp: result[0].now
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}
