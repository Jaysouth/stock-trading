import { Router, Request, Response } from 'express';

const router = Router();

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password, firstName, lastName, role } = req.body;
    
    // Validation
    if (!email || !username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Role validation
    const validRoles = ['beginner', 'intermediate', 'professional'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be: beginner, intermediate, or professional' });
    }

    // In production, this would hash password and save to database
    const user = {
      id: `user_${Date.now()}`,
      email,
      username,
      firstName,
      lastName,
      role: role || 'beginner',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // In production, this would verify credentials against database
    const token = `jwt_token_${Date.now()}`;
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: `user_${Date.now()}`,
        email,
        role: 'beginner'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    // In production, this would get user from JWT token
    const user = {
      id: `user_${Date.now()}`,
      email: 'user@example.com',
      username: 'demouser',
      firstName: 'Demo',
      lastName: 'User',
      role: 'beginner',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(200).json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export { router as authRouter };
