import { query } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query('UPDATE users SET is_active = false WHERE id = $1', [params.id]);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error removing member:', error);
    return Response.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const pathname = new URL(request.url).pathname;

  if (pathname.includes('/approve')) {
    try {
      await query('UPDATE users SET is_active = true WHERE id = $1', [params.id]);
      return Response.json({ success: true });
    } catch (error) {
      console.error('Error approving member:', error);
      return Response.json({ error: 'Failed to approve member' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
}
