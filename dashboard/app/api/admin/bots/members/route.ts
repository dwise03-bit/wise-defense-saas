import { pool } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || 'all';

  try {
    let query = `
      SELECT u.id, u.name, u.email, u.tier, u.is_active,
             COALESCE(mp.total_points, 0) as total_points
      FROM users u
      LEFT JOIN member_progress mp ON u.id = mp.member_id
      WHERE (u.name ILIKE $1 OR u.email ILIKE $1)
    `;

    const params: any[] = [`%${search}%`];

    if (filter === 'active') {
      query += ` AND u.is_active = true`;
    } else if (filter === 'inactive') {
      query += ` AND u.is_active = false`;
    }

    query += ` ORDER BY u.created_at DESC LIMIT 100`;

    const result = await pool.query(query, params);
    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching members:', error);
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
