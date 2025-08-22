import { Request, Response } from 'express';
import { trackTraceService, TrackingResult, AlertPreferences } from './trackTraceService';
import { storage } from './storage';

// Enhanced authentication middleware
export const isAuthenticated = (req: any, res: Response, next: any) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Authentication required' });
};

/**
 * Search for container using track-trace connect API
 */
export async function searchContainer(req: Request, res: Response) {
  try {
    const { trackingNumber, searchType = 'container', shippingLine } = req.body;

    if (!trackingNumber || trackingNumber.trim() === '') {
      return res.status(400).json({ 
        error: 'Tracking number is required',
        message: 'Please provide a container number, booking reference, or BOL' 
      });
    }

    console.log('Calling trackTraceService.searchContainer with:', { trackingNumber: trackingNumber.trim(), shippingLine, searchType });
    
    const trackingResult = await trackTraceService.searchContainer(
      trackingNumber.trim(), 
      shippingLine, 
      searchType
    );

    console.log('TrackingResult received:', trackingResult ? 'SUCCESS' : 'NULL');

    if (!trackingResult) {
      return res.status(404).json({
        error: 'Container not found',
        message: 'No tracking information found for this container number. Please verify the container number and shipping line.',
        trackingNumber,
        shippingLine: shippingLine || 'auto-detect',
        suggestions: [
          'Verify the container number format (e.g., MAEU1234567)',
          'Check if the container is from a supported shipping line',
          'Ensure the container is currently active in the system'
        ]
      });
    }

    // Log the search for analytics with shipping line info
    console.log(`Track-trace search: ${trackingNumber} (${shippingLine || 'auto-detect'}) by ${req.ip}`);

    res.json({
      success: true,
      data: trackingResult,
      searchType,
      shippingLine: shippingLine || 'auto-detect',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Container search error:', error);

    
    // Handle specific API errors with helpful messages
    if (error.message && (error.message.includes('Invalid Shipsgo API credentials') || error.message.includes('401'))) {
      return res.status(401).json({
        error: 'API Configuration Error',
        message: 'Tracking service requires API verification. Please check your Shipsgo account status and ensure your API token is activated with sufficient credits.',
        contact: 'Contact support@globalcontainerexchange.com for assistance with container tracking setup.',
        troubleshooting: {
          steps: [
            'Verify API token is activated in your Shipsgo dashboard',
            'Check account has sufficient tracking credits',
            'Ensure account verification is complete',
            'Contact Shipsgo support if token appears valid but still fails'
          ]
        }
      });
    } else if (error.message.includes('Insufficient Shipsgo credits')) {
      return res.status(402).json({
        error: 'Service Unavailable',
        message: 'Container tracking service is temporarily unavailable.',
        contact: 'Please contact support for immediate tracking assistance.'
      });
    } else if (error.message.includes('Rate limit exceeded')) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Please wait a moment before trying another search.',
        retryAfter: '60 seconds'
      });
    }
    
    return res.status(500).json({
      error: 'Search failed',
      message: 'Unable to retrieve tracking information. Please try again later.',
      contact: 'If the problem persists, please contact support for assistance.'
    });
  }
}

/**
 * Setup real-time alerts for container tracking
 */
export async function setupTrackingAlerts(req: any, res: Response) {
  try {
    const { containerNumber, preferences } = req.body;
    const userEmail = req.user?.email;

    if (!containerNumber || !userEmail) {
      return res.status(400).json({
        error: 'Missing required information',
        message: 'Container number and user authentication required'
      });
    }

    const alertPreferences: AlertPreferences = {
      emailNotifications: preferences?.emailNotifications !== false,
      smsNotifications: preferences?.smsNotifications || false,
      webhookUrl: preferences?.webhookUrl,
      alertTypes: preferences?.alertTypes || ['milestone', 'delay', 'deviation'],
      updateFrequency: preferences?.updateFrequency || 'realtime'
    };

    const success = await trackTraceService.setupAlerts(
      containerNumber,
      alertPreferences,
      userEmail
    );

    if (!success) {
      return res.status(500).json({
        error: 'Alert setup failed',
        message: 'Unable to configure tracking alerts. Please try again.'
      });
    }

    // Store alert preferences in database
    // TODO: Implement database storage for alert preferences

    res.json({
      success: true,
      message: 'Tracking alerts configured successfully',
      containerNumber,
      preferences: alertPreferences
    });

  } catch (error) {
    console.error('Alert setup error:', error);
    res.status(500).json({
      error: 'Alert setup failed',
      message: 'Unable to configure tracking alerts'
    });
  }
}

/**
 * Get detailed route history for container
 */
export async function getTrackingHistory(req: Request, res: Response) {
  try {
    const { containerNumber } = req.params;

    if (!containerNumber) {
      return res.status(400).json({
        error: 'Container number required',
        message: 'Please provide a valid container number'
      });
    }

    const routeHistory = await trackTraceService.getRouteHistory(containerNumber);

    if (!routeHistory) {
      return res.status(404).json({
        error: 'Route history not found',
        message: 'No route history available for this container'
      });
    }

    res.json({
      success: true,
      containerNumber,
      route: routeHistory,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Route history error:', error);
    res.status(500).json({
      error: 'Route history unavailable',
      message: 'Unable to retrieve route history'
    });
  }
}

/**
 * Get live updates for container
 */
export async function getLiveUpdates(req: Request, res: Response) {
  try {
    const { containerNumber } = req.params;

    if (!containerNumber) {
      return res.status(400).json({
        error: 'Container number required',
        message: 'Please provide a valid container number'
      });
    }

    const liveData = await trackTraceService.getLiveUpdates(containerNumber);

    if (!liveData) {
      return res.status(404).json({
        error: 'Live data unavailable',
        message: 'No live tracking data available for this container'
      });
    }

    res.json({
      success: true,
      containerNumber,
      liveData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Live updates error:', error);
    res.status(500).json({
      error: 'Live updates unavailable',
      message: 'Unable to retrieve live tracking data'
    });
  }
}

/**
 * Get user's tracking subscriptions
 */
export async function getUserTrackingSubscriptions(req: any, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to view tracking subscriptions'
      });
    }

    // TODO: Implement database query for user tracking subscriptions
    // const subscriptions = await storage.getUserTrackingSubscriptions(userId);

    // Placeholder response until database implementation
    res.json({
      success: true,
      subscriptions: [],
      message: 'Tracking subscriptions will appear here once containers are being tracked'
    });

  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      error: 'Unable to retrieve subscriptions',
      message: 'Error accessing tracking subscriptions'
    });
  }
}

/**
 * Advanced tracking search with multiple parameters
 */
export async function advancedTrackingSearch(req: Request, res: Response) {
  try {
    const { 
      trackingNumber, 
      searchType, 
      dateRange, 
      shippingLine, 
      route, 
      containerType 
    } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({
        error: 'Tracking number required',
        message: 'Please provide a tracking number for advanced search'
      });
    }

    // Start with basic search
    const basicResult = await trackTraceService.searchContainer(trackingNumber);

    if (!basicResult) {
      return res.status(404).json({
        error: 'Container not found',
        message: 'No tracking information found',
        searchCriteria: { trackingNumber, searchType, containerType }
      });
    }

    // Enhanced result with additional filtering (when available)
    const enhancedResult = {
      ...basicResult,
      searchCriteria: {
        trackingNumber,
        searchType: searchType || 'container',
        dateRange,
        shippingLine,
        route,
        containerType
      },
      metadata: {
        searchTimestamp: new Date().toISOString(),
        dataSource: 'track-trace-connect',
        enhancedSearch: true
      }
    };

    res.json({
      success: true,
      data: enhancedResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      error: 'Advanced search failed',
      message: 'Unable to complete advanced tracking search'
    });
  }
}