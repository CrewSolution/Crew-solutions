'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Apprentice, Shop } from '@/lib/types'

export default function AdminDashboard() {
  const [apprentices, setApprentices] = useState<Apprentice[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [showAll, setShowAll] = useState(false)

  const filteredApprentices = apprentices
    .filter((a) => `${a.first_name} ${a.last_name}`.toLowerCase().includes(search.toLowerCase()))
    .filter((a) => (filterYear ? String(a.experience_year) === filterYear : true))
    .slice(0, showAll ? apprentices.length : 9)

  const filteredShops = shops
    .filter((s) => `${s.business_name}`.toLowerCase().includes(search.toLowerCase()))
    .slice(0, showAll ? shops.length : 9)

  async function fetchData() {
    setLoading(true)
    setError(null)
    const [apprenticeRes, shopRes] = await Promise.all([
      supabase.from('apprentices').select('*'),
      supabase.from('shops').select('*')
    ])

    if (apprenticeRes.error) {
      setError(`Error loading apprentices: ${apprenticeRes.error.message}`)
    } else {
      setApprentices(apprenticeRes.data as Apprentice[])
    }

    if (shopRes.error) {
      setError(prev => prev ? prev + ` | Error loading shops: ${shopRes.error.message}` : `Error loading shops: ${shopRes.error.message}`)
    } else {
      setShops(shopRes.data as Shop[])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-8 space-y-12 min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-800">Admin Dashboard</h1>
        <Button onClick={fetchData}>Refresh</Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Search apprentices or shops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xl border-gray-300 shadow-sm"
        />
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="mt-2 md:mt-0 border border-gray-300 rounded-md p-2 shadow-sm"
        >
          <option value="">All Years</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
          <option value="5">Year 5</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">{error}</p>
      ) : (
        <div className="space-y-10">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-700">Apprentices ({filteredApprentices.length})</h2>
              {!showAll && apprentices.length > 9 && (
                <Button variant="outline" onClick={() => setShowAll(true)}>Show All</Button>
              )}
            </div>
            {filteredApprentices.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No apprentices found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApprentices.map((a) => (
                  <Card key={a.id} className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                    <CardContent className="p-6 space-y-2">
                      <p className="text-lg font-semibold text-gray-900">{a.first_name} {a.last_name}</p>
                      <p className="text-sm text-gray-700">Experience Year: {a.experience_year}</p>
                      <p className="text-sm text-gray-600">Location: {a.location || 'N/A'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-700">Shops ({filteredShops.length})</h2>
              {!showAll && shops.length > 9 && (
                <Button variant="outline" onClick={() => setShowAll(true)}>Show All</Button>
              )}
            </div>
            {filteredShops.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No shops found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShops.map((s) => (
                  <Card key={s.id} className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
                    <CardContent className="p-6 space-y-2">
                      <p className="text-lg font-semibold text-gray-900">{s.business_name}</p>
                      <p className="text-sm text-gray-700">Contact: {s.contact_name || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Location: {s.location || 'N/A'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
