import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
	const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    LIMIT 10;
  `;

	return data;
}

async function getCounts() {
  const users = await sql`SELECT COUNT(*) FROM users`;
  const customers = await sql`SELECT COUNT(*) FROM customers`;
  const invoices = await sql`SELECT COUNT(*) FROM invoices`;
  const revenue = await sql`SELECT COUNT(*) FROM revenue`;

  return {
    users: users[0].count,
    customers: customers[0].count,
    invoices: invoices[0].count,
    revenue: revenue[0].count
  };
}

export async function GET() {
  try {
    const counts = await getCounts();
    const sampleInvoices = await listInvoices();

    return Response.json({
      counts,
      sampleInvoices
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
