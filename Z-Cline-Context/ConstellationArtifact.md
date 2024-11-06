import React from 'react';
import { Star, Calendar, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

const MeetingConstellations = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-gray-100">Meeting Insights Constellation™</h1>
          <div className="px-2 py-1 bg-blue-500/20 rounded-full">
            <p className="text-xs text-blue-400">Voice Transformed</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm italic">"Team sync on Cleanse landing page, training videos, and upcoming launches..."</p>
      </div>

      {/* Main Constellation View */}
      <div className="grid gap-6">
        {/* Primary Constellation: Cleanse Launch */}
        <div className="bg-gray-800/50 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent)] opacity-50" />
          
          {/* Major Insight */}
          <div className="relative z-10 bg-gray-800 rounded-lg p-4 mb-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-400" fill="currentColor" />
              </div>
              <h3 className="text-lg font-medium text-blue-400">Cleanse Launch Strategy</h3>
            </div>
            <p className="text-gray-300 text-sm">January product launch with December pre-sale window</p>
          </div>

          {/* Connected Insights */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-blue-500/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-200">Landing Page</h4>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-xs">• Quiz reduced to 6 questions</p>
                <p className="text-gray-400 text-xs">• Four videos with thumbnails</p>
                <p className="text-gray-400 text-xs">• Mobile-optimized design</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-blue-500/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-200">Content Requirements</h4>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-xs">• Video titles match shipper</p>
                <p className="text-gray-400 text-xs">• Simple navigation flow</p>
                <p className="text-gray-400 text-xs">• Mobile-first approach</p>
              </div>
            </div>
          </div>

          {/* Timeline Evidence */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Pre-sale Start', date: 'December' },
              { title: 'Product Launch', date: 'Early January' },
              { title: 'Shipping Window', date: 'First Week Jan' }
            ].map((milestone, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-blue-500/10">
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-400 mb-1">{milestone.date}</div>
                  <div className="text-xs text-gray-400">{milestone.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Constellation: Training & Education */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h3 className="text-gray-200 font-medium">Training & Education</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-purple-500/10">
              <h4 className="text-sm font-medium text-gray-200 mb-3">Training Video</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span className="text-xs text-gray-400">5-minute format with Brenda</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span className="text-xs text-gray-400">Need presentation reprint</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span className="text-xs text-gray-400">Requires compliance review</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-purple-500/10">
              <h4 className="text-sm font-medium text-gray-200 mb-3">Education Summit</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span className="text-xs text-gray-400">January 23-24</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span className="text-xs text-gray-400">All educators attending</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span className="text-xs text-gray-400">Multiple breakout sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Open Questions & New Discoveries */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h3 className="text-gray-200 font-medium">Open Questions</h3>
            </div>
            <div className="space-y-3">
              {[
                'Expo West participation details?',
                'Training video shoot location?',
                'Literature quantity needed?'
              ].map((question, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3 border border-amber-500/10">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-sm text-gray-300">{question}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-gray-200 font-medium">Action Items</h3>
            </div>
            <div className="space-y-3">
              {[
                'Schedule Brenda video shoot',
                'Update Amazon/website assets',
                'Print new presentation materials'
              ].map((action, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3 border border-emerald-500/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-gray-300">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingConstellations;