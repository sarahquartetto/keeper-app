import React, { useState } from 'react';
import FestivalIcon from '@mui/icons-material/Festival';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { API_BASE_URL } from '../config.js';


import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';

function Auth({ onLogin }) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-thread-light.png")',
        padding: 2,
        fontFamily: '"Outfit", sans-serif'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          borderRadius: 2,
          background: '#fff',
          boxShadow: '0 2px 5px #ccc'
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            mb: 3,
            color: 'var(--primary)',
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        > 
          <TipsAndUpdatesIcon fontSize="large" /> Keeper Notes
        </Typography>

        <Tabs 
          value={tab} 
          onChange={handleTabChange} 
          centered 
          sx={{ 
            mb: 3,
            '& .MuiTab-root': {
              color: 'var(--muted-text)',
              '&.Mui-selected': {
                color: 'var(--primary)'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--primary)'
            }
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {tab === 0 ? (
          // Login Form
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleLoginChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text)',
                  '&.Mui-focused': {
                    color: 'var(--text)',
                  },
                  '&.MuiFormLabel-filled': {
                    color: 'var(--text)',
                  },
                },
                '& .MuiInputBase-input': {
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  color: 'var(--text)',
                  '&:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                    '-webkit-text-fill-color': 'var(--text)',
                  },
                  '&:-webkit-autofill:hover': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                  '&:-webkit-autofill:focus': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleLoginChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text)',
                  '&.Mui-focused': {
                    color: 'var(--text)',
                  },
                  '&.MuiFormLabel-filled': {
                    color: 'var(--text)',
                  },
                },
                '& .MuiInputBase-input': {
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  color: 'var(--text)',
                  '&:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                    '-webkit-text-fill-color': 'var(--text)',
                  },
                  '&:-webkit-autofill:hover': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                  '&:-webkit-autofill:focus': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                backgroundColor: 'var(--accent)',
                color: 'var(--surface)',
                '&:hover': {
                  backgroundColor: 'var(--accent-600)'
                },
                '&:disabled': {
                  backgroundColor: 'var(--border)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
            </Button>
          </Box>
        ) : (
          // Register Form
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text)',
                  '&.Mui-focused': {
                    color: 'var(--text)',
                  },
                  '&.MuiFormLabel-filled': {
                    color: 'var(--text)',
                  },
                },
                '& .MuiInputBase-input': {
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  color: 'var(--text)',
                  '&:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                    '-webkit-text-fill-color': 'var(--text)',
                  },
                  '&:-webkit-autofill:hover': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                  '&:-webkit-autofill:focus': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text)',
                  '&.Mui-focused': {
                    color: 'var(--text)',
                  },
                  '&.MuiFormLabel-filled': {
                    color: 'var(--text)',
                  },
                },
                '& .MuiInputBase-input': {
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  color: 'var(--text)',
                  '&:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                    '-webkit-text-fill-color': 'var(--text)',
                  },
                  '&:-webkit-autofill:hover': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                  '&:-webkit-autofill:focus': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text)',
                  '&.Mui-focused': {
                    color: 'var(--text)',
                  },
                  '&.MuiFormLabel-filled': {
                    color: 'var(--text)',
                  },
                },
                '& .MuiInputBase-input': {
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  color: 'var(--text)',
                  '&:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                    '-webkit-text-fill-color': 'var(--text)',
                  },
                  '&:-webkit-autofill:hover': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                  '&:-webkit-autofill:focus': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                }
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text)',
                  '&.Mui-focused': {
                    color: 'var(--text)',
                  },
                  '&.MuiFormLabel-filled': {
                    color: 'var(--text)',
                  },
                },
                '& .MuiInputBase-input': {
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  color: 'var(--text)',
                  '&:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                    '-webkit-text-fill-color': 'var(--text)',
                  },
                  '&:-webkit-autofill:hover': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                  '&:-webkit-autofill:focus': {
                    '-webkit-box-shadow': '0 0 0 100px var(--surface) inset',
                  },
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                backgroundColor: 'var(--accent)',
                color: 'var(--surface)',
                '&:hover': {
                  backgroundColor: 'var(--accent-600)'
                },
                '&:disabled': {
                  backgroundColor: 'var(--border)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Auth;
