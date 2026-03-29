'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Users, Clock, Calendar as CalendarIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DoctorEarningsPage() {
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [activePatients, setActivePatients] = useState(0)
  const [monthlyAppts, setMonthlyAppts] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) { setLoading(false); return }

        const resp = await fetch('http://127.0.0.1:8000/api/dashboard/earnings', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (resp.ok) {
          const data = await resp.json()
          setTotalEarnings(data.total_earnings ?? 0)
          setActivePatients(data.active_patients ?? 0)
          setMonthlyAppts(data.monthly_appointments ?? 0)
          setPendingCount(data.pending_count ?? 0)

          if (data.monthly_chart && data.monthly_chart.length > 0) {
            setChartData(data.monthly_chart)
          }

          if (data.transactions && data.transactions.length > 0) {
            setTransactions(data.transactions.map((tx: any, idx: number) => ({
              id: `api_${idx}`,
              date: new Date(tx.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              amount: `+$${Number(tx.amount).toFixed(2)}`,
              patientName: tx.patient,
              status: tx.status
            })))
          }
        }
      } catch (e) {
        console.error('Failed to load earnings from backend', e)
      } finally {
        setLoading(false)
      }
    }
    fetchEarnings()
  }, [])

  const data = chartData.length > 0 ? chartData : [{ name: 'No data yet', earnings: 0 }]

  const stats = [
    {
      title: 'Total Earnings',
      value: loading ? '...' : `$${totalEarnings.toLocaleString()}`,
      change: totalEarnings > 0 ? 'From confirmed bookings' : 'No earnings yet',
      isPositive: totalEarnings > 0,
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Active Patients',
      value: loading ? '...' : activePatients.toString(),
      change: activePatients > 0 ? `${activePatients} unique patient${activePatients !== 1 ? 's' : ''}` : 'No patients yet',
      isPositive: activePatients > 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Monthly Appointments',
      value: loading ? '...' : monthlyAppts.toString(),
      change: monthlyAppts > 0 ? 'Confirmed this month' : 'None this month',
      isPositive: monthlyAppts > 0,
      icon: CalendarIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Pending Requests',
      value: loading ? '...' : pendingCount.toString(),
      change: pendingCount > 0 ? 'Awaiting your review' : 'All clear ✓',
      isPositive: pendingCount === 0,
      icon: Clock,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center mb-2">
          Earnings Dashboard
        </h1>
        <p className="text-slate-500 font-medium">Track your income, appointments, and patient growth.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-0 shadow-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-sm font-bold ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                </div>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">{stat.title}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="xl:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly earnings from confirmed bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                    tickFormatter={(value) => `$${value}`}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`$${value}`, 'Earnings']}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Deposits</CardTitle>
            <CardDescription>Payments from confirmed appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {transactions.length === 0 && !loading && (
                <div className="text-center py-10 text-slate-400">
                  <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No transactions yet</p>
                  <p className="text-xs">Earnings will appear when bookings are confirmed.</p>
                </div>
              )}
              {transactions.map((tx, idx) => (
                <div key={tx.id || idx} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mr-4">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{tx.patientName ? `Payment from ${tx.patientName}` : 'Payout'}</p>
                      <p className="text-xs text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">{tx.amount}</p>
                    <p className={`text-xs font-medium ${tx.status === 'Completed' ? 'text-slate-500' : 'text-orange-500'}`}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
              {transactions.length > 0 && (
                <Button variant="outline" className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50">
                  View All Transactions
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
