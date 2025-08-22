/**
 * Scheduler for recurring tasks
 * Handles automated per diem billing and other scheduled operations
 */

const calendarService = require('./calendar-service');

class Scheduler {
  constructor(interval = 86400000) { // Default: run once per day (in milliseconds)
    this.interval = interval;
    this.timer = null;
    this.isRunning = false;
  }

  /**
   * Start the scheduler
   */
  start() {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log(`Starting scheduler to run every ${this.interval / 1000} seconds`);
    
    // Run immediately once on startup
    this.runTasks();
    
    // Then set up the interval
    this.timer = setInterval(() => this.runTasks(), this.interval);
    this.isRunning = true;
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (!this.isRunning) {
      console.log('Scheduler is not running');
      return;
    }

    clearInterval(this.timer);
    this.timer = null;
    this.isRunning = false;
    console.log('Scheduler stopped');
  }

  /**
   * Run all scheduled tasks
   */
  async runTasks() {
    console.log('Running scheduled tasks...');
    const startTime = Date.now();

    try {
      // Process per diem charges
      const perDiemResults = await this.processPerDiemCharges();
      
      // Add more scheduled tasks here as needed
      
      const endTime = Date.now();
      console.log(`Tasks completed in ${endTime - startTime}ms`);
      
      return {
        perDiemResults
      };
    } catch (error) {
      console.error('Error running scheduled tasks:', error);
    }
  }

  /**
   * Process per diem charges for all contracts
   */
  async processPerDiemCharges() {
    try {
      console.log('Processing per diem charges...');
      const results = await calendarService.processDailyPerDiemCharges();
      console.log(`Processed ${results.length} per diem charges`);
      return results;
    } catch (error) {
      console.error('Error processing per diem charges:', error);
      return [];
    }
  }
}

// Create singleton instance
const scheduler = new Scheduler();

module.exports = scheduler;