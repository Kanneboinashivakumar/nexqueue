import Token from '../models/Token.js';
import Counter from '../models/Counter.js'; // Import Counter model

// Calculate estimated wait time for a patient
export const calculateWaitTime = (tokensAhead, avgConsultationTime = 10) => {
  return tokensAhead * avgConsultationTime;
};

// Recalculate all queue positions
export const recalculateQueue = async (TokenModel) => {
  const tokens = await TokenModel.find({ status: 'waiting' })
    .sort({ priorityScore: -1, arrivalTime: 1 });
  
  for (let i = 0; i < tokens.length; i++) {
    tokens[i].currentPosition = i + 1;
    tokens[i].estimatedWaitTime = calculateWaitTime(i);
    await tokens[i].save();
  }
  
  return tokens;
};

// FIXED: Atomic token number generation - NO DUPLICATES GUARANTEED
export const generateTokenNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Atomic counter update - MongoDB will handle concurrency
  const counter = await Counter.findOneAndUpdate(
    { date: dateStr },
    { $inc: { sequence: 1 } },
    { 
      upsert: true,  // Create if doesn't exist
      new: true,     // Return updated document
      setDefaultsOnInsert: true
    }
  );
  
  // Generate token with the atomic counter value
  const sequence = String(counter.sequence).padStart(3, '0');
  return `T-${dateStr}-${sequence}`;
};