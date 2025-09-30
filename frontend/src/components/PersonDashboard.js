import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, LinearProgress,
  Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Stack, Divider
} from '@mui/material';
import { authFetch } from '../auth';

const SectionTitle = ({ children }) => (
  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>{children}</Typography>
);

export const PersonDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [util, setUtil] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingUtil, setLoadingUtil] = useState(true);
  const [errorOverview, setErrorOverview] = useState('');
  const [errorUtil, setErrorUtil] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadOverview = async () => {
      try {
        const res = await authFetch('/person/overview/');
        if (!res.ok) throw new Error('Failed to load overview');
        const data = await res.json();
        if (mounted) setOverview(data);
      } catch (e) {
        if (mounted) setErrorOverview(e.message);
      } finally {
        if (mounted) setLoadingOverview(false);
      }
    };
    const loadUtil = async () => {
      try {
        const res = await authFetch('/person/utilization/');
        if (!res.ok) throw new Error('Failed to load utilization');
        const data = await res.json();
        if (mounted) setUtil(data);
      } catch (e) {
        if (mounted) setErrorUtil(e.message);
      } finally {
        if (mounted) setLoadingUtil(false);
      }
    };
    loadOverview();
    loadUtil();
    return () => { mounted = false; };
  }, []);

  const maxWeekly = useMemo(() => {
    if (!util?.weeks?.length) return 0;
    return Math.max(...util.weeks.map(w => w.total_hours || 0));
  }, [util]);

  const safeWeeks = (util && Array.isArray(util.weeks)) ? util.weeks.filter(w => w && typeof w === 'object') : [];

  const formatWeekLabel = (val) => {
    if (!val) return '—';
    try {
      // Expecting YYYY-MM-DD
      return String(val).slice(5); // MM-DD
    } catch {
      return '—';
    }
  };

  return (
    <Box sx={{ mt: 6, display: 'grid', gap: 32 }}>
      <Box>
        <SectionTitle>Consultant Overview</SectionTitle>
        <Card sx={{ bgcolor: '#232329', color: '#fff' }}>
          <CardContent>
            {loadingOverview && <LinearProgress sx={{ mb: 2 }} />}
            {errorOverview && <Typography color="error">{errorOverview}</Typography>}
            {overview && (
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Role:
                  </Typography>
                  <Chip
                    label={overview.role.role_name || 'Unassigned'}
                    size="small"
                    sx={{ bgcolor: '#3b3b42', color: '#fff' }}
                  />
                  <Chip
                    label={`Active Projects: ${overview.active_project_count}`}
                    size="small"
                    sx={{ bgcolor: '#3b3b42', color: '#fff' }}
                  />
                </Stack>
                <Divider sx={{ mb: 2, borderColor: '#383840' }} />
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Active Engagements & Roles
                </Typography>
                {overview.active_engagements.length === 0 && (
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                    No active engagements.
                  </Typography>
                )}
                {overview.active_engagements.length > 0 && (
                  <Table size="small" sx={{
                    '& th': { color: '#b3b3b3', background: '#2b2b31', borderBottom: '1px solid #323239' },
                    '& td': { borderBottom: '1px solid #2d2d33' }
                  }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Project</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {overview.active_engagements.map(e => (
                        <TableRow key={`${e.project_id}-${e.start_date}`}>
                          <TableCell>{e.project_name}</TableCell>
                          <TableCell>{e.role_on_project || '-'}</TableCell>
                          <TableCell>{e.start_date}</TableCell>
                          <TableCell>{e.end_date || 'Current'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box>
        <SectionTitle>Workload & Capacity (Last 8 Weeks)</SectionTitle>
        <Card sx={{ bgcolor: '#232329', color: '#fff' }}>
          <CardContent>
            {loadingUtil && <LinearProgress sx={{ mb: 2 }} />}
            {errorUtil && <Typography color="error">{errorUtil}</Typography>}
            {util && (
              <Box>
                <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 2 }}>
                  Tracking recent workload distribution helps identify focus, over-allocation risk, and growth capacity.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Total Hours: ${util.total_hours_window}`}
                    size="small"
                    sx={{ bgcolor: '#3b3b42', color: '#fff' }}
                  />
                  {util.breakdown_by_type.map(t => (
                    <Chip
                      key={t.type}
                      label={`${t.type}: ${t.hours}`}
                      size="small"
                      sx={{ bgcolor: '#3b3b42', color: '#fff' }}
                    />
                  ))}
                </Stack>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 120, mt: 2 }}>
                  {safeWeeks.map((w, idx) => {
                    const hours = typeof w.total_hours === 'number' ? w.total_hours : parseFloat(w.total_hours) || 0;
                    const pct = maxWeekly ? (hours / maxWeekly) * 100 : 0;
                    const dateKey = w.week_start_date || `wk-${idx}`;
                    return (
                      <Tooltip
                        key={dateKey}
                        title={`${w.week_start_date || 'Unknown'} • ${hours}h`}
                        arrow
                      >
                        <Box sx={{
                          width: 22,
                          borderRadius: '4px 4px 0 0',
                          background: 'linear-gradient(180deg,#5d5df6,#3c3c94)',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          height: `${pct || 4}%`,
                          minHeight: pct ? undefined : 4
                        }}>
                          <Typography variant="caption" sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 10, color: '#fff', mb: 0.5 }}>
                            {hours}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                  {safeWeeks.map((w, idx) => {
                    const dateKey = w.week_start_date || `wk-${idx}`;
                    return (
                      <Typography key={dateKey} variant="caption" sx={{ color: '#b3b3b3', width: 22, textAlign: 'center' }}>
                        {formatWeekLabel(w.week_start_date)}
                      </Typography>
                    );
                  })}
                </Box>
                <Typography variant="caption" sx={{ color: '#b3b3b3', display: 'block', mt: 2 }}>
                  Bars represent total hours per week; chip tags summarize allocation by utilization type.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
