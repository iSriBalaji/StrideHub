import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';
import { login, logout, fetchCurrentUser, getTokens } from './auth';
import { PersonDashboard } from './components/PersonDashboard';

// Replace the features array with product-aligned content
const features = [
  {
    title: 'Unified Consultant Profile',
    description: 'A single source of truth for skills, history, utilization, goals, reviews, and feedback—always current and actionable.',
    img: 'https://placehold.co/384x216/1e1e25/FFFFFF?text=Profile'
  },
  {
    title: 'Continuous Feedback & Reviews',
    description: 'Peer, manager, and client feedback flows into structured review cycles that drive fair, data‑backed performance conversations.',
    img: 'https://placehold.co/384x216/1e1e25/FFFFFF?text=Feedback'
  },
  {
    title: 'Utilization & Capacity Insight',
    description: 'Real-time visibility into workload trends helps balance capacity, reduce burnout, and improve staffing decisions.',
    img: 'https://placehold.co/384x216/1e1e25/FFFFFF?text=Utilization'
  },
  {
    title: 'Goal & Development Planning',
    description: 'Track growth objectives and development actions side-by-side with measurable outcomes and review input.',
    img: 'https://placehold.co/384x216/1e1e25/FFFFFF?text=Goals'
  },
  {
    title: 'Engagement & Role Clarity',
    description: 'Instant context on active projects, roles, timelines, and contribution focus—no spreadsheet archaeology.',
    img: 'https://placehold.co/384x216/1e1e25/FFFFFF?text=Engagements'
  },
  {
    title: 'Data-Driven Performance',
    description: 'Structured metrics + qualitative insights power smarter calibration and transparent growth paths.',
    img: 'https://placehold.co/384x216/1e1e25/FFFFFF?text=Analytics'
  }
];

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [uName, setUName] = useState('');
  const [pw, setPw] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // silent load user if tokens exist
    if (getTokens().access) {
      fetchCurrentUser()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/home/')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Could not connect to backend.'));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginBusy(true);
    try {
      await login(uName, pw);
      const me = await fetchCurrentUser();
      setUser(me);
      setLoginOpen(false);
      setPw('');
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <Box sx={{ bgcolor: '#18181b', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: '#18181b', boxShadow: 'none', borderBottom: '1px solid #232329' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            <span style={{ fontWeight: 900, fontFamily: 'Inter, sans-serif' }}>StrideHub</span>
          </Typography>
          <Box>
            {authLoading ? (
              <CircularProgress size={22} sx={{ color: '#fff', mr: 2 }} />
            ) : user ? (
              <>
                <Typography component="span" sx={{ mr: 2, fontWeight: 500 }}>
                  {user.username}
                </Typography>
                <Button onClick={handleLogout} sx={{ color: '#fff', textTransform: 'none', fontWeight: 500 }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setLoginOpen(true)} sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, mr: 2 }}>Log in</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ pt: 10, pb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            {/* Update hero copy and feature cards content */}
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.4rem', md: '3.4rem' }, mb: 2, lineHeight: 1.05 }}>
              Empower Consultants. Elevate Performance.
            </Typography>
            <Typography variant="h6" sx={{ color: '#b3b3b3', mb: 4, maxWidth: 640 }}>
              A modern performance review & consultant self‑management platform that unifies feedback, reviews, utilization, goals, engagements, and development planning into one cohesive operating system for talent growth.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            {/* Placeholder for hero image or animation */}
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {features.map((feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ bgcolor: '#232329', color: '#fff', borderRadius: 4, boxShadow: '0 2px 16px #00000040', minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 6px 32px #00000080' } }}>
                <CardContent>
                  <img src={feature.img} alt={feature.title} style={{ width: '100%', borderRadius: 12, marginBottom: 16, background: '#18181b' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{feature.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#b3b3b3' }}>{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {user && (
          <Box sx={{ mt: 6 }}>
            {/* Where person dashboard is conditionally rendered (leave logic) you can optionally add a heading wrapper if desired. */}
            <PersonDashboard />
          </Box>
        )}
      </Container>
      <Box sx={{ bgcolor: 'linear-gradient(180deg, #18181b 60%, #232329 100%)', py: 8, mt: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#fff' }}>
            Set the product direction
          </Typography>
          <Typography variant="h6" sx={{ color: '#b3b3b3', mb: 2 }}>
            Align your team around a unified product timeline. Plan, manage, and track all product initiatives with StrideHub’s visual planning tools.
          </Typography>
        </Container>
      </Box>
      {/* Login Dialog */}
      <Dialog open={loginOpen} onClose={() => !loginBusy && setLoginOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Log In</DialogTitle>
        <form onSubmit={handleLogin}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              value={uName}
              onChange={(e) => setUName(e.target.value)}
              autoFocus
              fullWidth
              size="small"
            />
            <TextField
              label="Password"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              fullWidth
              size="small"
            />
            {loginError && <Typography color="error" variant="body2">{loginError}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button disabled={loginBusy} onClick={() => setLoginOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loginBusy || !uName || !pw}
            >
              {loginBusy ? 'Logging in...' : 'Login'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default App;
