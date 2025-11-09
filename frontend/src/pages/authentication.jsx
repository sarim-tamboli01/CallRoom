import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert, Tabs, Tab } from '@mui/material';
import { Container } from 'react-bootstrap';
import Logo from '../components/Logo';

const defaultTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6c8cff',
        },
        background: {
            default: '#0b1020',
            paper: '#111936',
        },
    },
});

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {
            console.log(err);
            let message = (err.response?.data?.message || 'An error occurred');
            setError(message);
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={false}
                    md={7}
                    sx={{
                        backgroundImage: `url(https://source.unsplash.com/random/1600x900/?nature,wallpapers&sig=${Math.random()})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: { xs: 'none', md: 'block' }
                    }}
                />
                <Grid item xs={12} sm={12} md={5} component={Paper} elevation={6} square>
                    <Container>
                        <Box
                            sx={{
                                my: { xs: 4, sm: 6, md: 8 },
                                mx: { xs: 2, sm: 4 },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                        <div className="mb-3">
                            <Logo size={64} />
                        </div>

                            <Box sx={{ width: '100%', maxWidth: 400, mt: 2 }}>
                                <Tabs 
                                    value={formState} 
                                    onChange={(e, newValue) => setFormState(newValue)}
                                    variant="fullWidth"
                                    sx={{ mb: 3 }}
                                >
                                    <Tab label="Sign In" />
                                    <Tab label="Sign Up" />
                                </Tabs>
                            </Box>

                            <Box component="form" noValidate sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
                                {formState === 1 && (
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Full Name"
                                        name="name"
                                        value={name}
                                        autoFocus
                                        onChange={(e) => setName(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={username}
                                    autoFocus={formState === 0}
                                    onChange={(e) => setUsername(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    value={password}
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    sx={{ mb: 2 }}
                                />

                                {error && (
                                    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                                    onClick={handleAuth}
                                >
                                    {formState === 0 ? "Login" : "Register"}
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}
