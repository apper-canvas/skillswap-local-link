import MainFeature from '../components/MainFeature';

export default function Home() {
  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading text-primary">SkillSwap Local</h1>
            <p className="text-gray-600">Connect, Learn, Teach with neighbors</p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">12</span>
            </div>
            <span className="text-gray-600">credits</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <MainFeature />
      </div>
    </div>
  );
}