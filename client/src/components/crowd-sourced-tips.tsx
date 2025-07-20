import { MessageCircle, Clock, Users, MapPin, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CrowdTip {
  id: number;
  category: string; // "security", "skylink", "amenities", "general"
  location: string; // "Terminal A", "Terminal C Gate 16", etc.
  message: string;
  timePosted: string;
  helpful: number | null;
  userName?: string | null;
}

interface CrowdSourcedTipsProps {
  data: CrowdTip[];
  onSubmitTip?: (tip: Omit<CrowdTip, 'id' | 'timePosted' | 'helpful'>) => void;
}

export default function CrowdSourcedTips({ data, onSubmitTip }: CrowdSourcedTipsProps) {
  const [showForm, setShowForm] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return Users;
      case 'skylink': return Clock;
      case 'amenities': return Star;
      default: return MessageCircle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'bg-red-50 text-red-700 border-red-200';
      case 'skylink': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'amenities': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const recentTips = data.slice(0, 5); // Show 5 most recent tips

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="text-primary mr-3 h-6 w-6" />
          Real-Time Tips from Travelers
        </h2>
        <Button 
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Share Tip</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tips List */}
        <div className="divide-y divide-gray-100">
          {recentTips.map((tip) => {
            const CategoryIcon = getCategoryIcon(tip.category);
            
            return (
              <div key={tip.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CategoryIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(tip.category)}`}>
                        {tip.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {tip.location}
                      </div>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{tip.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{tip.timePosted}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{tip.helpful || 0} helpful</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Form (collapsible) */}
        {showForm && (
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-3">Share your experience</h3>
            <div className="space-y-3">
              <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Select category</option>
                <option value="security">Security Lines</option>
                <option value="skylink">Skylink Train</option>
                <option value="amenities">Food & Shops</option>
                <option value="general">General</option>
              </select>
              <input 
                type="text" 
                placeholder="Location (e.g., Terminal C Gate 16)"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
              <textarea 
                placeholder="Your tip (e.g., Security line at Terminal D took 12 minutes around noon)"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm h-20 resize-none"
              />
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">Submit Tip</Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="p-3 bg-blue-50 border-t border-gray-100">
          <p className="text-sm text-blue-800 flex items-center">
            <MessageCircle className="inline mr-1 h-4 w-4" />
            Tips are shared by fellow travelers. Times and conditions may vary throughout the day.
          </p>
        </div>
      </div>
    </section>
  );
}