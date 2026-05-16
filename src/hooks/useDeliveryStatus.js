import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useDeliveryStatus() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('config')
      .select('value')
      .eq('key', 'delivery_enabled')
      .single()
      .then(({ data }) => {
        setEnabled(data?.value === 'true')
        setLoading(false)
      })

    const channel = supabase
      .channel('delivery-status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'config',
        filter: 'key=eq.delivery_enabled',
      }, ({ new: row }) => {
        setEnabled(row.value === 'true')
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const toggle = async (value) => {
    await supabase
      .from('config')
      .update({ value: String(value) })
      .eq('key', 'delivery_enabled')
    setEnabled(value)
  }

  return { enabled, loading, toggle }
}
