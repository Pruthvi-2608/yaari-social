import { supabase, supabaseAdmin, getScopedClient } from '../config/supabase.js';

export async function authenticateAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid Authorization header.'
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired session token.'
      });
    }

    // Create client scoped to user's JWT
    const scopedDb = getScopedClient(req);

    // Verify user role in admin_roles table using scoped user token
    const { data: roleData, error: roleError } = await scopedDb
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleError) {
      console.error('Admin role check error:', roleError);
    }

    // User is authorized if they exist in admin_roles or if they are the first user in dev mode
    const isAdmin = roleData && (roleData.role === 'admin' || roleData.role === 'super_admin');

    if (!isAdmin) {
      // Check if admin_roles is completely empty. If so, automatically enroll this authenticated user as super_admin
      const { count } = await supabaseAdmin
        .from('admin_roles')
        .select('*', { count: 'exact', head: true });

      if (count === 0) {
        await supabaseAdmin.from('admin_roles').insert({
          user_id: user.id,
          role: 'super_admin'
        });
        req.user = user;
        req.isAdmin = true;
        req.db = getScopedClient(req);
        return next();
      }

      return res.status(403).json({
        success: false,
        error: 'Forbidden: Administrator privileges required.'
      });
    }

    req.user = user;
    req.isAdmin = true;
    req.db = getScopedClient(req);
    next();
  } catch (err) {
    console.error('Authentication middleware exception:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server authentication error.'
    });
  }
}
