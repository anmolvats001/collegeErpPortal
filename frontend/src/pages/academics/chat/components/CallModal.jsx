import React, { useState } from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Copy,
  Check,
  Share2,
  Users,
  Monitor,
  Sparkles,
} from 'lucide-react';

export const CallModal = ({ isOpen, onClose, call, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  if (!call) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(call.joinCode || call.meetingLink || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnd = async () => {
    setIsEnding(true);
    try {
      if (onEndCall) await onEndCall(call.callId);
      onClose();
    } finally {
      setIsEnding(false);
    }
  };

  const isVideo = call.callType === 'VIDEO';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isVideo ? 'Video Conference' : 'Audio Lecture Room'}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Conference Header / Join Code Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900 text-white rounded-xl">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {call.topic || 'Class Discussion Session'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-semibold">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Created by {call.creatorName || call.createdBy || 'Faculty'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-amber-400">
              Code: {call.joinCode || 'CS301X'}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white transition"
              title="Copy Join Code"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Meeting Screen Stage */}
        <div className="relative bg-slate-950 rounded-xl overflow-hidden min-h-[320px] flex items-center justify-center p-4 border border-slate-800">
          {isVideo && !isVideoOff ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
              {/* Speaker Video Tile */}
              <div className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700 aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 opacity-90"></div>
                <div className="relative text-center z-10">
                  <div className="w-16 h-16 rounded-full bg-purple-600 text-white text-xl font-bold flex items-center justify-center mx-auto shadow-lg ring-4 ring-purple-400/30">
                    SV
                  </div>
                  <p className="text-xs font-bold text-white mt-2">Prof. Sunita Verma (Host)</p>
                  <p className="text-[10px] text-slate-400">Faculty Speaking...</p>
                </div>
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                  Prof. Sunita Verma
                </span>
              </div>

              {/* Student Video Tile */}
              <div className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700 aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 opacity-90"></div>
                <div className="relative text-center z-10">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto shadow-lg ring-4 ring-blue-400/30">
                    YOU
                  </div>
                  <p className="text-xs font-bold text-white mt-2">You (Connected)</p>
                  <p className="text-[10px] text-slate-400">
                    {isMuted ? 'Mic Muted' : 'Mic Active'}
                  </p>
                </div>
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                  You
                </span>
                {isMuted && (
                  <span className="absolute top-2 right-2 text-red-500 bg-slate-900/80 p-1 rounded-full">
                    <MicOff size={14} />
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Audio Only Mode */
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-blue-400 shadow-2xl ring-8 ring-blue-900/20">
                <Users size={36} />
              </div>
              <h4 className="text-sm font-bold text-white mt-4">Audio Conference In Progress</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Audio transmission active with high-definition voice clarity.
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Prof. Sunita Verma
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 border border-slate-700">
                  Rahul Mehta
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 border border-slate-700">
                  Ananya Sen
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Media Controls Bar */}
        <div className="flex items-center justify-center gap-3 p-3 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full transition shadow-sm ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {isVideo && (
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full transition shadow-sm ${
                isVideoOff
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
              }`}
              title={isVideoOff ? 'Start Camera' : 'Turn Off Camera'}
            >
              {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>
          )}

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-full transition shadow-sm ${
              isScreenSharing
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
            title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
          >
            <Monitor size={18} />
          </button>

          <button
            onClick={handleEnd}
            disabled={isEnding}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition ml-4"
            title="Leave / End Call"
          >
            <PhoneOff size={16} />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
