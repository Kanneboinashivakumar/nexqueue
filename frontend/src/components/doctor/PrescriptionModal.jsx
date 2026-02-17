import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

const PrescriptionModal = ({ isOpen, onClose, patient, doctorId }) => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', quantity: 1 }],
    labTests: [{ testName: '', instructions: '', urgent: false }],
    notes: '',
    followUpDate: ''
  })

  const [loading, setLoading] = useState(false)

  const handleMedicineChange = (index, field, value) => {
    const updated = [...formData.medicines]
    updated[index][field] = value
    setFormData({ ...formData, medicines: updated })
  }

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: '', dosage: '', frequency: '', duration: '', quantity: 1 }]
    })
  }

  const removeMedicine = (index) => {
    if (formData.medicines.length > 1) {
      const updated = formData.medicines.filter((_, i) => i !== index)
      setFormData({ ...formData, medicines: updated })
    }
  }

  const handleLabTestChange = (index, field, value) => {
    const updated = [...formData.labTests]
    updated[index][field] = value
    setFormData({ ...formData, labTests: updated })
  }

  const addLabTest = () => {
    setFormData({
      ...formData,
      labTests: [...formData.labTests, { testName: '', instructions: '', urgent: false }]
    })
  }

  const removeLabTest = (index) => {
    if (formData.labTests.length > 1) {
      const updated = formData.labTests.filter((_, i) => i !== index)
      setFormData({ ...formData, labTests: updated })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const prescriptionData = {
        patientId: patient._id,
        diagnosis: formData.diagnosis,
        medicines: formData.medicines.filter(m => m.name && m.dosage),
        labTests: formData.labTests.filter(t => t.testName),
        notes: formData.notes,
        followUpDate: formData.followUpDate || null
      }

      const response = await axios.post('/api/prescriptions/create', prescriptionData)
      
      toast.success('✅ Prescription created successfully!')
      toast.success('🔬 Lab tests added to queue')
      toast.success('💊 Medicines added to pharmacy queue')
      
      onClose()
    } catch (error) {
      toast.error('Failed to create prescription')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create Prescription</h2>
                <p className="text-blue-100">
                  For: {patient?.fullName} | Age: {patient?.age}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Viral Fever, Hypertension, Diabetes"
              />
            </div>

            {/* Medicines Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Medicines</label>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200"
                >
                  + Add Medicine
                </button>
              </div>
              
              {formData.medicines.map((med, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                  {formData.medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <input
                      type="text"
                      placeholder="Medicine name"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 650mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Frequency"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={med.quantity}
                      onChange={(e) => handleMedicineChange(index, 'quantity', parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded"
                      min="1"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Lab Tests Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Lab Tests</label>
                <button
                  type="button"
                  onClick={addLabTest}
                  className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-200"
                >
                  + Add Lab Test
                </button>
              </div>

              {formData.labTests.map((test, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 relative">
                  {formData.labTests.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLabTest(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Test name"
                      value={test.testName}
                      onChange={(e) => handleLabTestChange(index, 'testName', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Instructions"
                      value={test.instructions}
                      onChange={(e) => handleLabTestChange(index, 'instructions', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={test.urgent}
                        onChange={(e) => handleLabTestChange(index, 'urgent', e.target.checked)}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm text-gray-700">Urgent</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Any special instructions..."
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Date (Optional)
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Prescription'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PrescriptionModal