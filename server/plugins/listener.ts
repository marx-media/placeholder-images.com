import { createClient } from '@supabase/supabase-js'

// generate random seed for picsum image
const generateSeed = () => Math.floor(Math.random() * 1000)

export default defineNitroPlugin(() => {
  const { supabase: { serviceKey }, public: { supabase: { url } } } = useRuntimeConfig()
  const client = createClient(url, serviceKey)

  client.channel('generations').on('postgres_changes', {
    event: 'INSERT', schema: 'public', table: 'generations'
  }, (payload) => {
    const id = payload.new.id

    // random delay to simulate a long running task between 2000 and 5000 ms
    const delay = Math.floor(Math.random() * 3000) + 2000

    setTimeout(async () => {
      const images = [`https://picsum.photos/seed/${generateSeed()}/300/300`, `https://picsum.photos/seed/${generateSeed()}/300/300`]

      await Promise.all(images.map(url => client.from('images').insert({ generation: id, url })))

      await client.from('generations').update({ status: 'COMPLETED' }).eq('id', id)
    }, delay)
  }).subscribe()
})
