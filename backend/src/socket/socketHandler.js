import Token from '../models/Token.js';
import { recalculateQueue } from '../utils/priorityCalculator.js';

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // Join queue room for staff
    socket.on('join-queue-room', () => {
      socket.join('queue-room');
      console.log(`👥 Staff joined queue room: ${socket.id}`);
    });

    // Join doctor room for doctor dashboard
    socket.on('join-doctor-room', () => {
      socket.join('doctor-room');
      console.log(`👨‍⚕️ Doctor joined doctor room: ${socket.id}`);
    });

    // Join user room for patients
    socket.on('join-user-room', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`👤 Patient joined user room: ${userId}`);
    });

    // Handle next patient call
    socket.on('call-next-patient', async (data) => {
      try {
        console.log('📞 Calling next patient...');
        
        const nextToken = await Token.findOne({ status: 'waiting' })
          .sort({ priorityScore: -1, arrivalTime: 1 })
          .populate('patientId', 'fullName email phone age priorityType');
        
        if (nextToken) {
          nextToken.status = 'called';
          nextToken.calledAt = new Date();
          await nextToken.save();
          
          await recalculateQueue(Token);
          
          const updatedToken = await Token.findById(nextToken._id)
            .populate('patientId', 'fullName email phone age priorityType');
          
          // Emit to staff
          io.to('queue-room').emit('patient-called', {
            token: updatedToken,
            calledBy: data.staffId
          });
          
          // Emit to doctor
          io.to('doctor-room').emit('patient-called-doctor', {
            token: updatedToken,
            message: 'New patient ready for consultation'
          });
          
          // Emit to patient
          io.to(`user-${nextToken.patientId}`).emit('your-turn', {
            message: 'Please proceed to the doctor',
            token: updatedToken
          });

          // Update queue
          io.to('queue-room').emit('queue-updated', {});
          
          console.log(`✅ Patient called: ${updatedToken.tokenNumber}`);
        } else {
          console.log('❌ No patients in queue');
        }
      } catch (error) {
        console.error('❌ Call next patient error:', error);
      }
    });

    // Handle emergency priority
    socket.on('mark-emergency', async (data) => {
      try {
        const token = await Token.findById(data.tokenId)
          .populate('patientId', 'fullName email phone age priorityType');
        
        if (token) {
          token.priorityType = 'emergency';
          token.priorityScore = token.calculatePriorityScore();
          await token.save();
          
          await recalculateQueue(Token);
          
          io.to('queue-room').emit('emergency-updated', { token });
          io.to('doctor-room').emit('queue-updated-doctor', {});
          io.to('queue-room').emit('queue-updated', {});
          
          console.log(`🚨 Token ${token.tokenNumber} marked as emergency`);
        }
      } catch (error) {
        console.error('❌ Emergency update error:', error);
      }
    });

    // Handle consultation complete
    socket.on('consultation-complete', async (data) => {
      try {
        const token = await Token.findById(data.tokenId);
        if (token) {
          token.status = 'completed';
          token.servedAt = new Date();
          await token.save();
          
          await recalculateQueue(Token);
          
          io.to('queue-room').emit('queue-updated', {});
          io.to('doctor-room').emit('consultation-completed', { tokenId: data.tokenId });
          
          console.log(`✅ Consultation completed for token: ${token.tokenNumber}`);
        }
      } catch (error) {
        console.error('❌ Consultation complete error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
};