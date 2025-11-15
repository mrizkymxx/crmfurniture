'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MRPPage() {
  const modules = [
    {
      title: 'Bill of Materials (BOM)',
      description: 'Define product structures and material requirements',
      icon: '📋',
      href: '/mrp/bom',
    },
    {
      title: 'Work Orders',
      description: 'Create and manage production work orders',
      icon: '⚙️',
      href: '/mrp/work-orders',
    },
    {
      title: 'Production Tracking',
      description: 'Track production progress and logs',
      icon: '📊',
      href: '/mrp/production',
    },
    {
      title: 'Material Requirements',
      description: 'Calculate required raw materials for production',
      icon: '🔍',
      href: '/mrp/requirements',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MRP (Material Requirements Planning)</h1>
        <p className="text-gray-600">Manage production planning and material requirements</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <Card key={module.href} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{module.icon}</span>
                <CardTitle>{module.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <Link href={module.href}>
                <Button>Open Module</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
