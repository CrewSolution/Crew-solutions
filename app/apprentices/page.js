'use client'

import { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'

export default function ApprenticeList() {
  const [apprentices, setApprentices] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('apprentices')
        .select('*')
        .order('experience_year', { ascending: true })

      if (error) {
        console.error('Error fetching apprentices:', error)
      } else {
        setApprentices(data)
      }
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Apprentices</h1>
      <ul>
        {apprentices.map((a) => (
          <li key={a.id}>
            {a.first_name} {a.last_name} — Year {a.experience_year}
          </li>
        ))}
      </ul>
    </div>
  )
}

