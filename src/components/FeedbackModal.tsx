import React, { useState } from 'react';
import { transitAudio } from '../utils/audio';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('Arrival Timing Accuracy');
  const [serviceNo, setServiceNo] = useState('65');
  const [comments, setComments] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    transitAudio.playArrivalChime();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComments('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DFE1E6] flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#40073e] text-[24px]">rate_review</span>
            <h2 className="font-display text-lg font-bold text-[#191c21]">
              Commuter Feedback
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#81737c] hover:text-[#191c21] hover:bg-[#f2f3fa] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
            <span className="material-symbols-outlined text-[#00875A] text-[48px]">check_circle</span>
            <h3 className="font-display text-base font-bold text-[#191c21]">
              Thank You for Your Feedback!
            </h3>
            <p className="text-xs text-[#81737c]">
              Your transit report has been logged with SBS Transit Operations.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#4f434c]">Feedback Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 rounded-lg bg-[#f2f3fa] border border-[#DFE1E6] text-[#191c21] focus:outline-none focus:border-[#40073e]"
              >
                <option value="Arrival Timing Accuracy">Arrival Timing Accuracy</option>
                <option value="Crowding & Capacity">Crowding &amp; Vehicle Capacity</option>
                <option value="Cleanliness & Amenities">Cleanliness &amp; Air-Conditioning</option>
                <option value="Bus Captain Commendation">Bus Captain Commendation</option>
                <option value="Route Suggestion">Route / Frequency Suggestion</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#4f434c]">Bus Service No.</label>
              <input
                type="text"
                value={serviceNo}
                onChange={(e) => setServiceNo(e.target.value)}
                className="p-2 rounded-lg bg-[#f2f3fa] border border-[#DFE1E6] text-[#191c21] focus:outline-none focus:border-[#40073e] uppercase"
                placeholder="e.g. 65, 14, 106..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#4f434c]">Details / Remarks</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                required
                className="p-2 rounded-lg bg-[#f2f3fa] border border-[#DFE1E6] text-[#191c21] focus:outline-none focus:border-[#40073e] resize-none"
                placeholder="Describe your commute experience or observation..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#DFE1E6]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#ecedf5] text-[#191c21] rounded-lg font-bold hover:bg-[#e1e2e9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#40073e] hover:bg-[#592055] text-white rounded-lg font-bold"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
