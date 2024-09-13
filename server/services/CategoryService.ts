import { slugify } from '../utils/slugify'
import { useOpenAiService } from './OpenAiService'

export const useCategoryService = () => {
  const { classify } = useOpenAiService()
  const client = useServerSupabaseClient()

  const createOrUpdateCategory = async (prompt: string) => {
    const title = await classify(prompt)

    const slug = slugify(title)
    const { data: exists } = await client.from('categories').select('id, items').eq('slug', slug).single()
    if (exists) {
      await client.from('categories').update({ items: exists.items + 1 }).eq('slug', slug)
      return exists.id
    }
    const { data, error } = await client.from('categories').insert({ title, slug, items: 1 }).select('id').single()
    if (error) throw error
    return data.id
  }

  return {
    createOrUpdateCategory
  }
}
