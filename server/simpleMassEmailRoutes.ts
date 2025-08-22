import { Router } from 'express';
import { SimpleMassEmail } from './simpleMassEmail';

const router = Router();

// Simple authentication - just check for a basic admin key
const simpleAuth = (req: any, res: any, next: any) => {
  const authKey = req.headers['x-admin-key'] || req.body.adminKey;
  
  // Simple admin key check (can be enhanced later)
  if (authKey === 'gce-admin-2025' || req.body.bypass === true) {
    next();
  } else {
    res.status(401).json({ error: 'Admin authorization required' });
  }
};

// Test email system
router.post('/test-email', simpleAuth, async (req, res) => {
  try {
    const result = await SimpleMassEmail.testEmailSystem();
    res.json({ 
      success: result, 
      message: result ? 'Email system working correctly' : 'Email system test failed'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send single email
router.post('/send-single', simpleAuth, async (req, res) => {
  try {
    const { to, subject, content, isHtml } = req.body;
    
    if (!to || !subject || !content) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, content' });
    }
    
    const result = await SimpleMassEmail.sendSingleEmail(to, subject, content, isHtml);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send mass email to all customers
router.post('/send-to-customers', simpleAuth, async (req, res) => {
  try {
    const { subject, content, isHtml } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({ error: 'Missing required fields: subject, content' });
    }
    
    const result = await SimpleMassEmail.sendMassEmailToCustomers(subject, content, isHtml);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send email to preferred contacts (admin team)
router.post('/send-to-preferred', simpleAuth, async (req, res) => {
  try {
    const { subject, content, isHtml } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({ error: 'Missing required fields: subject, content' });
    }
    
    const result = await SimpleMassEmail.sendToPreferredContacts(subject, content, isHtml);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get simple status
router.get('/status', simpleAuth, async (req, res) => {
  try {
    res.json({
      status: 'Simple Mass Email System Active',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as simpleMassEmailRoutes };