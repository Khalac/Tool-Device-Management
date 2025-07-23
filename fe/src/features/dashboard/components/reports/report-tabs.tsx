import { CardHeader } from '@/components/ui'
import { FileText, GitCompare } from 'lucide-react'

type TabKey = 'overview' | 'comparison'

interface ReportTabsProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export const ReportTabs = ({ activeTab, onTabChange }: ReportTabsProps) => {
  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: FileText },
    { key: 'comparison' as const, label: 'Comparison', icon: GitCompare },
  ]

  return (
    <CardHeader>
      <div className='flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            type='button'
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-gray-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600/50 dark:hover:text-gray-100'
            }`}
          >
            <tab.icon className='h-4 w-4' />
            {tab.label}
          </button>
        ))}
      </div>
    </CardHeader>
  )
}
